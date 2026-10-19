const SWATCHES = [
  { name: 'Fuschia', hex: '#c6146b' },
  { name: 'Rose', hex: '#eda9c4' },
  { name: 'Lila', hex: '#c9a6e0' },
];

export default function DressCode() {
  return (
    <section id="dresscode" className="bg-cocktail-lila text-cocktail-plum py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-fuschia mb-4">Tenue de soirée</p>
        <h2 className="font-display italic text-4xl md:text-5xl mb-6">Chic &amp; Glamour</h2>
        <p className="leading-relaxed opacity-80 mb-10">
          Nous invitons chaleureusement nos invités à sublimer cette journée dans des tenues
          élégantes, aux teintes évoquant la palette du mariage : fuschia, rose et lila. Matières
          nobles, éclat mesuré, prestance de rigueur.
        </p>
        <div className="flex justify-center gap-8">
          {SWATCHES.map((s) => (
            <div key={s.hex} className="flex flex-col items-center gap-2">
              <span className="w-14 h-14 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: s.hex }} aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.2em] opacity-70">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
