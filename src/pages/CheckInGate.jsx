import { useState } from 'react';

const SESSION_KEY = 'cg_checkin_ok';

export function isCheckinUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export default function CheckInGate({ onUnlock }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const expected = import.meta.env.VITE_CHECKIN_PASSCODE || import.meta.env.VITE_ADMIN_PASSCODE;
    if (expected && passcode === expected) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-soiree-plum text-ivory flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="max-w-sm w-full text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-gold-light mb-4">Accès équipe</p>
        <h1 className="font-display italic text-3xl mb-3">Carelle &amp; Gilles</h1>
        <p className="text-sm text-ivory/60 mb-8">
          Cet espace est réservé à l&rsquo;équipe d&rsquo;accueil. Un code est nécessaire pour
          empêcher toute personne scannant le QR de l&rsquo;entrée de valider elle-même son accès.
        </p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Code équipe"
          className="w-full bg-transparent border border-ivory/30 px-4 py-3 text-center mb-4 focus:outline-none focus:border-gold-light"
        />
        {error && <p className="text-fuschia-light text-sm mb-4">Code incorrect.</p>}
        <button type="submit" className="w-full bg-gold text-soiree-plum py-3 uppercase tracking-[0.2em] text-sm hover:bg-gold-light transition-colors">
          Entrer
        </button>
      </form>
    </div>
  );
}
