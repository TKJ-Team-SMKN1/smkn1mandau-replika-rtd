const reveal = (delay = "") => `hero-reveal ${delay}`;

export default function Hero() {
  return (
    <section aria-label="Perkenalan SMK Negeri 1 Mandau" className="hero-shell relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="batas-ukir absolute inset-x-0 top-0 h-2"
        style={{ "--batik-warna-1": "#d9843f", "--batik-warna-2": "#f6efe6", "--batik-warna-3": "#1a4d2e", "--batik-skala": "24" }}
      />
      <div aria-hidden="true" className="hero-glow hero-glow-one" />
      <div aria-hidden="true" className="hero-glow hero-glow-two" />
      <div aria-hidden="true" className="hero-pattern batas-ukir" style={{ "--batik-warna-1": "#d9843f", "--batik-warna-2": "transparent", "--batik-warna-3": "#2d6b45", "--batik-skala": "34" }} />

      <div className="kontainer-laman hero-content relative z-10">
        <div className="hero-copy">
          <p className={reveal("delay-1")}>
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            Sekolah Menengah Kejuruan Negeri · Kabupaten Bengkalis, Riau
          </p>
          <h1 className={reveal("delay-2")}>
            Informasi sekolah, dirangkai ulang sebagai <span>konsep independen.</span>
          </h1>
          <p className={reveal("delay-3")}>
            Replika ini menyusun ulang informasi profil, program keahlian, dan arsip publikasi
            yang tersedia di situs resmi SMK Negeri 1 Mandau. Informasi operasional
            tetap harus diperiksa melalui sumber aslinya.
          </p>
          <div className={`hero-actions ${reveal("delay-4")}`}>
            <a href="/program" className="tombol tombol-ukir">
              Lihat program keahlian <span aria-hidden="true">↗</span>
            </a>
            <a href="/pengumuman" className="tombol tombol-garis hero-secondary">
              Arsip pengumuman
            </a>
          </div>
        </div>

        <aside className={`hero-sidecard ${reveal("delay-4")}`} aria-label="Identitas visual replika">
          <div className="hero-sidecard-top">
            <span className="hero-seal">1</span>
            <span className="hero-side-label">SMK NEGERI<br />1 MANDAU</span>
          </div>
          <div className="hero-side-rule batas-ukir" aria-hidden="true" style={{ "--batik-warna-1": "#b85c14", "--batik-warna-2": "#f6efe6", "--batik-warna-3": "#1a4d2e", "--batik-skala": "15" }} />
          <p className="hero-side-title">Belajar.<br />Berkarya.<br /><span>Bertumbuh.</span></p>
          <p className="hero-side-note">Ruang pendidikan kejuruan dan pengembangan kompetensi.</p>
          <div className="hero-side-bottom"><span>REPLIKA · KONSEP VISUAL</span><span aria-hidden="true">✳</span></div>
        </aside>
      </div>

      <style>{`
        .hero-shell { background:radial-gradient(ellipse at 78% 28%,rgba(45,107,69,.28),transparent 34%),linear-gradient(118deg,#09183a 0%,#102b50 58%,#123b38 120%); }
        .hero-content { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(230px,.65fr); align-items:center; gap:clamp(2rem,7vw,6rem); min-height:610px; padding-block:clamp(5rem,10vw,8rem); }
        .hero-copy { max-width:760px; }
        .hero-copy > p:first-child { display:flex; align-items:center; gap:.7rem; margin:0 0 1.6rem; color:#efb17b; font-family:"Azeret Mono Local",monospace; font-size:.9rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }
        .hero-eyebrow-dot { width:8px; height:8px; border-radius:50%; background:#d9843f; box-shadow:0 0 0 5px rgba(217,132,63,.15); }
        .hero-copy h1 { max-width:790px; margin:0; color:#fff; font-family:"Anton Local","Archivo Local",sans-serif; font-size:clamp(2.55rem,5.6vw,5.1rem); line-height:1.13; letter-spacing:-.045em; }
        .hero-copy h1 span { color:#efb17b; }
        /* Tamil glyphs need taller line boxes and must not inherit Latin display tracking. */
        html[lang="ta-SG"] .hero-copy h1 {
          font-family:"Noto Serif Tamil Local","Noto Sans Tamil",serif;
          font-size:clamp(2.1rem,4.8vw,4.35rem);
          line-height:1.7;
          letter-spacing:normal;
          overflow:visible;
          text-wrap:pretty;
        }
        html[lang="ta-SG"] .hero-copy h1 span {
          color:#efb17b;
          line-height:inherit;
          letter-spacing:normal;
        }
        html[lang="ta-SG"] .hero-copy > p:not(:first-child) {
          margin-top:2rem;
          line-height:2;
          overflow:visible;
        }
        .hero-copy > p:not(:first-child) { max-width:610px; margin:1.6rem 0 2rem; color:rgba(246,239,230,.78); font-size:clamp(1rem,1.4vw,1.15rem); line-height:1.85; }
        /* Give translated hero headings and descriptions more breathing room
           across English variants, Indonesian, Malay, and Singapore locales. */
        :is(html[lang^="en"],html[lang="id-ID"],html[lang$="-SG"]:not([lang="ta-SG"]),html[lang^="ms"]) .hero-copy h1 {
          margin-bottom:0;
          line-height:1.2;
          letter-spacing:normal;
        }
        :is(html[lang^="en"],html[lang="id-ID"],html[lang$="-SG"]:not([lang="ta-SG"]),html[lang^="ms"]) .hero-copy h1 + p {
          margin-top:clamp(2.5rem,5vw,3.5rem);
          line-height:1.95;
        }
        .hero-actions { display:flex; flex-wrap:wrap; gap:.85rem; }
        .hero-secondary { color:#fff !important; border-color:rgba(255,255,255,.32) !important; }
        .hero-secondary:hover { background:rgba(255,255,255,.1) !important; }
        .hero-glow { position:absolute; width:340px; height:340px; border-radius:50%; filter:blur(70px); pointer-events:none; }
        .hero-glow-one { top:8%; right:15%; background:rgba(184,92,20,.15); }
        .hero-glow-two { bottom:-24%; left:36%; background:rgba(45,107,69,.2); }
        .hero-pattern { position:absolute; top:0; right:0; bottom:0; width:11%; opacity:.12; mask-image:linear-gradient(90deg,transparent,#000); }
        .hero-sidecard { position:relative; max-width:310px; justify-self:end; width:100%; padding:1.6rem; border:1px solid rgba(246,239,230,.2); border-radius:1.4rem; background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.035)); box-shadow:0 30px 90px rgba(0,0,0,.18); backdrop-filter:blur(12px); }
        .hero-sidecard-top { display:flex; align-items:center; gap:.85rem; }
        .hero-seal { display:grid; place-items:center; width:48px; height:48px; border:1px solid rgba(239,177,123,.75); border-radius:15px 15px 15px 4px; color:#fff; background:linear-gradient(145deg,#d9843f,#8a4410); font-family:"Reglo Local","Archivo Local",sans-serif; font-size:1.4rem; }
        .hero-side-label { color:rgba(246,239,230,.8); font-family:"Azeret Mono Local",monospace; font-size:.75rem; font-weight:700; letter-spacing:.16em; line-height:1.45; }
        .hero-side-rule { height:5px; margin:1.6rem 0; border-radius:10px; }
        .hero-side-title { margin:0; color:#fff; font-family:"Literata Local","Crimson Pro Local",serif; font-size:2rem; line-height:1.35; }
        .hero-side-title span { color:#efb17b; }
        .hero-side-note { margin:1rem 0 1.5rem; color:rgba(246,239,230,.78); font-size:.9rem; line-height:1.7; }
        .hero-side-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid rgba(255,255,255,.13); color:rgba(246,239,230,.78); font-family:"Azeret Mono Local",monospace; font-size:.68rem; letter-spacing:.12em; }
        .hero-side-bottom span:last-child { color:#efb17b; font-size:1.2rem; }
        .hero-reveal { opacity:0; transform:translateY(14px); animation:hero-enter .65s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes hero-enter { to { opacity:1; transform:translateY(0); } }
        .delay-1 { animation-delay:60ms; } .delay-2 { animation-delay:130ms; } .delay-3 { animation-delay:200ms; } .delay-4 { animation-delay:270ms; }
        @media(max-width:850px) { .hero-content { grid-template-columns:1fr; min-height:auto; padding-block:5.5rem; } .hero-sidecard { display:none; } .hero-pattern { width:24%; } }
        @media(max-width:560px) { .hero-content { padding-block:4.5rem; } .hero-copy h1 { font-size:clamp(2.35rem,11vw,3.4rem); } .hero-actions { display:grid; } .hero-actions .tombol { width:100%; } }
        @media(prefers-reduced-motion:reduce) { .hero-reveal { opacity:1; transform:none; animation:none; } }
      `}</style>
    </section>
  );
}
