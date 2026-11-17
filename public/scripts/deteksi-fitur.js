/**
 * SMKN 1 Mandau — Replika
 * Deteksi dukungan perangkat: CSS Houdini Paint API & WebGPU.
 * Menambahkan kelas pada <html> supaya CSS/komponen bisa menyesuaikan
 * tanpa memblokir render (progressive enhancement, bukan gatekeeping).
 */
(function () {
  const root = document.documentElement;
  const status = {
    houdini: "memeriksa",
    webgpu: "memeriksa",
  };

  function perbaruiStatusPerangkat() {
    const penampung = document.querySelector("[data-status-perangkat]");
    if (!penampung) return;

    const label = (nilai) => {
      if (nilai === "memeriksa") return "sedang memeriksa";
      return nilai === "dukung" ? "mendukung" : "memakai cadangan";
    };

    penampung.textContent =
      `Perangkat Anda ${label(status.webgpu)} WebGPU · ${label(status.houdini)} efek Houdini`;
  }

  // --- Houdini Paint Worklet ---
  if ("paintWorklet" in CSS && typeof CSS.paintWorklet?.addModule === "function") {
    Promise.resolve()
      .then(() => CSS.paintWorklet.addModule("/houdini/batik-paint-worklet.js"))
      .then(() => {
        status.houdini = "dukung";
        root.classList.add("dukung-houdini");
        root.classList.remove("tanpa-houdini");
      })
      .catch(() => {
        status.houdini = "tanpa";
        root.classList.add("tanpa-houdini");
        root.classList.remove("dukung-houdini");
      })
      .finally(perbaruiStatusPerangkat);
  } else {
    status.houdini = "tanpa";
    root.classList.add("tanpa-houdini");
  }

  // --- WebGPU ---
  async function periksaWebGPU() {
    if (!("gpu" in navigator)) {
      status.webgpu = "tanpa";
      root.classList.add("tanpa-webgpu");
      perbaruiStatusPerangkat();
      return;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      status.webgpu = adapter ? "dukung" : "tanpa";
      root.classList.toggle("dukung-webgpu", Boolean(adapter));
      root.classList.toggle("tanpa-webgpu", !adapter);
    } catch {
      status.webgpu = "tanpa";
      root.classList.add("tanpa-webgpu");
      root.classList.remove("dukung-webgpu");
    }

    perbaruiStatusPerangkat();
  }

  document.addEventListener("DOMContentLoaded", perbaruiStatusPerangkat);
  periksaWebGPU();
  perbaruiStatusPerangkat();
})();
