import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { generateConfirmationCode, makeUniqueSlug } from '../../lib/utils';

export default function GuestForm({ existingSlugs, onAdded }) {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [tableNumber, setTableNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    const slug = makeUniqueSlug(name, existingSlugs);
    const confirmation_code = generateConfirmationCode();

    const { data, error: err } = await supabase
      .from('guests')
      .insert({
        full_name: name.trim(),
        slug,
        confirmation_code,
        party_size: partySize,
        table_number: tableNumber || null,
        phone: phone || null,
      })
      .select()
      .single();

    setSaving(false);
    if (err) {
      setError("Erreur lors de l'ajout — vérifiez la connexion Supabase.");
      return;
    }
    setName('');
    setPartySize(1);
    setTableNumber('');
    setPhone('');
    onAdded(data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end bg-white/60 border border-fuschia/10 p-5 rounded-sm mb-8">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Nom de l&rsquo;invité</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-dawn-plum/20 px-3 py-2 bg-white focus:outline-none focus:border-fuschia" placeholder="Ex. Jean Mba" required />
      </div>
      <div className="w-28">
        <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Places</label>
        <input type="number" min={1} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="w-full border border-dawn-plum/20 px-3 py-2 bg-white focus:outline-none focus:border-fuschia" />
      </div>
      <div className="w-32">
        <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Table</label>
        <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full border border-dawn-plum/20 px-3 py-2 bg-white focus:outline-none focus:border-fuschia" placeholder="Ex. T12" />
      </div>
      <div className="w-44">
        <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Téléphone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-dawn-plum/20 px-3 py-2 bg-white focus:outline-none focus:border-fuschia" placeholder="24177000000" />
      </div>
      <button type="submit" disabled={saving} className="bg-fuschia text-ivory px-6 py-2 text-sm uppercase tracking-wide hover:bg-fuschia-light transition-colors disabled:opacity-50">
        {saving ? 'Ajout…' : 'Ajouter'}
      </button>
      {error && <p className="w-full text-fuschia text-sm">{error}</p>}
    </form>
  );
}
