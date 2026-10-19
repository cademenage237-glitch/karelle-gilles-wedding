export default function TraditionalTab({ responses = [] }) {
  const traditional = responses.filter((r) => r.response_type === 'traditional');
  const attending = traditional.filter((r) => r.attending === true);
  const notAttending = traditional.filter((r) => r.attending === false);
  const totalPeople = attending.reduce((sum, r) => sum + (r.party_size || 0), 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-fuschia/10 p-4 text-center bg-white/60">
          <p className="font-display text-3xl">{totalPeople}</p>
          <p className="text-xs uppercase tracking-wide opacity-60 mt-1">Présents attendus</p>
        </div>
        <div className="border border-fuschia/10 p-4 text-center bg-white/60">
          <p className="font-display text-3xl">{attending.length}</p>
          <p className="text-xs uppercase tracking-wide opacity-60 mt-1">Réponses « Oui »</p>
        </div>
        <div className="border border-fuschia/10 p-4 text-center bg-white/60">
          <p className="font-display text-3xl">{notAttending.length}</p>
          <p className="text-xs uppercase tracking-wide opacity-60 mt-1">Réponses « Non »</p>
        </div>
      </div>

      <h3 className="font-display italic text-xl text-fuschia mb-4">Présents au mariage traditionnel (Oui)</h3>
      <div className="overflow-x-auto border border-fuschia/10 rounded-sm mb-10">
        <table className="w-full text-sm text-left">
          <thead className="bg-dawn-blush/60 text-dawn-plum">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Nombre de personnes</th>
              <th className="px-4 py-3">Date de réponse</th>
            </tr>
          </thead>
          <tbody>
            {attending.map((r) => (
              <tr key={r.id} className="border-t border-fuschia/10">
                <td className="px-4 py-3 font-medium">{r.full_name}</td>
                <td className="px-4 py-3">{r.party_size}</td>
                <td className="px-4 py-3">{r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '—'}</td>
              </tr>
            ))}
            {attending.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center opacity-50">Aucune réponse « Oui » pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {notAttending.length > 0 && (
        <>
          <h3 className="font-display italic text-xl text-dawn-plum/60 mb-4">Ont répondu « Non »</h3>
          <div className="overflow-x-auto border border-fuschia/10 rounded-sm">
            <table className="w-full text-sm text-left">
              <tbody>
                {notAttending.map((r) => (
                  <tr key={r.id} className="border-t border-fuschia/10">
                    <td className="px-4 py-3 opacity-70">{r.full_name}</td>
                    <td className="px-4 py-3 opacity-50">{r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
