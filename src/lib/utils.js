export function slugify(name) {
  return name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function makeUniqueSlug(name, existingSlugs) {
  const base = slugify(name) || 'invite';
  let slug = base;
  let i = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export function generateConfirmationCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function toCsv(rows, columns) {
  const escape = (val) => {
    const str = val === null || val === undefined ? '' : String(val);
    if (/[",\n;]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const header = columns.map((c) => escape(c.label)).join(',');
  const lines = rows.map((row) =>
    columns.map((c) => escape(row[c.key])).join(',')
  );
  return [header, ...lines].join('\n');
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function inviteUrl(slug) {
  const base = window.location.origin;
  return `${base}/?invite=${slug}`;
}

// Nettoie un numéro de téléphone pour le format attendu par wa.me (chiffres uniquement, sans +)
export function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  return String(phone).replace(/[^\d]/g, '');
}

export function whatsappInviteMessage(guest) {
  const url = inviteUrl(guest.slug);
  return `Bonjour ${guest.full_name} 👋

C'est avec une immense joie que nous vous invitons au mariage de *Carelle & Gilles* 💍
📅 30 décembre 2026 — Libreville

Merci de confirmer votre présence via votre invitation personnalisée :
${url}

Nous avons hâte de célébrer ce jour avec vous ! ✨`;
}

export function whatsappSendUrl(guest) {
  const phone = cleanPhoneForWhatsApp(guest.phone);
  const text = encodeURIComponent(whatsappInviteMessage(guest));
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}
