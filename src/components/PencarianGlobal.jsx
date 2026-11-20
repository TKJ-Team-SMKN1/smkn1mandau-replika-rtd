import { useEffect, useMemo, useRef, useState } from "react";
import programData from "../data/programs.json";
import staffData from "../data/staff.json";
import eventData from "../data/events.json";
import facilityData from "../data/facilities.json";
import profileData from "../data/school-profile.json";
import unitData from "../data/units.json";

const pageEntries = [
  { id: "page-home", title: "Beranda", href: "/", context: "Halaman sekolah", terms: "home sekolah school utama laman utama maklumat information 主页 首页" },
  { id: "page-profile", title: "Profil Sekolah", href: "/profil", context: "Profil sekolah", terms: "profil sejarah history visi misi identitas identity alamat address kontak contact profile school history 学校简介 历史 使命" },
  { id: "page-programs", title: "Program Keahlian", href: "/program", context: "Program Keahlian", terms: "program keahlian vokasi vocational program pengajian course 专业 课程" },
  { id: "page-staff", title: "SDM & Guru", href: "/sdm", context: "SDM & Guru", terms: "guru tenaga pendidik staf staff teachers personnel kepala sekolah kakitangan 教师 员工" },
  { id: "page-notices", title: "Pengumuman", href: "/pengumuman", context: "Pengumuman", terms: "pengumuman berita announcement notice pendaftaran penerimaan murid baru kelulusan 通知 公告" },
  { id: "page-facilities", title: "Fasilitas", href: "/fasilitas", context: "Fasilitas", terms: "fasilitas kemudahan ruang kelas laboratorium bengkel perpustakaan kantin masjid facilities 设施 设备" },
  { id: "page-extracurriculars", title: "Ekstrakurikuler", href: "/ekstrakurikuler", context: "Ekstrakurikuler", terms: "ekstrakurikuler aktiviti kokurikulum kegiatan siswa klub extracurricular activities 课外活动" },
  { id: "page-events", title: "Kegiatan", href: "/kegiatan", context: "Kegiatan", terms: "kegiatan aktiviti acara event events aktivitas sekolah 活动" },
  { id: "page-units", title: "Unit Sekolah", href: "/unit-sekolah", context: "Unit sekolah", terms: "unit bkk bursa kerja khusus lsp sertifikasi services perkhidmatan sekolah 单位 就业服务 职业认证" },
  { id: "page-about", title: "Tentang Replika", href: "/tentang", context: "Tentang proyek", terms: "tentang mengenai proyek sumber data source project about 关于 项目" },
  { id: "page-accessibility", title: "Aksesibilitas", href: "/aksesibilitas", context: "Aksesibilitas", terms: "aksesibilitas kebolehcapaian accessibility wcag keyboard screen reader 无障碍 键盘 屏幕阅读器" },
  { id: "page-settings", title: "Pengaturan", href: "/pengaturan", context: "Pengaturan", terms: "pengaturan tetapan tema settings display 设置 主题" }
];

const dataEntries = [
  ...programData.entries.map((item) => ({
    id: "program-" + item.id,
    title: item.nama,
    href: "/program",
    context: "Program Keahlian",
    terms: [item.singkatan, item.kataKunci, "program vocational course pengajian 专业 课程"].join(" ")
  })),
  ...staffData.entries.map((item) => ({
    id: "staff-" + item.id,
    title: item.name,
    href: "/sdm",
    context: "SDM · snapshot sumber 17 Nov 2026",
    terms: [item.role, "guru staff teacher kakitangan 教师 员工"].join(" ")
  })),
  ...eventData.entries.map((item, index) => ({
    id: "event-" + index,
    title: item.title,
    href: "/kegiatan",
    context: "Kegiatan · arsip historis",
    terms: [item.date, item.summary, "event activity kegiatan aktiviti 活动"].join(" ")
  })),
  ...unitData.units.map((item) => ({
    id: "unit-" + item.id,
    title: item.name,
    href: "/unit-sekolah",
    context: "Unit sekolah",
    terms: [item.purpose, "school service unit perkhidmatan 服务 单位"].join(" ")
  })),
  ...profileData.history.map((item, index) => ({
    id: "history-" + index,
    title: item.title,
    href: "/profil",
    context: "Sejarah sekolah",
    terms: [item.year, item.description, "school history sejarah 历史"].join(" ")
  })),
  ...profileData.mission.map((item, index) => ({
    id: "mission-" + index,
    title: item,
    href: "/profil",
    context: "Misi sekolah",
    terms: "mission school misi 使命"
  })),
  ...facilityData.historicalSnapshot.facilities.map((item, index) => ({
    id: "facility-" + index,
    title: item.count + " " + item.label,
    href: "/fasilitas",
    context: "Fasilitas · catatan historis",
    terms: "historical facilities kemudahan 设施 " + item.label
  }))
];

const entries = [...pageEntries, ...dataEntries];

export default function PencarianGlobal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const normalized = query.trim().normalize("NFKC").toLocaleLowerCase("id");
  const results = useMemo(() => {
    if (!normalized) return [];
    return entries
      .map((entry) => {
        const title = entry.title.normalize("NFKC").toLocaleLowerCase("id");
        const terms = (entry.title + " " + entry.terms + " " + entry.context).normalize("NFKC").toLocaleLowerCase("id");
        const score = title === normalized ? 0 : title.startsWith(normalized) ? 1 : terms.includes(normalized) ? 2 : 99;
        return { ...entry, score };
      })
      .filter((entry) => entry.score < 99)
      .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title, "id"))
      .slice(0, 12);
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
        <div id="site-search-panel" className="site-search-panel" hidden={!open}>
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
                    {results.map((entry) => (
                      <li key={entry.id}>
                        <a href={entry.href}>
                          <span className="site-search-result-copy">
                            <strong>{entry.title}</strong>
                            <small>{entry.context}</small>
                          </span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : <p>Tidak ada halaman yang cocok.</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
