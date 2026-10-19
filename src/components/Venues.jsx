import { wedding } from '../data/content';

export default function Venues() {
  return (
    <section id="lieux" className="bg-ivory text-dawn-plum py-28 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="uppercase tracking-[0.35em] text-xs text-fuschia mb-4">Où nous retrouver</p>
        <h2 className="font-display italic text-4xl md:text-5xl">Les lieux</h2>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {wedding.venues.map((venue) => (
          <div key={venue.id} className="border border-fuschia/20 rounded-sm p-8 text-center hover:border-fuschia/50 transition-colors">
            <h3 className="font-display italic text-2xl mb-2">{venue.name}</h3>
            <p className="text-fuschia text-sm uppercase tracking-wide mb-4">{venue.role}</p>
            <p className="text-dawn-plum/70 mb-6">{venue.address}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapQuery)}`} target="_blank" rel="noreferrer" className="inline-block text-sm uppercase tracking-[0.2em] border-b border-gold text-gold pb-0.5 hover:text-fuschia hover:border-fuschia transition-colors">
              Voir sur la carte
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
