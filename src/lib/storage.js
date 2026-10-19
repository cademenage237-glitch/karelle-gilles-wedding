import { supabase, supabaseConfigured } from './supabase';

const BUCKET = 'guest-photos';

export async function listGuestPhotos() {
  if (!supabaseConfigured) return [];
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
    }));
}

export async function uploadGuestPhotos(files) {
  if (!supabaseConfigured) return { uploaded: [], errors: ['Supabase non configuré'] };
  const uploaded = [];
  const errors = [];

  for (const file of files) {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      errors.push(`${file.name}: ${error.message}`);
    } else {
      uploaded.push({
        name: path,
        url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
      });
    }
  }

  return { uploaded, errors };
}
