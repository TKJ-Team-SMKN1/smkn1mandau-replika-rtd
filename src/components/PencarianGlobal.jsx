import { useEffect, useMemo, useRef, useState } from "react";

const entries = [
  { title: "Beranda", href: "/", terms: "home sekolah school utama maklumat information" },
  { title: "Profil Sekolah", href: "/profil", terms: "profil sejarah history visi misi identitas identity alamat address kontak contact" },
  { title: "Program Keahlian", href: "/program", terms: "program keahlian vokasi vocational tkj teknik komputer jaringan tav audio video titl listrik tkr kendaraan tp pengelasan tbsm motor gp geologi tpmg minyak gas apl laboratorium dpib bangunan" },
  { title: "SDM & Guru", href: "/sdm", terms: "guru tenaga pendidik staf staff teachers personnel kepala sekolah" },
  { title: "Pengumuman", href: "/pengumuman", terms: "pengumuman berita announcement notice pendaftaran penerimaan murid baru kelulusan" },
  { title: "Fasilitas", href: "/fasilitas", terms: "fasilitas ruang kelas laboratorium bengkel perpustakaan kantin masjid" },
  { title: "Ekstrakurikuler", href: "/ekstrakurikuler", terms: "ekstrakurikuler kegiatan siswa klub extracurricular activities" },
  { title: "Kegiatan", href: "/kegiatan", terms: "kegiatan acara event aktivitas sekolah" },
  { title: "Unit Sekolah", href: "/unit-sekolah", terms: "unit bkk bursa kerja khusus lsp sertifikasi services" },
  { title: "Tentang Replika", href: "/tentang", terms: "tentang proyek sumber data source project" },
  { title: "Aksesibilitas", href: "/aksesibilitas", terms: "aksesibilitas accessibility wcag keyboard screen reader" },
  { title: "Pengaturan", href: "/pengaturan", terms: "pengaturan tema settings display" }
];

export default function PencarianGlobal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const normalized = query.trim().toLocaleLowerCase();
  const results = useMemo(() => {
    if (!normalized) return [];
    return entries.filter((entry) => (entry.title + " " + entry.terms).toLocaleLowerCase().includes(normalized)).slice(0, 8);
  }, [normalized]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <section className="site-search" aria-label="Pencarian situs">
      <div className="kontainer-laman site-search-inner">
        <button
          ref={triggerRef}
          className="site-search-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="site-search-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>Telusuri informasi sekolah</span>
        </button>
        {open && (
          <div id="site-search-panel" className="site-search-panel">
            <form role="search" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="site-search-input">Cari informasi sekolah</label>
              <div className="site-search-row">
                <input
                  ref={inputRef}
                  id="site-search-input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Masukkan kata kunci"
                  autoComplete="off"
                  aria-label="Cari informasi sekolah"
                />
                <button type="button" className="site-search-close" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>
                  Tutup pencarian
                </button>
              </div>
            </form>
            <div className="site-search-results" aria-live="polite" aria-atomic="true">
              {!normalized && <p>Mulai ketik untuk mencari halaman sekolah.</p>}
              {normalized && (
                <>
                  <h2>Hasil pencarian</h2>
                  {results.length ? (
                    <ul>
                      {results.map((entry) => <li key={entry.href}><a href={entry.href}>{entry.title}<span aria-hidden="true">↗</span></a></li>)}
                    </ul>
                  ) : <p>Tidak ada halaman yang cocok.</p>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
