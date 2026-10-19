export const wedding = {
  bride: 'Carelle',
  groom: 'Gilles',
  familyName: 'Kassa Maganga',
  date: '2026-12-30T08:30:00',
  city: 'Libreville, Gabon',
  contacts: {
    phones: ['+241 77 35 88 50', '+241 74 88 97 27'],
    email: 'carellekoumba88@gmail.com',
  },
  creator: {
    name: 'WillCrea',
    whatsapp: '683306005',
    whatsappLink: 'https://wa.me/683306005',
  },
  guestCountEvening: 250,
  theme: {
    label: 'Chic & Glamour',
    colors: ['Fuschia', 'Rose', 'Lila'],
  },
  chapters: [
    { id: 'traditionnel', time: '08h30', title: 'Mariage traditionnel', place: 'Pavillon Royal', description: "L'union est scellée selon la tradition, dans le respect des coutumes des deux familles.", wash: 'dawn' },
    { id: 'cocktail', time: '12h00', title: 'Cocktail déjeunatoire', place: 'Pavillon Royal', description: 'Un moment de partage convivial entre les deux cérémonies.', wash: 'cocktail' },
    { id: 'civil', time: '15h30', title: 'Mariage civil', place: "Mairie du 2ème arrondissement d'Akanda", description: "La cérémonie officielle devant l\u2019officier d\u2019état civil.", wash: 'civil' },
    { id: 'soiree', time: '19h00', title: 'Soirée de gala', place: 'Pavillon Royal', description: "La fête bat son plein : dîner, danse et festivités jusqu\u2019au bout de la nuit.", wash: 'soiree' },
  ],
  venues: [
    { id: 'pavillon-royal', name: 'Pavillon Royal', role: 'Cérémonie traditionnelle & Soirée', address: 'Libreville, Gabon', mapQuery: 'Pavillon Royal Libreville Gabon' },
    { id: 'mairie-akanda', name: "Mairie du 2ème arrondissement d'Akanda", role: 'Mariage civil', address: 'Akanda, Libreville, Gabon', mapQuery: "Mairie du 2eme arrondissement d'Akanda Libreville" },
  ],
};
