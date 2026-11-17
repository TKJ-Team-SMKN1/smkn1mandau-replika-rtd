import { useMemo, useState } from "react";

const DATA_PROGRAM = [
  { id: "dpib", nama: "Desain Pemodelan dan Informasi Bangunan", singkatan: "DPIB", kataKunci: "desain bangunan konstruksi gambar" },
  { id: "tav", nama: "Teknik Audio Video", singkatan: "TAV", kataKunci: "elektronika audio video" },
  { id: "titl", nama: "Teknik Instalasi Tenaga Listrik", singkatan: "TITL", kataKunci: "listrik instalasi tenaga" },
  { id: "tkr", nama: "Teknik Kendaraan Ringan", singkatan: "TKR", kataKunci: "otomotif mobil kendaraan" },
  { id: "tp", nama: "Teknik Pengelasan", singkatan: "TP", kataKunci: "las fabrikasi logam" },
  { id: "tbsm", nama: "Teknik Bisnis Sepeda Motor", singkatan: "TBSM", kataKunci: "otomotif sepeda motor bisnis" },
  { id: "tkj", nama: "Teknik Komputer dan Jaringan", singkatan: "TKJ", kataKunci: "komputer jaringan server teknologi informasi" },
  { id: "gp", nama: "Geologi Pertambangan", singkatan: "GP", kataKunci: "geologi tambang mineral bumi" },
  { id: "tpmg", nama: "Teknik Pemboran Minyak dan Gas", singkatan: "TPMG", kataKunci: "pemboran minyak gas energi" },
  { id: "apl", nama: "Analisis Pengujian Laboratorium", singkatan: "APL", kataKunci: "analisis pengujian laboratorium kimia" }
];

export default function DaftarProgram() {
  const [kataKunci, setKataKunci] = useState("");

  const hasil = useMemo(() => {
    const q = kataKunci.trim().toLocaleLowerCase("id");
    if (!q) return DATA_PROGRAM;
    return DATA_PROGRAM.filter((p) =>
      [p.nama, p.singkatan, p.kataKunci].join(" ").toLocaleLowerCase("id").includes(q)
    );
  }, [kataKunci]);

  return (
    <div>
      <div className="max-w-2xl mb-8">
        <label htmlFor="cari-program" className="block text-sm font-bold text-malam mb-2">
          Cari program keahlian
        </label>
        <div className="relative">
          <input
            id="cari-program"
            type="search"
            value={kataKunci}
            onChange={(event) => setKataKunci(event.target.value)}
            placeholder="Contoh: TKJ, listrik, otomotif..."
            className="w-full min-h-12 rounded-xl border border-malam/20 bg-white px-4 py-3 text-malam placeholder:text-tinta-pudar/60 shadow-sm focus:border-ukir focus:outline-none focus:ring-2 focus:ring-ukir/20"
            autoComplete="off"
          />
          {kataKunci && (
            <button
              type="button"
              onClick={() => setKataKunci("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-ukir hover:bg-gading"
              aria-label="Hapus pencarian"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-tinta-pudar mb-5" aria-live="polite">
        Menampilkan <strong className="text-malam">{hasil.length}</strong> dari {DATA_PROGRAM.length} program keahlian.
      </p>

      {hasil.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hasil.map((program, index) => (
            <article key={program.id} className="kartu !p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="font-rapat text-xs tracking-widest text-ukir">PROGRAM {String(index + 1).padStart(2, "0")}</span>
                <span className="rounded-full bg-gading px-3 py-1 text-xs font-bold text-malam">{program.singkatan}</span>
              </div>
              <h3 className="font-judul text-xl text-malam leading-snug">{program.nama}</h3>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-malam/25 bg-white/70 px-6 py-12 text-center">
          <p className="font-judul text-xl text-malam mb-2">Program tidak ditemukan</p>
          <p className="text-sm text-tinta-pudar mb-5">Coba kata kunci lain atau hapus pencarian.</p>
          <button type="button" onClick={() => setKataKunci("")} className="tombol tombol-ukir !w-auto">Tampilkan semua program</button>
        </div>
      )}

      <p className="text-xs text-tinta-pudar mt-7 leading-relaxed">
        Nama program mengacu pada daftar “Program Keahlian” di beranda situs resmi SMK Negeri 1 Mandau. Pengelompokan dan kata kunci pencarian hanya bantuan navigasi pada replika ini, bukan klasifikasi resmi sekolah.
      </p>
    </div>
  );
}
