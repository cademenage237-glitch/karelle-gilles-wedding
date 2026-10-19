import { useCountdown } from '../hooks/useCountdown';
import Medallion from './Medallion';
import { wedding } from '../data/content';

export default function Hero() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(wedding.date);

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden bg-soiree-plum text-ivory">
      <img src="/photos/hero.jpg" alt="Carelle et Gilles" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(38,9,31,0.55) 0%, rgba(38,9,31,0.35) 35%, rgba(38,9,31,0.75) 75%, rgba(38,9,31,0.92) 100%)' }} />
      <p className="relative uppercase tracking-[0.35em] text-xs text-lila mb-6">Mariage traditionnel &amp; civil</p>
      <Medallion size={140} className="relative mb-6" />
      <h1 className="relative font-display italic text-5xl md:text-7xl leading-tight mb-4">
        Carelle <span className="text-gold-light not-italic">&amp;</span> Gilles
      </h1>
      <p className="relative text-ivory/70 tracking-wide mb-10">Famille Kassa Maganga &middot; {wedding.city}</p>
      <p className="relative font-display text-lg md:text-xl text-rose mb-10">30 décembre 2026</p>

      {!isPast ? (
        <div className="relative flex gap-6 md:gap-10 mb-4" role="timer" aria-live="polite">
          {[
            { value: days, label: 'jours' },
            { value: hours, label: 'heures' },
            { value: minutes, label: 'min' },
            { value: seconds, label: 'sec' },
          ].map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <span className="font-display text-4xl md:text-5xl text-gold-light tabular-nums">{String(u.value).padStart(2, '0')}</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-ivory/60 mt-1">{u.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="relative font-display italic text-2xl text-gold-light">Nous avons dit oui !</p>
      )}

      <a href="#rsvp" className="relative mt-10 inline-block border border-gold-light text-gold-light px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-gold-light hover:text-soiree-plum transition-colors">
        Confirmer ma présence
      </a>
    </section>
  );
}
