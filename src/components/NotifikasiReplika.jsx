import { useState, useEffect } from "react";

const KUNCI_SIMPAN = "smkn1mandau-replika-notifikasi-dilihat";

export default function NotifikasiReplika() {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(KUNCI_SIMPAN)) setTampil(true);
    } catch {
      setTampil(true);
    }
  }, []);

  function tutup() {
    setTampil(false);
    try {
      sessionStorage.setItem(KUNCI_SIMPAN, "1");
    } catch {
      // Notifikasi tetap dapat ditutup meski penyimpanan sesi tidak tersedia.
    }
  }

  if (!tampil) return null;

  return (
    <div
      role="region"
      aria-label="Pemberitahuan status situs"
      className="relative z-[200] bg-malam-deep text-kapas border-b-2 border-ukir"
    >
      <div className="kontainer-laman flex items-start gap-3 py-3 text-sm flex-wrap">
        <span aria-hidden="true" className="text-ukir-light text-base leading-none mt-1">●</span>
        <p className="flex-1 min-w-[240px] leading-relaxed">
          <strong>Replika / konsep independen:</strong> ini bukan situs resmi dan tidak mewakili pihak sekolah.
          Informasi profil dan arsip pengumuman dirangkum dari publikasi sekolah; untuk ketentuan terbaru,
          selalu rujuk kanal asli di{" "}
          <a
            href="https://www.smkn1mandau.sch.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ukir-light underline-offset-2 text-ukir-light hover:text-white"
          >
            smkn1mandau.sch.id
          </a>.
        </p>
        <button
          onClick={tutup}
          aria-label="Tutup pemberitahuan"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
