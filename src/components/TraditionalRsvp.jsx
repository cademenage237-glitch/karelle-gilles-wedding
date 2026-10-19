import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';

function getTraditionalResponseKey() {
  const storageKey = 'cg_traditional_rsvp_response_key';
  let key = localStorage.getItem(storageKey);
  if (!key) {
    key = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `traditional-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(storageKey, key);
  }
  return key;
}

export default function TraditionalRsvp() {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState(null);
  const [partySize, setPartySize] = useState(1);
  const [responseKey, setResponseKey] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const isPersonalized = Boolean(guest);

  useEffect(() => {
    async function loadResponse() {
      if (!supabaseConfigured) {
        setLoading(false);
        return;
      }

      const invite = new URLSearchParams(window.location.search).get('invite');
      let key;

      if (invite) {
        const { data, error: guestError } = await supabase
          .from('guests')
          .select('id, full_name, slug, party_size')
          .eq('slug', invite)
          .maybeSingle();

        if (guestError || !data) {
          setError('Invitation introuvable. Vérifiez le lien reçu.');
          setLoading(false);
          return;
        }
        setGuest(data);
        setFullName(data.full_name);
        setPartySize(data.party_size || 1);
        key = `traditional:${data.slug}`;
      } else {
        key = getTraditionalResponseKey();
      }

      setResponseKey(key);
      const { data: existing, error: responseError } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('response_key', key)
        .maybeSingle();

      if (responseError) {
        setError('Le formulaire est momentanément indisponible. Merci de réessayer plus tard.');
      } else if (existing) {
        setFullName(existing.full_name);
        setAttending(existing.attending);
        setPartySize(existing.party_size || 1);
        setSubmitted(true);
      }
      setLoading(false);
    }

    loadResponse();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (attending === null || !supabaseConfigured || !responseKey) return;
    if (!isPersonalized && !fullName.trim()) {
      setError('Merci de renseigner votre nom.');
      return;
    }

    setError(null);
    const { error: insertError } = await supabase.from('rsvp_responses').insert({
      response_type: 'traditional',
      full_name: (guest?.full_name || fullName).trim(),
      attending,
      party_size: attending ? Math.max(1, Number(partySize) || 1) : 0,
      response_key: responseKey,
      invite_slug: guest?.slug || null,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        const { data: existing } = await supabase
          .from('rsvp_responses')
          .select('*')
          .eq('response_key', responseKey)
          .maybeSingle();
        if (existing) {
          setAttending(existing.attending);
          setPartySize(existing.party_size || 1);
          setSubmitted(true);
          return;
        }
      }
      setError('Une erreur est survenue, merci de réessayer.');
      return;
    }
    setSubmitted(true);
  }

  if (loading) return <p className="text-center opacity-60">Chargement du formulaire…</p>;
  if (!supabaseConfigured) return null;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white/50 border border-fuschia/15 rounded-sm p-6 text-left">
      {submitted ? (
        <p className="text-center font-display italic text-lg text-fuschia">
          {attending ? 'Merci, votre présence est notée pour la cérémonie traditionnelle !' : 'Merci de nous avoir répondu.'}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-center uppercase tracking-[0.2em] text-xs text-fuschia mb-4">
            Serez-vous présent·e ?
          </p>

          {!isPersonalized && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              className="w-full border border-dawn-plum/20 bg-white px-3 py-2 text-sm mb-4 focus:outline-none focus:border-fuschia"
              required
            />
          )}

          <div className="flex gap-4 justify-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" name="traditional-attending" checked={attending === true} onChange={() => setAttending(true)} className="accent-fuschia w-4 h-4" />
              Oui
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" name="traditional-attending" checked={attending === false} onChange={() => setAttending(false)} className="accent-fuschia w-4 h-4" />
              Non
            </label>
          </div>

          {attending === true && (
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wide opacity-60 mb-1 text-center">Nombre de personnes</label>
              <input
                type="number"
                min={1}
                max={guest?.party_size || undefined}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full border border-dawn-plum/20 bg-white px-3 py-2 text-sm text-center focus:outline-none focus:border-fuschia"
                required
              />
            </div>
          )}

          {error && <p className="text-fuschia text-xs text-center mb-3">{error}</p>}

          <button type="submit" disabled={attending === null} className="w-full bg-fuschia text-ivory py-2.5 text-sm uppercase tracking-wide hover:bg-fuschia-light transition-colors disabled:opacity-40">
            Confirmer
          </button>
        </form>
      )}
    </div>
  );
}
