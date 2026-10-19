const MILESTONES = [
  { date: '14 juillet 2023', label: 'Ils se choisissent' },
  { date: '30 décembre 2023', label: 'Ils se promettent' },
  { date: '30 décembre 2026', label: 'Ils s\u2019unissent' },
];

export default function Story() {
  return (
    <section id="histoire" className="bg-dawn-blush text-dawn-plum py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.35em] text-xs text-fuschia mb-4">Notre histoire</p>
          <h2 className="font-display italic text-4xl md:text-5xl mb-3">
            Une histoire commencée sur les bancs de l&rsquo;université&hellip;
          </h2>
        </div>

        <div className="space-y-6 leading-relaxed text-dawn-plum/85 text-[17px]">
          <p>
            Certaines histoires d&rsquo;amour commencent par un coup de foudre. D&rsquo;autres
            commencent simplement par une rencontre, une amitié, quelques regards&hellip; et
            prennent doucement le temps de devenir une évidence.
          </p>
          <p>
            L&rsquo;histoire de Carelle et Gilles a commencé sur les bancs de l&rsquo;université.
            À cette époque, ils étaient simplement deux condisciples qui se connaissaient, se
            côtoyaient et partageaient un bout de leur quotidien, sans imaginer que la vie
            préparait déjà leur rencontre autrement.
          </p>
          <p>
            Puis est arrivé le <strong className="text-fuschia font-semibold">14 juillet 2023</strong>.
            Ce jour-là, ils ont choisi de se découvrir autrement, de donner une nouvelle chance à
            leur lien et de construire une histoire à deux. Ils sont devenus un couple, apprenant
            peu à peu à partager leurs rêves, leurs joies, leurs projets et les défis de la vie.
          </p>
          <p>
            Quelques mois plus tard, leur amour franchissait une nouvelle étape.{' '}
            <strong className="text-fuschia font-semibold">30 décembre 2023</strong> : ils se
            fiancent. Ce jour-là, ils ne se promettaient pas seulement de s&rsquo;aimer
            aujourd&rsquo;hui, mais de continuer à se choisir pour les années à venir.
          </p>
          <p>
            Et aujourd&rsquo;hui, <strong className="text-fuschia font-semibold">30 décembre 2026</strong>,
            trois ans jour pour jour après leurs fiançailles, une nouvelle page s&rsquo;écrit.
            Cette fois, ce n&rsquo;est plus une promesse. C&rsquo;est le mariage.
          </p>
          <p>
            Deux personnes qui se sont connues comme condisciples deviennent une famille. Deux
            chemins qui s&rsquo;étaient croisés choisissent désormais d&rsquo;avancer dans la même
            direction.
          </p>
          <p className="italic text-dawn-plum/70">
            L&rsquo;histoire de Carelle et Gilles nous rappelle que l&rsquo;amour n&rsquo;a pas
            toujours besoin de commencer dans le bruit. Parfois, il grandit doucement, jusqu&rsquo;à
            devenir une évidence.
          </p>
        </div>

        {/* Mini frise des dates clés */}
        <div className="mt-16 relative">
          <div className="absolute left-0 right-0 top-[10px] h-px bg-fuschia/25 hidden sm:block" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 relative">
            {MILESTONES.map((m) => (
              <div key={m.date} className="text-center">
                <span className="hidden sm:block w-[9px] h-[9px] rounded-full bg-fuschia mx-auto mb-4" />
                <p className="font-display italic text-lg text-fuschia mb-1">{m.date}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-dawn-plum/60">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-16 font-display italic text-xl text-fuschia">
          Que leur amour continue d&rsquo;écrire leur histoire, pour toujours. ❤️
        </p>
      </div>
    </section>
  );
}
