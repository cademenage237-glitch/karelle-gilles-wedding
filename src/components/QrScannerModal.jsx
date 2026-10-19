import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ID = 'cg-qr-scanner';

export default function QrScannerModal({ onResult, onClose }) {
  const scannerRef = useRef(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;
    stoppedRef.current = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (stoppedRef.current) return;
          stoppedRef.current = true;
          scanner
            .stop()
            .catch(() => {})
            .finally(() => onResult(decodedText));
        },
        () => {}
      )
      .catch(() => {
        onResult(null, "Impossible d'accéder à la caméra. Vérifiez les permissions.");
      });

    return () => {
      if (!stoppedRef.current) {
        stoppedRef.current = true;
        scanner.stop().catch(() => {});
      }
    };
  }, [onResult]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center px-6">
      <button type="button" onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none" aria-label="Fermer">
        &times;
      </button>
      <p className="text-ivory/80 text-sm uppercase tracking-[0.2em] mb-4">Scanner un QR code</p>
      <div id={SCANNER_ID} className="w-full max-w-sm rounded overflow-hidden bg-black" />
      <p className="text-ivory/50 text-xs mt-6 max-w-xs text-center">
        Visez le QR code de l&rsquo;invité. La recherche se lance automatiquement.
      </p>
    </div>
  );
}
