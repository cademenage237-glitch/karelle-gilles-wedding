import { wedding } from '../data/content';

export default function Footer() {
  return (
    <footer className="bg-[#1a0715] text-ivory/60 py-10 px-6 text-center text-sm">
      <p className="mb-2 font-display italic text-ivory/80">Carelle &amp; Gilles</p>
      <p className="mb-6">30 décembre 2026 &middot; Libreville, Gabon</p>
      <div className="w-10 h-px bg-ivory/20 mx-auto mb-6" />
      <p className="text-xs tracking-wide">
        Site conçu avec soin par{' '}
        <a href={wedding.creator.whatsappLink} target="_blank" rel="noreferrer" className="text-gold-light hover:text-fuschia-light transition-colors">{wedding.creator.name}</a>{' '}
        &middot;{' '}
        <a href={wedding.creator.whatsappLink} target="_blank" rel="noreferrer" className="text-gold-light hover:text-fuschia-light transition-colors">WhatsApp {wedding.creator.whatsapp}</a>
      </p>
    </footer>
  );
}
