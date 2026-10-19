const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #eda9c4, #c9a6e0)',
  'linear-gradient(135deg, #c9a6e0, #f0c4d6)',
  'linear-gradient(135deg, #c6146b33, #cda45e55)',
  'linear-gradient(135deg, #f0c4d6, #eda9c4)',
];

export default function PolaroidCard({ photo, rotation = 0, isNew = false, onClick, addMode = false, index = 0 }) {
  if (addMode) {
    return (
      <button type="button" onClick={onClick} style={{ '--r': `${rotation}deg` }} className="group relative bg-white p-3 pb-8 shadow-md hover:shadow-xl transition-transform duration-300 rotate-[var(--r)] hover:rotate-0 hover:scale-105 focus-visible:rotate-0">
        <span className="flex items-center justify-center aspect-square bg-[#faf6f1] border border-dashed border-[#c9a6e0]">
          <span className="text-3xl text-[#c9a6e0] group-hover:text-fuschia transition-colors">+</span>
        </span>
        <span className="block text-center mt-2 text-[11px] uppercase tracking-wide text-civil-plum/60" style={{ fontFamily: "'Manrope', sans-serif" }}>
          Ajoute ta photo
        </span>
      </button>
    );
  }

  const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

  return (
    <button type="button" onClick={onClick} style={{ '--r': `${rotation}deg` }} className="group relative bg-white p-3 pb-8 shadow-md hover:shadow-xl transition-transform duration-300 rotate-[var(--r)] hover:rotate-0 hover:scale-105 focus-visible:rotate-0 text-left">
      {isNew && (
        <span className="absolute -top-2 -right-2 z-10 bg-fuschia text-white text-[10px] uppercase tracking-wide px-2 py-1 rounded-full shadow">New</span>
      )}
      <span className="block aspect-square overflow-hidden bg-[#faf6f1]">
        {photo?.url ? (
          <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="w-full h-full block" style={{ background: gradient }} aria-hidden="true" />
        )}
      </span>
    </button>
  );
}
