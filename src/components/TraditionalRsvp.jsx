import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { generateConfirmationCode, slugify } from '../lib/utils';

export default function TraditionalRsvp() {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState(null); // true | false | null
  const [partySize, setPartySize] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const isPersonalized = Boolean(guest);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (!invite || !supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from('guests')
      .select('*')
      .eq('slug', invite)
      .single()
      .then(({ data }) => {
        if (data) {
          setGuest(data);
          if (data.traditional_attending !== null) {
            setAttending(data.traditional_attending);
            setPartySize(data.traditional_party_size || 1);
          } else {
            setPartySize(data.party_size || 1);
          }
        }
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (attending === null || !supabaseConfigured) return;
    setError(null);

    if (isPersonalized) {
      const { error: err } = await supabase
        .from('guests')
        .update({
          traditional_attending: attending,
          traditional_party_size: attending ? partySize : 0,
          traditional_responded_at: new Date().toISOString(),
        })
        .eq('slug', guest.slug);
      if (err) {
        setError('Une erreur est survenue, merci de réessayer.');
        return;
      }
    } else {
      if (!fullName.trim()) {
        setError('Merci de renseigner votre nom.');
        return;
      }
      const baseSlug = slugify(fullName) || 'invite';
      const newSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { error: err } = await supabase.from('guests').insert({
        full_name: fullName.trim(),
        slug: newSlug,
        confirmation_code: generateConfirmationCode(),
        party_size: attending ? partySize : 1,
        traditional_attending: attending,
        traditional_party_size: attending ? partySize : 0,
        traditional_responded_at: new Date().toISOString(),
      });
      if (err) {
        setError('Une erreur est survenue, merci de réessayer.');
        return;
      }
    }
    setSubmitted(true);
  }

  if (!supabaseConfigured || loading) return null;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white/50 border border-fuschia/15 rounded-sm p-6 text-left">
      {submitted ? (
        <p className="text-center font-display italic text-lg text-fuschia">
          {attending ? 'Merci, votre présence est notée pour la cérémonie traditionnelle !' : 'Merci de nous avoir répondu.'}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-center uppercase tracking-[0.2em] text-xs text-fuschia mb-4">
            Serez-vous présent&middot;e ?
          </p>

          {!isPersonalized && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              className="w-full border border-dawn-plum/20 bg-white px-3 py-2 text-sm mb-4 focus:outline-none focus:border-fuschia"
            />
          )}

          <div className="flex gap-4 justify-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={attending === true} onChange={() => setAttending(true)} className="accent-fuschia w-4 h-4" />
              Oui
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={attending === false} onChange={() => setAttending(false)} className="accent-fuschia w-4 h-4" />
              Non
            </label>
          </div>

          {attending === true && (
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wide opacity-60 mb-1 text-center">Nombre de personnes</label>
              <input
                type="number"
                min={1}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full border border-dawn-plum/20 bg-white px-3 py-2 text-sm text-center focus:outline-none focus:border-fuschia"
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
