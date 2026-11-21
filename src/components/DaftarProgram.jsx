import { useEffect, useMemo, useState } from "react";
import programData from "../data/programs.json";

const DATA_PROGRAM = programData.entries;

export default function DaftarProgram() {
  const [kataKunci, setKataKunci] = useState("");
  const [locale, setLocale] = useState("id-ID");

  useEffect(() => {
    const updateLocale = () => setLocale(document.documentElement.lang || "id-ID");
    updateLocale();
    const observer = new MutationObserver(updateLocale);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const ordinalFormat = useMemo(() => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }), [locale]);

  const hasil = useMemo(() => {
    const q = kataKunci.trim().toLocaleLowerCase("id");
    if (!q) return DATA_PROGRAM;
    return DATA_PROGRAM.filter((p) =>
      [p.nama, p.singkatan, p.kataKunci, p.deskripsi].join(" ").toLocaleLowerCase("id").includes(q)
    );
  }, [kataKunci]);

  return (
    <div className="program-directory">
      <div className="program-search-wrap max-w-2xl mb-8">
        <label htmlFor="cari-program" className="block text-sm font-bold font-nunito text-malam mb-2">
          Cari program keahlian
        </label>
        <p id="petunjuk-cari-program" className="text-sm text-tinta-pudar mb-3">
          Masukkan nama, singkatan, atau bidang yang ingin diketahui.
        </p>
        <div className="relative">
          <input
            id="cari-program"
            type="search"
            value={kataKunci}
            onChange={(event) => setKataKunci(event.target.value)}
            placeholder="Contoh: TKJ, jaringan, atau laboratorium"
            aria-describedby="petunjuk-cari-program"
            className="program-search-input w-full min-h-12 rounded-xl border px-4 pr-16 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-ukir/20"
            autoComplete="off"
          />
          {kataKunci && (
            <button
              type="button"
              onClick={() => setKataKunci("")}
              className="program-search-clear absolute right-3 top-1/2 -translate-y-1/2 min-h-11 min-w-11 rounded-lg px-3 py-2 text-sm font-bold"
              aria-label="Hapus kata pencarian"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-tinta-pudar mb-5" role="status" aria-live="polite" aria-atomic="true">
        Menampilkan <strong className="text-malam">{numberFormat.format(hasil.length)}</strong> dari {numberFormat.format(DATA_PROGRAM.length)} nama program.
      </p>

      {hasil.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hasil.map((program, index) => (
            <article key={program.id} className="kartu !p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="font-office-code-pro text-xs tracking-widest text-ukir">PROGRAM {ordinalFormat.format(index + 1)}</span>
                <span className="rounded-full bg-gading px-3 py-1 text-xs font-bold font-reglo text-malam">{program.singkatan}</span>
              </div>
              <h2 className="font-judul font-familjen text-xl text-malam leading-snug">{program.nama}</h2>
              <p className="mt-3 text-sm leading-relaxed text-tinta-pudar">{program.deskripsi}</p>
              <p className="mt-4 border-t border-current/10 pt-3 text-xs leading-relaxed text-tinta-pudar">
                Gambaran umum bidang keahlian
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="program-empty rounded-2xl border border-dashed px-6 py-12 text-center">
          <p className="font-judul font-literata text-xl text-malam mb-2">Program tidak ditemukan</p>
          <p className="text-sm text-tinta-pudar mb-5">Periksa ejaan atau coba nama bidang yang berbeda.</p>
          <button type="button" onClick={() => setKataKunci("")} className="tombol tombol-ukir !w-auto">
            Tampilkan semua program
          </button>
        </div>
      )}

      <p className="text-xs text-tinta-pudar mt-7 leading-relaxed">
        Nama program mengacu pada daftar “Program Keahlian” di beranda situs resmi SMK Negeri 1 Mandau.
        Uraian di setiap kartu merupakan ringkasan umum bidang keahlian untuk membantu orientasi pembaca,
        bukan rincian kurikulum atau pernyataan resmi sekolah. Kata kunci pencarian hanya bantuan navigasi.
        Periksa sumber asli untuk memastikan nama dan informasi terbaru.
      </p>
    </div>
  );
}
