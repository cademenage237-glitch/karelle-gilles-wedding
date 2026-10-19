import { wedding } from '../data/content';

export default function PracticalInfo() {
  return (
    <section id="infos" className="bg-soiree-plum text-ivory py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-gold-light mb-4">Infos pratiques</p>
        <h2 className="font-display italic text-4xl md:text-5xl mb-12">Pour bien préparer votre venue</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="border border-ivory/15 p-6">
            <h3 className="font-display italic text-xl mb-2 text-gold-light">Ville</h3>
            <p className="opacity-80">{wedding.city}</p>
          </div>
          <div className="border border-ivory/15 p-6">
            <h3 className="font-display italic text-xl mb-2 text-gold-light">Date</h3>
            <p className="opacity-80">Mercredi 30 décembre 2026</p>
          </div>
          <div className="border border-ivory/15 p-6">
            <h3 className="font-display italic text-xl mb-2 text-gold-light">Transport</h3>
            <p className="opacity-80">
              Le Pavillon Royal et la Mairie d&rsquo;Akanda sont accessibles en véhicule privé ou
              taxi. Prévoir le trajet entre les deux lieux avant 15h30.
            </p>
          </div>
          <div className="border border-ivory/15 p-6">
            <h3 className="font-display italic text-xl mb-2 text-gold-light">Contact</h3>
            <p className="opacity-80">{wedding.contacts.phones.join(' / ')}<br />{wedding.contacts.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
