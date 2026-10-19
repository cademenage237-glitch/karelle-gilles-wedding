import { useEffect, useRef } from 'react';

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const touchStartX = useRef(null);
  const photo = photos[index];

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [index, photos.length, onClose, onNavigate]);

  if (!photo) return null;

  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) onNavigate((index + 1) % photos.length);
      else onNavigate((index - 1 + photos.length) % photos.length);
    }
    touchStartX.current = null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none" aria-label="Fermer">&times;</button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + photos.length) % photos.length); }} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-3xl transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }} aria-label="Photo précédente">&#8249;</button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % photos.length); }} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-3xl transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }} aria-label="Photo suivante">&#8250;</button>
      <img key={photo.url} src={photo.url} alt="" onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh] object-contain animate-[fadeIn_0.25s_ease]" />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
