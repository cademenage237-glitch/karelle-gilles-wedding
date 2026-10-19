import { wedding } from '../data/content';
import Medallion from './Medallion';
import TraditionalRsvp from './TraditionalRsvp';

const WASH_STYLES = {
  dawn: { bg: 'bg-dawn-blush', text: 'text-dawn-plum', eyebrow: 'text-fuschia', stroke: '#c6146b' },
  cocktail: { bg: 'bg-cocktail-lila', text: 'text-cocktail-plum', eyebrow: 'text-fuschia', stroke: '#c6146b' },
  civil: { bg: 'bg-civil-rosegold', text: 'text-civil-plum', eyebrow: 'text-fuschia', stroke: '#c6146b' },
  soiree: { bg: 'bg-soiree-plum', text: 'text-ivory', eyebrow: 'text-gold-light', stroke: '#cda45e' },
};

export default function Programme() {
  return (
    <section id="programme">
      <div className="text-center pt-24 pb-8 px-6 bg-dawn-blush text-dawn-plum">
        <p className="uppercase tracking-[0.35em] text-xs text-fuschia mb-4">Le jour J, chapitre par chapitre</p>
        <h2 className="font-display italic text-4xl md:text-5xl">Programme</h2>
      </div>
      {wedding.chapters.map((chapter, i) => {
        const s = WASH_STYLES[chapter.wash];
        return (
          <div key={chapter.id} className={`${s.bg} ${s.text} py-20 px-6 border-t border-black/5`}>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <Medallion size={90} stroke={s.stroke} className="shrink-0 opacity-90" />
              <div className="text-center md:text-left">
                <p className={`uppercase tracking-[0.3em] text-xs mb-2 ${s.eyebrow}`}>Chapitre {i + 1} &middot; {chapter.time}</p>
                <h3 className="font-display italic text-3xl md:text-4xl mb-3">{chapter.title}</h3>
                <p className="opacity-85 mb-2">{chapter.description}</p>
                <p className="text-sm tracking-wide opacity-70">📍 {chapter.place}</p>
              </div>
            </div>
            {chapter.id === 'traditionnel' && <TraditionalRsvp />}
          </div>
        );
      })}
    </section>
  );
}
