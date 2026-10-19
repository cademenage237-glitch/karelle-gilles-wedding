import { useEffect, useRef, useState } from 'react';
import PolaroidCard from './album/PolaroidCard';
import Lightbox from './album/Lightbox';
import { listGuestPhotos, uploadGuestPhotos } from '../lib/storage';
import { supabaseConfigured } from '../lib/supabase';

function rotationFor(i) {
  const seed = Math.sin(i * 12.9898) * 43758.5453;
  const frac = seed - Math.floor(seed);
  return Math.round((frac * 12 - 6) * 10) / 10;
}

// Seules les photos où Carelle & Gilles apparaissent ensemble sont gardées
// (les portraits en solo ont été retirés de l'album).
const COUPLE_PHOTO_INDEXES = [1, 3, 4, 9, 10, 11, 12, 13];
const ourPhotos = COUPLE_PHOTO_INDEXES.map((i) => ({
  id: `our-${i}`,
  url: `/photos/album/${String(i).padStart(2, '0')}.jpg`,
}));

export default function Album() {
  const [guestPhotos, setGuestPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    listGuestPhotos().then(setGuestPhotos);
  }, []);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const { uploaded, errors } = await uploadGuestPhotos(files);
    setGuestPhotos((prev) => [...uploaded, ...prev]);
    if (errors.length) setUploadError(errors[0]);
    setUploading(false);
    e.target.value = '';
  }

  const guestTiles = guestPhotos.length === 0
    ? Array.from({ length: 6 }, () => ({ addTile: true }))
    : [{ addTile: true }, ...guestPhotos];

  return (
    <section id="galerie" className="bg-[#faf6f1] py-28 px-6">
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-fuschia mb-4">En images</p>
        <h2 className="font-album-display italic text-4xl md:text-5xl text-dawn-plum">Nos Souvenirs</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 mb-24">
        {ourPhotos.map((photo, i) => (
          <PolaroidCard
            key={photo.id}
            photo={photo}
            index={i}
            rotation={rotationFor(i)}
            onClick={() => {
              const realIndex = ourPhotos.filter((p) => p.url).findIndex((p) => p.id === photo.id);
              setLightbox({ list: 'ours', index: realIndex });
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h2 className="font-album-display italic text-4xl md:text-5xl text-dawn-plum">Vous étiez là</h2>
        <p className="uppercase tracking-[0.25em] text-xs text-fuschia mt-3">Live du Jour J</p>
        {!supabaseConfigured && (
          <p className="text-sm text-dawn-plum/50 mt-4 italic">(L&rsquo;envoi de photos par les invités sera activé une fois Supabase connecté)</p>
        )}
        {uploadError && <p className="text-sm text-fuschia mt-3">{uploadError}</p>}
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {guestTiles.map((item, i) =>
          item.addTile ? (
            <PolaroidCard key={`add-${i}`} addMode rotation={rotationFor(100 + i)} onClick={() => fileInputRef.current?.click()} />
          ) : (
            <PolaroidCard
              key={item.name}
              photo={item}
              index={i}
              isNew
              rotation={rotationFor(100 + i)}
              onClick={() => setLightbox({ list: 'guests', index: guestPhotos.findIndex((p) => p.name === item.name) })}
            />
          )
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" disabled={!supabaseConfigured || uploading} onChange={handleFiles} />

      {lightbox && (
        <Lightbox
          photos={lightbox.list === 'ours' ? ourPhotos.filter((p) => p.url) : guestPhotos}
          index={lightbox.index}
          onNavigate={(i) => setLightbox({ ...lightbox, index: i })}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
