import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { toCsv, downloadCsv, inviteUrl, makeUniqueSlug, generateConfirmationCode } from '../lib/utils';
import GuestForm from '../components/admin/GuestForm';
import GuestsByTable from '../components/admin/GuestsByTable';
import TraditionalTab from '../components/admin/TraditionalTab';
import MessagesTab from '../components/admin/MessagesTab';

export default function Admin() {
  const [guests, setGuests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('invites'); // 'invites' | 'traditionnel'

  const checkinUrl = `${window.location.origin}/checkin`;

  async function loadGuests() {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    const [{ data: guestData }, { data: responseData }] = await Promise.all([
      supabase.from('guests').select('*').order('created_at', { ascending: true }),
      supabase.from('rsvp_responses').select('*').order('created_at', { ascending: true }),
    ]);
    setGuests(guestData || []);
    setResponses(responseData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadGuests();
  }, []);

  const existingSlugs = useMemo(() => new Set(guests.map((g) => g.slug)), [guests]);

  const filteredGuests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) =>
      [g.full_name, g.table_number, g.phone, g.confirmation_code]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [guests, search]);

  // Le "nombre de places" (party_size) tient compte des couples : une ligne
  // "M. et Mme X" représente 2 invités, pas 1.
  const stats = useMemo(() => {
    const seatsOf = (g) => g.rsvp_party_size ?? g.party_size ?? 0;

    const totalInvitations = guests.length;
    const totalGuestsCount = guests.reduce((sum, g) => sum + (g.party_size ?? 0), 0);

    const confirmed = guests.filter((g) => g.rsvp_status === 'confirmed');
    const declined = guests.filter((g) => g.rsvp_status === 'declined');
    const pending = guests.filter((g) => g.rsvp_status === 'pending');

    const confirmedGuests = confirmed.reduce((sum, g) => sum + seatsOf(g), 0);
    const declinedGuests = declined.reduce((sum, g) => sum + (g.party_size ?? 0), 0);
    const pendingGuests = pending.reduce((sum, g) => sum + (g.party_size ?? 0), 0);

    const checkedInGuests = guests
      .filter((g) => g.checked_in)
      .reduce((sum, g) => sum + seatsOf(g), 0);

    return { totalInvitations, totalGuestsCount, confirmedGuests, declinedGuests, pendingGuests, checkedInGuests };
  }, [guests]);

  function handleAdded(guest) {
    setGuests((prev) => [...prev, guest]);
  }

  function handleCopyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      setToast('Lien copié !');
      setTimeout(() => setToast(null), 2000);
    });
  }

  // Si le nom et/ou le téléphone changent, on révoque l'ancien lien en générant
  // un nouveau slug + un nouveau code — l'ancien lien cesse immédiatement de fonctionner
  // puisqu'il ne correspond plus à aucune ligne en base.
  async function handleUpdateGuest(guest, changes) {
    const nameChanged = changes.full_name !== guest.full_name;
    const phoneChanged = (changes.phone || '') !== (guest.phone || '');
    const shouldRegenerate = nameChanged || phoneChanged;

    const payload = { ...changes };
    if (shouldRegenerate) {
      const otherSlugs = new Set([...existingSlugs].filter((s) => s !== guest.slug));
      payload.slug = makeUniqueSlug(changes.full_name, otherSlugs);
      payload.confirmation_code = generateConfirmationCode();
    }

    const { data, error } = await supabase.from('guests').update(payload).eq('id', guest.id).select().single();
    if (error) {
      setToast("Erreur lors de la mise à jour.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setGuests((prev) => prev.map((g) => (g.id === guest.id ? data : g)));
    setToast(shouldRegenerate ? 'Mis à jour — nouveau lien généré, ancien lien révoqué.' : 'Mis à jour.');
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDeleteGuest(guest) {
    const { error } = await supabase.from('guests').delete().eq('id', guest.id);
    if (error) {
      setToast('Erreur lors de la suppression.');
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    setToast('Invité supprimé.');
    setTimeout(() => setToast(null), 2000);
  }

  function handleExportCsv() {
    const csv = toCsv(
      guests.map((g) => ({ ...g, invite_url: inviteUrl(g.slug) })),
      [
        { key: 'full_name', label: 'Nom' },
        { key: 'party_size', label: 'Places invitées' },
        { key: 'rsvp_status', label: 'Statut RSVP' },
        { key: 'rsvp_party_size', label: 'Places confirmées' },
        { key: 'table_number', label: 'Table' },
        { key: 'phone', label: 'Téléphone' },
        { key: 'confirmation_code', label: 'Code' },
        { key: 'checked_in', label: 'Check-in' },
        { key: 'invite_url', label: "Lien d'invitation" },
      ]
    );
    downloadCsv('invites-carelle-gilles.csv', csv);
  }

  return (
    <div className="min-h-screen bg-ivory text-dawn-plum px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-fuschia mb-1">Espace organisateur</p>
            <h1 className="font-display italic text-3xl">Carelle &amp; Gilles — Invités</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCsv} className="border border-fuschia text-fuschia px-4 py-2 text-sm uppercase tracking-wide hover:bg-fuschia hover:text-ivory transition-colors">
              Exporter CSV
            </button>
            <a href="/checkin" target="_blank" rel="noreferrer" className="bg-soiree-plum text-ivory px-4 py-2 text-sm uppercase tracking-wide hover:bg-soiree-plum-2 transition-colors">
              Ouvrir le check-in
            </a>
          </div>
        </div>

        <div className="flex gap-6 border-b border-fuschia/15 mb-8">
          <button
            onClick={() => setTab('invites')}
            className={`pb-3 text-sm uppercase tracking-wide border-b-2 transition-colors ${tab === 'invites' ? 'border-fuschia text-fuschia' : 'border-transparent text-dawn-plum/50 hover:text-dawn-plum'}`}
          >
            Invités
          </button>
          <button
            onClick={() => setTab('traditionnel')}
            className={`pb-3 text-sm uppercase tracking-wide border-b-2 transition-colors ${tab === 'traditionnel' ? 'border-fuschia text-fuschia' : 'border-transparent text-dawn-plum/50 hover:text-dawn-plum'}`}
          >
            Traditionnel
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`pb-3 text-sm uppercase tracking-wide border-b-2 transition-colors ${tab === 'messages' ? 'border-fuschia text-fuschia' : 'border-transparent text-dawn-plum/50 hover:text-dawn-plum'}`}
          >
            Messages pour vous
          </button>
        </div>

        {!supabaseConfigured && (
          <div className="bg-fuschia/10 border border-fuschia/30 text-fuschia p-4 mb-8 text-sm">
            Connectez Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) pour activer la gestion des invités.
          </div>
        )}

        {tab === 'invites' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2">
              {[
                { label: 'Invités', value: stats.totalGuestsCount },
                { label: 'Confirmés', value: stats.confirmedGuests },
                { label: 'Déclinés', value: stats.declinedGuests },
                { label: 'En attente', value: stats.pendingGuests },
                { label: 'Arrivés (check-in)', value: stats.checkedInGuests },
              ].map((s) => (
                <div key={s.label} className="border border-fuschia/10 p-4 text-center bg-white/60">
                  <p className="font-display text-3xl">{s.value}</p>
                  <p className="text-xs uppercase tracking-wide opacity-60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-50 mb-8">
              {stats.totalInvitations} invitations envoyées (couples comptés pour 2 places) — total {stats.totalGuestsCount} invités attendus.
            </p>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-8 mb-10">
              <div>
                <GuestForm existingSlugs={existingSlugs} onAdded={handleAdded} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 Rechercher par nom, table, téléphone ou code…"
                  className="w-full border border-fuschia/20 bg-white px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-fuschia"
                />

                {loading ? (
                  <p className="opacity-60">Chargement des invités…</p>
                ) : (
                  <GuestsByTable guests={filteredGuests} onCopyLink={handleCopyLink} onUpdate={handleUpdateGuest} onDelete={handleDeleteGuest} />
                )}
              </div>

              <div className="border border-fuschia/10 p-6 bg-white/60 text-center h-fit">
                <p className="uppercase tracking-[0.25em] text-xs text-fuschia mb-4">QR code d&rsquo;accueil (jour J)</p>
                <div className="bg-white p-4 inline-block rounded-sm">
                  <QRCodeSVG value={checkinUrl} size={160} fgColor="#4a1338" />
                </div>
                <p className="text-xs opacity-60 mt-4">
                  Un unique QR code affiché à l&rsquo;entrée du Pavillon Royal. Il ouvre l&rsquo;outil
                  de check-in, protégé par un code réservé à l&rsquo;équipe.
                </p>
              </div>
            </div>
          </>
        ) : tab === 'traditionnel' ? (
          <TraditionalTab responses={responses} />
        ) : (
          <MessagesTab guests={guests} responses={responses} />
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 bg-dawn-plum text-ivory px-5 py-3 rounded-sm text-sm shadow-lg max-w-xs">{toast}</div>
        )}
      </div>
    </div>
  );
}
