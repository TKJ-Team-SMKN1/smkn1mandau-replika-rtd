import { useMemo, useState } from "react";

const TEKNOLOGI = [
  { name: "Python", type: "Bahasa pemrograman", description: "Automasi, pemrosesan data, backend, dan kecerdasan buatan.", url: "https://docs.python.org/3/" },
  { name: "JavaScript", type: "Bahasa pemrograman", description: "Interaksi web di browser serta aplikasi berbasis JavaScript.", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "TypeScript", type: "Bahasa pemrograman", description: "Pengembangan JavaScript dengan sistem tipe statis.", url: "https://www.typescriptlang.org/docs/" },
  { name: "Java", type: "Bahasa pemrograman", description: "Pemrograman berorientasi objek dan aplikasi lintas platform.", url: "https://dev.java/learn/" },
  { name: "C", type: "Bahasa pemrograman", description: "Dasar pemrograman sistem dan konsep memori tingkat rendah.", url: "https://en.cppreference.com/w/c" },
  { name: "C++", type: "Bahasa pemrograman", description: "Pemrograman sistem, aplikasi performa tinggi, dan perangkat lunak.", url: "https://en.cppreference.com/w/cpp" },
  { name: "C#", type: "Bahasa pemrograman", description: "Aplikasi .NET, layanan backend, dan pengembangan perangkat lunak.", url: "https://learn.microsoft.com/dotnet/csharp/" },
  { name: "PHP", type: "Bahasa pemrograman", description: "Pengembangan aplikasi web sisi server.", url: "https://www.php.net/docs.php" },
  { name: "Go", type: "Bahasa pemrograman", description: "Layanan backend, jaringan, dan perangkat lunak konkuren.", url: "https://go.dev/doc/" },
  { name: "Rust", type: "Bahasa pemrograman", description: "Perangkat lunak sistem dengan fokus pada keamanan memori.", url: "https://doc.rust-lang.org/book/" },
  { name: "HTML", type: "Markup", description: "Menyusun struktur dan semantik konten halaman web.", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS", type: "Styling", description: "Mengatur tampilan, tata letak, dan responsivitas halaman web.", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "SQL", type: "Query", description: "Membaca, mengelola, dan memanipulasi data pada basis data relasional.", url: "https://www.postgresql.org/docs/current/sql.html" }
];

const FILTERS = ["Semua", "Bahasa pemrograman", "Markup", "Styling", "Query"];

export default function DaftarTeknologi() {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("Semua");

  const hasil = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("id");
    return TEKNOLOGI.filter((item) => {
      const cocokKategori = kategori === "Semua" || item.type === kategori;
      const cocokKata = !term || [item.name, item.type, item.description].join(" ").toLocaleLowerCase("id").includes(term);
      return cocokKategori && cocokKata;
    });
  }, [query, kategori]);

  return (
    <div>
      <div className="max-w-2xl mb-7">
        <label htmlFor="cari-teknologi" className="block text-sm font-bold text-malam mb-2">
          Cari bahasa atau teknologi
        </label>
        <input
          id="cari-teknologi"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Contoh: Python, web, database..."
          autoComplete="off"
          className="w-full min-h-12 rounded-xl border border-malam/20 bg-white px-4 py-3 text-malam placeholder:text-tinta-pudar/60 shadow-sm focus:border-ukir focus:outline-none focus:ring-2 focus:ring-ukir/20"
        />
      </div>

      <div role="group" aria-label="Filter kategori teknologi" className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((filter) => {
          const active = kategori === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setKategori(filter)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active ? "border-malam bg-malam text-white" : "border-malam/20 bg-white text-malam hover:border-ukir"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <p className="mb-5 text-sm text-tinta-pudar" aria-live="polite">
        Menampilkan <strong className="text-malam">{hasil.length}</strong> dari {TEKNOLOGI.length} referensi.
      </p>

      {hasil.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hasil.map((item) => (
            <article key={item.name} className="kartu flex flex-col !p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-judul text-xl text-malam">{item.name}</h3>
                <span className="text-[.68rem] font-semibold uppercase tracking-wider rounded-full bg-gading text-malam px-2.5 py-1">{item.type}</span>
              </div>
              <p className="text-sm text-tinta-pudar leading-relaxed flex-1">{item.description}</p>
              <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ukir hover:underline" href={item.url} target="_blank" rel="noopener noreferrer">
                Dokumentasi resmi <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-malam/25 bg-white/70 px-6 py-12 text-center">
          <p className="font-judul text-xl text-malam mb-2">Tidak ada hasil yang cocok</p>
          <p className="text-sm text-tinta-pudar">Ubah kata kunci atau pilih kategori lain.</p>
          <button type="button" onClick={() => { setQuery(""); setKategori("Semua"); }} className="tombol tombol-ukir !w-auto mt-5">
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
