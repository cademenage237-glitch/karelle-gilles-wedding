export default function TraditionalTab({ guests }) {
  const responded = guests.filter((g) => g.traditional_attending !== null && g.traditional_attending !== undefined);
  const attending = responded.filter((g) => g.traditional_attending === true);
  const notAttending = responded.filter((g) => g.traditional_attending === false);
  const totalPeople = attending.reduce((sum, g) => sum + (g.traditional_party_size || 0), 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-fuschia/10 p-4 text-center bg-white/60">
          <p className="font-display text-3xl">{totalPeople}</p>
          <p className="text-xs uppercase tracking-wide opacity-60 mt-1">Présents attendus</p>
        </div>
        <div className="border border-fuschia/10 p-4 text-center bg-white/60">
          <p className="font-display text-3xl">{attending.length}</p>
          <p className="text-xs uppercase tracking-wide opacity-60 mt-1">Invitations "Oui"</p>
        </div>
        <div className="border border-fuschia/10 p-4 text-center bg-white/60">
          <p className="font-display text-3xl">{notAttending.length}</p>
          <p className="text-xs uppercase tracking-wide opacity-60 mt-1">Invitations "Non"</p>
        </div>
      </div>

      <h3 className="font-display italic text-xl text-fuschia mb-4">Présents au mariage traditionnel (Oui)</h3>
      <div className="overflow-x-auto border border-fuschia/10 rounded-sm mb-10">
        <table className="w-full text-sm text-left">
          <thead className="bg-dawn-blush/60 text-dawn-plum">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Nombre de personnes</th>
            </tr>
          </thead>
          <tbody>
            {attending.map((g) => (
              <tr key={g.id} className="border-t border-fuschia/10">
                <td className="px-4 py-3 font-medium">{g.full_name}</td>
                <td className="px-4 py-3">{g.traditional_party_size}</td>
              </tr>
            ))}
            {attending.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center opacity-50">Aucune réponse "Oui" pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {notAttending.length > 0 && (
        <>
          <h3 className="font-display italic text-xl text-dawn-plum/60 mb-4">Ont répondu "Non"</h3>
          <div className="overflow-x-auto border border-fuschia/10 rounded-sm">
            <table className="w-full text-sm text-left">
              <tbody>
                {notAttending.map((g) => (
                  <tr key={g.id} className="border-t border-fuschia/10">
                    <td className="px-4 py-3 opacity-70">{g.full_name}</td>
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
