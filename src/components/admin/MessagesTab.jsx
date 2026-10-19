export default function MessagesTab({ guests, responses = [] }) {
  const guestMessages = guests
    .filter((g) => g.rsvp_message && g.rsvp_message.trim().length > 0)
    .map((g) => ({ ...g, display_message: g.rsvp_message, table_label: g.table_number ? `Table ${g.table_number}` : 'Sans table', message_date: g.updated_at }));
  const genericMessages = responses
    .filter((r) => r.response_type === 'general' && r.message && r.message.trim().length > 0)
    .map((r) => ({ ...r, display_message: r.message, table_label: 'RSVP général', message_date: r.created_at }));
  const withMessage = [...guestMessages, ...genericMessages]
    .sort((a, b) => new Date(b.message_date || 0) - new Date(a.message_date || 0));

  return (
    <div>
      <p className="text-sm opacity-60 mb-6">
        {withMessage.length} message{withMessage.length > 1 ? 's' : ''} laissé{withMessage.length > 1 ? 's' : ''} par vos invités via le formulaire RSVP.
      </p>

      {withMessage.length === 0 ? (
        <p className="opacity-50 py-8 text-center">Aucun message pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {withMessage.map((g) => (
            <div key={g.id} className="border border-fuschia/15 bg-white/60 p-5 rounded-sm">
              <p className="font-display italic text-lg text-dawn-plum mb-1">{g.full_name}</p>
              <p className="text-xs uppercase tracking-wide text-fuschia/70 mb-3">
                {g.table_label}
              </p>
              <p className="text-sm leading-relaxed text-dawn-plum/85 italic">&laquo; {g.display_message} &raquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
