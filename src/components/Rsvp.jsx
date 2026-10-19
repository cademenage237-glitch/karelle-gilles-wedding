import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { generateConfirmationCode, slugify } from '../lib/utils';
import InviteCard from './InviteCard';

function getGenericResponseKey() {
  const storageKey = 'cg_general_rsvp_response_key';
  let key = localStorage.getItem(storageKey);
  if (!key) {
    key = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `general-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(storageKey, key);
  }
  return key;
}

export default function Rsvp() {
  const [slug, setSlug] = useState(null);
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [partySize, setPartySize] = useState(1);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedGuest, setConfirmedGuest] = useState(null);
  const [responseKey, setResponseKey] = useState(null);

  const isPersonalized = Boolean(guest);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    setSlug(invite);

    if (!invite || !supabaseConfigured) {
      if (!invite && supabaseConfigured) {
        const key = getGenericResponseKey();
        setResponseKey(key);
        supabase.from('rsvp_responses').select('*').eq('response_key', key).maybeSingle()
          .then(({ data }) => {
            if (data) {
              setFullName(data.full_name);
              setStatus(data.attending ? 'confirmed' : 'declined');
              setPartySize(data.party_size || 1);
              setMessage(data.message || '');
              setSubmitted(true);
            }
            setLoading(false);
          });
        return;
      }
      setLoading(false);
      return;
    }

    supabase
      .from('guests')
      .select('*')
      .eq('slug', invite)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError("Invitation introuvable. Vérifiez le lien reçu.");
        } else {
          setGuest(data);
          setPartySize(data.rsvp_party_size ?? data.party_size ?? 1);
          setStatus(data.rsvp_status ?? 'pending');

          // Un invité ayant déjà répondu ne peut pas remplir le formulaire à nouveau :
          // à sa reconnexion, il retrouve directement l'écran de confirmation (avec son QR si confirmé).
          if (data.rsvp_status === 'confirmed' || data.rsvp_status === 'declined') {
            if (data.rsvp_status === 'confirmed') {
              setConfirmedGuest({ full_name: data.full_name, confirmation_code: data.confirmation_code });
            }
            setSubmitted(true);
          }
        }
        setLoading(false);
      });
  }, []);

  async function handleSubmitPersonalized(e) {
    e.preventDefault();
    if (!guest || !supabaseConfigured) return;
    setError(null);
    const { data, error: err } = await supabase
      .from('guests')
      .update({
        rsvp_status: status,
        rsvp_party_size: status === 'confirmed' ? Math.min(partySize, guest.party_size) : 0,
        rsvp_message: message,
      })
      .eq('slug', guest.slug)
      .eq('rsvp_status', 'pending')
      .select('id')
      .maybeSingle();

    if (err) {
      setError("Une erreur est survenue, merci de réessayer.");
    } else if (!data) {
      const { data: current } = await supabase.from('guests').select('*').eq('slug', guest.slug).maybeSingle();
      if (current && current.rsvp_status !== 'pending') {
        setStatus(current.rsvp_status);
        if (current.rsvp_status === 'confirmed') {
          setConfirmedGuest({ full_name: current.full_name, confirmation_code: current.confirmation_code });
        }
        setSubmitted(true);
      } else {
        setError("Cette invitation a déjà été utilisée ou n'est plus disponible.");
      }
    } else {
      setConfirmedGuest({ full_name: guest.full_name, confirmation_code: guest.confirmation_code });
      setSubmitted(true);
    }
  }

  async function handleSubmitGeneric(e) {
    e.preventDefault();
    if (!fullName.trim() || !supabaseConfigured || !responseKey) return;
    if (status === 'pending') {
      setError('Merci de choisir si vous serez présent ou non.');
      return;
    }
    setError(null);

    const { data: inserted, error: err } = await supabase
      .from('rsvp_responses')
      .insert({
        response_type: 'general',
        full_name: fullName.trim(),
        attending: status === 'confirmed',
        party_size: status === 'confirmed' ? Math.max(1, Number(partySize) || 1) : 0,
        message: message.trim() || null,
        response_key: responseKey,
      })
      .select()
      .single();

    if (err) {
      if (err.code === '23505') {
        const { data: existing } = await supabase.from('rsvp_responses').select('*').eq('response_key', responseKey).maybeSingle();
        if (existing) {
          setFullName(existing.full_name);
          setStatus(existing.attending ? 'confirmed' : 'declined');
          setPartySize(existing.party_size || 1);
          setMessage(existing.message || '');
          setSubmitted(true);
          return;
        }
      }
      setError("Une erreur est survenue, merci de réessayer.");
    } else if (inserted) {
      setSubmitted(true);
    }
  }

  return (
    <section id="rsvp" className="bg-civil-rosegold text-civil-plum py-28 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-fuschia mb-4">RSVP</p>
        <h2 className="font-display italic text-4xl md:text-5xl mb-6">Confirmez votre présence</h2>

        {loading && <p className="opacity-70">Chargement de votre invitation…</p>}

        {!loading && !supabaseConfigured && (
          <p className="opacity-80">
            Le formulaire RSVP sera activé dès la connexion à la base d&rsquo;invités
            (variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
          </p>
        )}

        {error && <p className="text-fuschia mb-4">{error}</p>}

        {!loading && supabaseConfigured && !submitted && (
          <form onSubmit={isPersonalized ? handleSubmitPersonalized : handleSubmitGeneric} className="text-left bg-ivory/60 rounded-sm p-8 mt-6">
            {isPersonalized ? (
              <p className="text-center mb-6 font-display italic text-2xl">Bienvenue, {guest.full_name}</p>
            ) : (
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-[0.2em] mb-2 opacity-70">Votre nom complet</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-civil-plum/30 bg-transparent px-4 py-2 focus:outline-none focus:border-fuschia" placeholder="Ex. Jean Mba" required />
              </div>
            )}

            <div className="mb-5">
              <span className="block text-xs uppercase tracking-[0.2em] mb-2 opacity-70">Serez-vous des nôtres ?</span>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStatus('confirmed')} className={`flex-1 py-3 border text-sm uppercase tracking-wide transition-colors ${status === 'confirmed' ? 'bg-fuschia text-ivory border-fuschia' : 'border-civil-plum/30 hover:border-fuschia'}`}>J&rsquo;y serai</button>
                <button type="button" onClick={() => setStatus('declined')} className={`flex-1 py-3 border text-sm uppercase tracking-wide transition-colors ${status === 'declined' ? 'bg-civil-plum text-ivory border-civil-plum' : 'border-civil-plum/30 hover:border-civil-plum'}`}>Je ne pourrai pas venir</button>
              </div>
            </div>

            {status === 'confirmed' && (
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-[0.2em] mb-2 opacity-70">
                  {isPersonalized ? `Nombre de personnes (max ${guest.party_size})` : 'Nombre de personnes'}
                </label>
                <input type="number" min={1} max={isPersonalized ? guest.party_size : undefined} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="w-full border border-civil-plum/30 bg-transparent px-4 py-2 focus:outline-none focus:border-fuschia" />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[0.2em] mb-2 opacity-70">Un mot pour les mariés (facultatif)</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full border border-civil-plum/30 bg-transparent px-4 py-2 focus:outline-none focus:border-fuschia" />
            </div>

            <button type="submit" disabled={status === 'pending'} className="w-full bg-fuschia text-ivory py-3 uppercase tracking-[0.2em] text-sm hover:bg-fuschia-light transition-colors disabled:opacity-40">Envoyer ma réponse</button>
          </form>
        )}

        {submitted && (
          <div className="bg-ivory/60 rounded-sm p-8 mt-6">
            <p className="font-display italic text-2xl mb-3">Merci !</p>
            <p className="opacity-80 mb-4">
              {status === 'confirmed' ? 'Votre présence est confirmée avec joie.' : 'Nous sommes tristes de ne pas vous voir, merci de nous avoir répondu.'}
            </p>
            {status === 'confirmed' && confirmedGuest && (
              <>
                <p className="opacity-80 text-sm mb-2">
                  Merci de présenter ce code à l&rsquo;entrée le jour J : il sera soit scanné,
                  soit saisi pour confirmer votre arrivée.
                </p>
                <InviteCard guest={confirmedGuest} />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
