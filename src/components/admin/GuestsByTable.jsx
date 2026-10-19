import GuestTable from './GuestTable';

export default function GuestsByTable({ guests, onCopyLink, onUpdate, onDelete }) {
  const groups = new Map();
  for (const g of guests) {
    const key = g.table_number || 'Sans table';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(g);
  }

  const entries = Array.from(groups.entries()).sort((a, b) => {
    if (a[0] === 'Sans table') return 1;
    if (b[0] === 'Sans table') return -1;
    return a[0].localeCompare(b[0]);
  });

  if (entries.length === 0) {
    return <p className="opacity-50 py-8 text-center">Aucun invité trouvé.</p>;
  }

  return (
    <div className="space-y-10">
      {entries.map(([table, tableGuests]) => {
        const places = tableGuests.reduce((sum, g) => sum + (g.party_size ?? 0), 0);
        return (
          <div key={table}>
            <div className="flex items-baseline justify-between border-b-2 border-fuschia/30 pb-2 mb-4">
              <h3 className="font-display italic text-xl text-fuschia">{table}</h3>
              <p className="text-xs uppercase tracking-wide opacity-60">
                {tableGuests.length} invitation{tableGuests.length > 1 ? 's' : ''} &middot;{' '}
                <span className="font-semibold text-dawn-plum">{places} place{places > 1 ? 's' : ''} occupée{places > 1 ? 's' : ''}</span>
              </p>
            </div>
            <GuestTable guests={tableGuests} onCopyLink={onCopyLink} onUpdate={onUpdate} onDelete={onDelete} />
          </div>
        );
      })}
    </div>
  );
}
