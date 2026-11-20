import { useEffect, useMemo, useState } from "react";
import staffData from "../data/staff.json";

const DATA = staffData.entries;
const FILTERS = [
  ["semua", "Semua kategori"],
  ["pimpinan", "Pimpinan & Koordinator"],
  ["guru", "Guru"],
  ["layanan", "Administrasi & Layanan"]
];
const initials = (name) => name.replace(/,.*$/, "").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export default function DirektoriSDM() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [locale, setLocale] = useState("id-ID");

  useEffect(() => {
    const updateLocale = () => setLocale(document.documentElement.lang || "id-ID");
    updateLocale();
    const observer = new MutationObserver(updateLocale);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const rows = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("id");
    return DATA.filter((person) =>
      (category === "semua" || person.category === category) &&
      (!term || `${person.name} ${person.role}`.toLocaleLowerCase("id").includes(term))
    );
  }, [query, category]);

  return (
    <div>
      <div className="sdm-tools">
        <label className="sdm-search">
          <span>Cari nama atau jabatan</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Contoh: guru, tata usaha, TKJ..." autoComplete="off" />
        </label>
        <div className="sdm-filters" role="group" aria-label="Filter kategori SDM">
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={category === id} className={category === id ? "sdm-filter is-active" : "sdm-filter"} onClick={() => setCategory(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="sdm-count" role="status" aria-live="polite" aria-atomic="true">
        <strong>{numberFormat.format(rows.length)}</strong> dari {numberFormat.format(DATA.length)} entri yang cocok
      </p>
      {rows.length ? (
        <div className="sdm-grid">
          {rows.map((person) => (
            <article className="sdm-card" key={person.id}>
              <div className="sdm-avatar" aria-hidden="true">{initials(person.name)}</div>
              <div className="sdm-person">
                <p className="sdm-role">{person.role}</p>
                <h2>{person.name}</h2>
                <span className="sdm-source-status">Snapshot sumber 17 Nov 2026</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="sdm-empty">
          <h2>Tidak ada entri yang cocok</h2>
          <p>Ubah kata kunci atau pilih kategori lain.</p>
          <button className="tombol tombol-ukir" onClick={() => { setQuery(""); setCategory("semua"); }}>Atur ulang pencarian</button>
        </div>
      )}
      <aside className="sdm-source-note">
        <h2>Sumber dan batasan data</h2>
        <p>Daftar ini adalah snapshot publik yang ditranskripsikan pada 17 November 2026 dari bagian “Guru dan Pegawai SMKN 1 Mandau”. Sumber tidak mencantumkan tanggal pembaruan susunan personel, sehingga daftar ini bukan konfirmasi jabatan atau status kerja saat ini.</p>
        <p><strong>Catatan rekonsiliasi:</strong> ekstraksi agregat beranda langsung pada 18 November 2026 menghasilkan 123 entri, sedangkan snapshot ini memuat 127. Selisih empat entri belum direkonsiliasi; proses ekstraksi langsung mungkin tidak menangkap seluruh konten.</p>
        <p><strong>Status validitas:</strong> snapshot historis, pembaruan jabatan belum dikonfirmasi.</p>
        <a href="http://www.smkn1mandau.sch.id/" target="_blank" rel="noopener noreferrer">Buka direktori pada situs sumber ↗</a>
      </aside>
    </div>
  );
}
