import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { slugify } from '../lib/utils';

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  return lines.length;
}

export default function InviteCard({ guest }) {
  const qrRef = useRef(null);

  function handleDownload() {
    const qrCanvas = qrRef.current?.querySelector('canvas') || qrRef.current;
    if (!qrCanvas) return;

    const W = 640;
    const H = 860;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Fond
    ctx.fillStyle = '#faf3ec';
    ctx.fillRect(0, 0, W, H);

    // Bordure décorative
    ctx.strokeStyle = '#cda45e';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = 'rgba(205,164,94,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, W - 64, H - 64);

    ctx.textAlign = 'center';

    // En-tête
    ctx.fillStyle = '#26091f';
    ctx.font = 'italic 38px Georgia, "Times New Roman", serif';
    ctx.fillText('Carelle & Gilles', W / 2, 100);

    ctx.fillStyle = '#c6146b';
    ctx.font = '600 13px Arial, sans-serif';
    ctx.fillText('30 DÉCEMBRE 2026 · LIBREVILLE', W / 2, 128);

    // Séparateur
    ctx.strokeStyle = 'rgba(198,20,107,0.3)';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 50, 150);
    ctx.lineTo(W / 2 + 50, 150);
    ctx.stroke();

    // Nom de l'invité
    ctx.fillStyle = '#4a1338';
    ctx.font = '600 24px Arial, sans-serif';
    wrapText(ctx, guest.full_name, W / 2, 195, W - 140, 30);

    // QR code
    const qrSize = 360;
    const qrX = (W - qrSize) / 2;
    const qrY = 235;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Médaillon C&G au centre du QR
    const cx = W / 2;
    const cy = qrY + qrSize / 2;
    const r = 46;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cda45e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#c6146b';
    ctx.font = 'italic 700 30px Georgia, serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('C&G', cx, cy + 2);
    ctx.textBaseline = 'alphabetic';

    // Code d'accès
    ctx.fillStyle = '#c6146b';
    ctx.font = '700 46px "Courier New", monospace';
    ctx.fillText(guest.confirmation_code, W / 2, qrY + qrSize + 70);

    ctx.fillStyle = 'rgba(74,19,56,0.6)';
    ctx.font = '600 11px Arial, sans-serif';
    ctx.fillText("VOTRE CODE D'ACCÈS LE JOUR J", W / 2, qrY + qrSize + 92);

    // Pied de page
    ctx.fillStyle = '#4a1338';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.fillText('Présentez ce code à l\u2019entrée', W / 2, H - 56);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invitation-${slugify(guest.full_name)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <div className="mt-6">
      <div className="bg-white border border-gold/40 rounded-sm p-6 text-center">
        <p className="font-display italic text-lg text-dawn-plum mb-4">{guest.full_name}</p>

        <div className="relative inline-block" ref={qrRef}>
          <QRCodeCanvas value={guest.confirmation_code} size={200} level="H" fgColor="#4a1338" bgColor="#ffffff" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-11 h-11 rounded-full bg-white border border-gold flex items-center justify-center">
              <span className="font-display italic font-bold text-fuschia text-sm">C&amp;G</span>
            </span>
          </div>
        </div>

        <p className="font-display text-3xl tracking-[0.3em] text-fuschia mt-4">{guest.confirmation_code}</p>
        <p className="text-[11px] uppercase tracking-[0.15em] text-dawn-plum/50 mt-1">Votre code d&rsquo;accès le jour J</p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="w-full mt-4 border border-fuschia text-fuschia py-2.5 text-sm uppercase tracking-[0.2em] hover:bg-fuschia hover:text-ivory transition-colors"
      >
        ⬇ Télécharger mon invitation
      </button>
    </div>
  );
}
