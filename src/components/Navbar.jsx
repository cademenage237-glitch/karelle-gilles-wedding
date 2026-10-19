import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#histoire', label: 'Notre histoire' },
  { href: '#programme', label: 'Programme' },
  { href: '#lieux', label: 'Lieux' },
  { href: '#dresscode', label: 'Dress code' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#infos', label: 'Infos' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-soiree-plum/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" className="font-display italic text-xl text-gold-light tracking-wide">C &amp; G</a>
        <button className="md:hidden text-ivory" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Ouvrir le menu">
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current" />
        </button>
        <ul className="hidden md:flex gap-8 text-sm tracking-wide uppercase text-ivory/90">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href} className="hover:text-gold-light transition-colors">{l.label}</a></li>
          ))}
        </ul>
      </nav>
      {open && (
        <ul className="md:hidden bg-soiree-plum text-ivory px-6 pb-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="block py-1">{l.label}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}
