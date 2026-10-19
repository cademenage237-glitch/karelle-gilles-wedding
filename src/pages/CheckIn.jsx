import { useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import QrScannerModal from '../components/QrScannerModal';

// Extrait un code à 4 chiffres ou un slug depuis le contenu brut d'un QR
// (fonctionne que le QR contienne juste le code, juste le slug, ou le lien complet ?invite=slug)
function parseQrValue(raw) {
  if (!raw) return { type: null, value: null };
  const trimmed = raw.trim();
  const codeMatch = trimmed.match(/^\d{4}$/);
  if (codeMatch) return { type: 'code', value: trimmed };

  try {
    const url = new URL(trimmed);
    const slug = url.searchParams.get('invite');
    if (slug) return { type: 'slug', value: slug };
  } catch {
    // pas une URL, on continue
  }

  return { type: 'slug', value: trimmed };
}

export default function CheckIn() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);
  const [searching, setSearching] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  async function runSearch(rawQuery) {
    const q = rawQuery.trim();
    if (!q || !supabaseConfigured) return;
    setSearching(true);
    setMessage(null);

    const isCode = /^\d{4}$/.test(q);
    const base = supabase.from('guests').select('*');
    const { data } = isCode ? await base.eq('confirmation_code', q) : await base.ilike('full_name', `%${q}%`);

    setResults(data || []);
    setSearching(false);
    if (!data || data.length === 0) setMessage('Aucun invité trouvé.');
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    runSearch(query);
  }

  async function handleScanResult(raw, errorMsg) {
    setScannerOpen(false);
    if (errorMsg) {
      setMessage(errorMsg);
      return;
    }
    const { type, value } = parseQrValue(raw);
    if (!value) return;

    if (type === 'code') {
      setQuery(value);
      runSearch(value);
    } else {
      // recherche directe par slug (lien personnalisé de l'invité)
      setSearching(true);
      setMessage(null);
      const { data } = await supabase.from('guests').select('*').eq('slug', value);
      setResults(data || []);
      setSearching(false);
      if (!data || data.length === 0) setMessage('QR non reconnu — aucun invité correspondant.');
    }
  }

  async function handleCheckIn(guest) {
    const { data, error } = await supabase
      .from('guests')
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('id', guest.id)
      .select()
      .single();

    if (!error && data) {
      setResults((prev) => prev.map((g) => (g.id === data.id ? data : g)));
      setMessage(`${data.full_name} a été enregistré(e).`);
    }
  }

  return (
    <div className="min-h-screen bg-soiree-plum text-ivory px-6 py-16 flex flex-col items-center">
      <p className="uppercase tracking-[0.35em] text-xs text-gold-light mb-3">Accueil des invités</p>
      <h1 className="font-display italic text-3xl mb-2">Carelle &amp; Gilles</h1>
      <p className="text-xs text-ivory/50 mb-10 text-center max-w-sm">
        Recherchez par nom même sans RSVP confirmée ou sans téléphone enregistré — si l&rsquo;invité
        est dans la liste, vous pouvez valider son arrivée.
      </p>

      {!supabaseConfigured ? (
        <p className="opacity-70">Connexion à la base d&rsquo;invités non configurée.</p>
      ) : (
        <div className="w-full max-w-md mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom ou code à 4 chiffres"
              className="flex-1 bg-transparent border border-ivory/30 px-4 py-3 focus:outline-none focus:border-gold-light"
            />
            <button type="submit" disabled={searching} className="bg-gold text-soiree-plum px-6 py-3 uppercase tracking-wide text-sm hover:bg-gold-light transition-colors">
              Chercher
            </button>
          </form>
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="w-full border border-gold-light text-gold-light py-3 text-sm uppercase tracking-[0.2em] hover:bg-gold-light hover:text-soiree-plum transition-colors"
          >
            📷 Scanner un QR code
          </button>
        </div>
      )}

      {message && <p className="text-rose mb-6">{message}</p>}

      <div className="w-full max-w-md space-y-4">
        {results.map((g) => (
          <div key={g.id} className="border border-ivory/15 p-5 flex justify-between items-center">
            <div>
              <p className="font-display italic text-xl">{g.full_name}</p>
              <p className="text-xs opacity-60 mt-1">
                Table <span className="text-gold-light">{g.table_number || 'non assignée'}</span> &middot; {g.rsvp_party_size ?? g.party_size} pers.
              </p>
              {g.rsvp_status !== 'confirmed' && (
                <p className="text-[11px] text-rose/80 mt-1">RSVP : {g.rsvp_status === 'declined' ? 'décliné' : 'en attente'}</p>
              )}
            </div>
            {g.checked_in ? (
              <span className="text-green-400 text-sm">✓ Arrivé</span>
            ) : (
              <button onClick={() => handleCheckIn(g)} className="border border-gold-light text-gold-light px-4 py-2 text-xs uppercase tracking-wide hover:bg-gold-light hover:text-soiree-plum transition-colors">
                Valider l&rsquo;arrivée
              </button>
            )}
          </div>
        ))}
      </div>

      {scannerOpen && <QrScannerModal onResult={handleScanResult} onClose={() => setScannerOpen(false)} />}
    </div>
  );
}
