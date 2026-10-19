import { useState } from 'react';
import { inviteUrl, whatsappSendUrl } from '../../lib/utils';

const STATUS_STYLES = {
  pending: 'bg-gray-200 text-gray-700',
  confirmed: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  declined: 'Décliné',
};

function EditRow({ guest, onSave, onCancel, saving }) {
  const [name, setName] = useState(guest.full_name);
  const [phone, setPhone] = useState(guest.phone || '');
  const [table, setTable] = useState(guest.table_number || '');
  const [partySize, setPartySize] = useState(guest.party_size);

  const willRegenerate = name.trim() !== guest.full_name || (phone || '') !== (guest.phone || '');

  return (
    <tr className="border-t border-fuschia/10 bg-dawn-blush/30">
      <td className="px-4 py-3" colSpan={2}>
        <label className="block text-[10px] uppercase tracking-wide opacity-50 mb-1">Nom</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-fuschia/30 px-2 py-1 bg-white text-sm" />
      </td>
      <td className="px-4 py-3">
        <label className="block text-[10px] uppercase tracking-wide opacity-50 mb-1">Places</label>
        <input type="number" min={1} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="w-16 border border-fuschia/30 px-2 py-1 bg-white text-sm" />
      </td>
      <td className="px-4 py-3">
        <label className="block text-[10px] uppercase tracking-wide opacity-50 mb-1">Table</label>
        <input value={table} onChange={(e) => setTable(e.target.value)} className="w-24 border border-fuschia/30 px-2 py-1 bg-white text-sm" placeholder="Table" />
      </td>
      <td className="px-4 py-3" colSpan={2}>
        <label className="block text-[10px] uppercase tracking-wide opacity-50 mb-1">Téléphone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-fuschia/30 px-2 py-1 bg-white text-sm" placeholder="Téléphone" />
      </td>
      <td className="px-4 py-3" colSpan={2}>
        {willRegenerate && (
          <p className="text-[11px] text-fuschia mb-2">⚠ Nom/tél modifié : un nouveau lien sera généré, l&rsquo;ancien sera révoqué.</p>
        )}
        <div className="flex gap-2">
          <button
            disabled={saving}
            onClick={() => onSave({ full_name: name.trim(), phone: phone || null, table_number: table || null, party_size: partySize })}
            className="bg-fuschia text-ivory px-3 py-1 text-xs uppercase tracking-wide hover:bg-fuschia-light transition-colors disabled:opacity-50"
          >
            {saving ? '...' : 'Confirmer'}
          </button>
          <button onClick={onCancel} className="border border-dawn-plum/20 px-3 py-1 text-xs uppercase tracking-wide hover:border-dawn-plum/50 transition-colors">
            Annuler
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function GuestTable({ guests, onCopyLink, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function handleSave(guest, changes) {
    setSavingId(guest.id);
    await onUpdate(guest, changes);
    setSavingId(null);
    setEditingId(null);
  }

  async function handleDelete(guest) {
    if (!window.confirm(`Supprimer définitivement ${guest.full_name} de la liste ?`)) return;
    setDeletingId(guest.id);
    await onDelete(guest);
    setDeletingId(null);
  }

  return (
    <div className="overflow-x-auto border border-fuschia/10 rounded-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-dawn-blush/60 text-dawn-plum">
          <tr>
            <th className="px-4 py-3" colSpan={2}>Invité</th>
            <th className="px-4 py-3">Places</th>
            <th className="px-4 py-3">Statut RSVP</th>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Lien</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) =>
            editingId === g.id ? (
              <EditRow key={g.id} guest={g} saving={savingId === g.id} onSave={(changes) => handleSave(g, changes)} onCancel={() => setEditingId(null)} />
            ) : (
              <tr key={g.id} className="border-t border-fuschia/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingId(g.id)} title="Modifier" className="text-dawn-plum/40 hover:text-fuschia transition-colors">✎</button>
                    <button
                      onClick={() => handleDelete(g)}
                      disabled={deletingId === g.id}
                      title="Supprimer"
                      className="text-dawn-plum/40 hover:text-red-600 transition-colors disabled:opacity-40"
                    >
                      {deletingId === g.id ? '…' : '🗑'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{g.full_name}</td>
                <td className="px-4 py-3">{g.rsvp_status === 'confirmed' ? g.rsvp_party_size : g.party_size}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${STATUS_STYLES[g.rsvp_status]}`}>{STATUS_LABEL[g.rsvp_status]}</span>
                </td>
                <td className="px-4 py-3 font-mono">{g.confirmation_code}</td>
                <td className="px-4 py-3">{g.checked_in ? <span className="text-green-700">✓ Arrivé</span> : <span className="opacity-40">—</span>}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onCopyLink(inviteUrl(g.slug))} className="text-fuschia hover:underline">Copier</button>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={whatsappSendUrl(g)}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${g.phone ? 'bg-[#25D366] text-white hover:bg-[#1ebe5b]' : 'bg-gray-200 text-gray-500'}`}
                    title={g.phone ? `Envoyer à ${g.phone}` : 'Aucun numéro enregistré'}
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            )
          )}
          {guests.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center opacity-50">Aucun invité trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
