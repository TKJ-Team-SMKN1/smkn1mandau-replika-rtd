(() => {
  const KEY = "smkn1mandau-language";
  

  
  
  

  
  
  
  
  
  
  // Lexical review: KBBI (ID), DBP/PRPM (MS), Cambridge Dictionary (EN).
  // DeepL supplies draft translations; proper names and local place names are preserved.
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  

  // Context-aware counter fragments: keep the three locales grammatical when React renders dynamic counts.
  
  
  


  // Coverage pass: shared navigation, interactive React islands, and data-driven labels.
  // Proper names, school acronyms, personal names, and official program abbreviations stay unchanged.
  
  
  

  
  
  

  
  

  const translations = { id: {}, en: {}, ms: {}, zh: {} };
  const baseLocaleFiles = {
    en: "/locales/en-base.json",
    ms: "/locales/ms-base.json",
    zh: "/locales/zh-base.json"
  };
  const loadedBaseLocales = new Set();
  const extraLocaleFiles = {
    en: ["/locales/en-extra-1.json", "/locales/en-extra-2.json", "/locales/en-extra-3.json", "/locales/en-extra-4.json"],
    ms: ["/locales/ms-extra-1.json", "/locales/ms-extra-2.json", "/locales/ms-extra-3.json", "/locales/ms-extra-4.json"],
    zh: ["/locales/zh-extra-1.json", "/locales/zh-extra-2.json", "/locales/zh-extra-3.json", "/locales/zh-extra-4.json"]
  };
  const localeFontStylesheets = {
    zh: ["/fonts/noto-sans-sc.css"],
    "zh-Hant": ["/fonts/noto-sans-tc.css", "/fonts/source-han-serif-hk.css"]
  };

  function loadLocaleFontStylesheets(lang) {
    for (const href of localeFontStylesheets[lang] || []) {
      if (document.querySelector('link[data-locale-font-href="' + href + '"]')) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.localeFontHref = href;
      link.onerror = () => link.remove();
      document.head.appendChild(link);
    }
  }

  const loadedExtraLocales = new Set();
  let languageRequestId = 0;

  async function loadExtraTranslations(lang) {
    if (lang === "id") return true;
    const baseUrl = baseLocaleFiles[lang];
    if (!baseUrl) return false;
    if (!loadedBaseLocales.has(lang)) {
      try {
        const response = await fetch(baseUrl, { credentials: "same-origin", cache: "force-cache" });
        if (!response.ok) return false;
        const base = await response.json();
        if (!base || typeof base !== "object" || Array.isArray(base)) return false;
        Object.assign(translations[lang], base);
        loadedBaseLocales.add(lang);
      } catch {
        return false;
      }
    }
    const urls = extraLocaleFiles[lang];
    if (urls && !loadedExtraLocales.has(lang)) {
      try {
        const responses = await Promise.all(urls.map((url) => fetch(url, { credentials: "same-origin", cache: "force-cache" })));
        if (responses.every((response) => response.ok)) {
          const chunks = await Promise.all(responses.map((response) => response.json()));
          for (const extra of chunks) {
            if (extra && typeof extra === "object" && !Array.isArray(extra)) Object.assign(translations[lang], extra);
          }
          loadedExtraLocales.add(lang);
        }
      } catch {
        // Base locale remains usable when optional archive chunks fail.
      }
    }
    return loadedBaseLocales.has(lang);
  }

  const original = new WeakMap();
  const originalAttributes = new WeakMap();
  const attributeNames = ["placeholder", "aria-label", "title", "aria-description"];
  const observerOptions = { childList: true, characterData: true, attributes: true, attributeFilter: attributeNames, subtree: true };
  let observer = null;
  let activeLanguage = "id";

  const getDictionary = () => translations[activeLanguage] || {};
  const documentLanguage = (lang) => ({ id: "id-ID", en: "en", ms: "ms-MY", zh: "zh-CN" })[lang] || "id-ID";

  function translateTextNode(node, dictionary) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.parentElement) return;
    const parent = node.parentElement;
    if (parent.closest("script, style, noscript, textarea, code, pre, [data-no-translate]")) return;
    if (!original.has(node)) original.set(node, node.nodeValue || "");
    const base = original.get(node);
    const trimmed = base.trim();
    if (!trimmed) return;
    const translated = dictionary[trimmed] || dictionary[trimmed.replace(/\s+/g, " ")];
    const nextValue = translated ? base.replace(trimmed, translated) : base;
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  }

  function translateAttributes(root, dictionary) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
    const elements = [root, ...root.querySelectorAll("[placeholder], [aria-label], [title], [aria-description]")];
    for (const element of elements) {
      for (const attr of attributeNames) {
        if (!element.hasAttribute(attr)) continue;
        let saved = originalAttributes.get(element);
        if (!saved) { saved = {}; originalAttributes.set(element, saved); }
        if (!(attr in saved)) saved[attr] = element.getAttribute(attr) || "";
        const base = saved[attr];
        const translated = dictionary[`@${attr}:${base}`];
        const nextValue = translated || base;
        if (element.getAttribute(attr) !== nextValue) element.setAttribute(attr, nextValue);
      }
    }
  }

  function translateSubtree(root, dictionary) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, dictionary);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateTextNode(walker.currentNode, dictionary);
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root, dictionary);
    else for (const child of root.children || []) translateAttributes(child, dictionary);
  }

  function syncLanguageControls(lang) {
    document.querySelectorAll("[data-language-picker]").forEach((picker) => {
      if (picker.value !== lang) picker.value = lang;
    });
  }

  async function applyLanguage(lang) {
    const requestedLanguage = Object.prototype.hasOwnProperty.call(translations, lang) ? lang : (lang === "zh-Hant" ? "zh" : "id");
    const requestId = ++languageRequestId;
    const localeLoaded = await loadExtraTranslations(requestedLanguage);
    if (requestId !== languageRequestId) return;
    if (requestedLanguage !== "id" && !localeLoaded) {
      activeLanguage = "id";
      document.documentElement.lang = "id-ID";
      syncLanguageControls("id");
      try { localStorage.setItem(KEY, "id"); } catch { /* Keep the source language for this view. */ }
      return;
    }
    activeLanguage = requestedLanguage;
    loadLocaleFontStylesheets(lang === "zh-Hant" ? "zh-Hant" : requestedLanguage);
    const dictionary = getDictionary();
    observer?.disconnect();
    try {
      document.documentElement.lang = lang === "zh-Hant" ? "zh-Hant" : documentLanguage(activeLanguage);
      translateSubtree(document.body, dictionary);
      syncLanguageControls(activeLanguage);

      const pageTitle = document.querySelector("title");
      if (pageTitle) {
        if (!original.has(pageTitle)) original.set(pageTitle, pageTitle.textContent || "");
        const baseTitle = original.get(pageTitle);
        const nextTitle = dictionary[baseTitle] || baseTitle;
        if (pageTitle.textContent !== nextTitle) pageTitle.textContent = nextTitle;
      }

      const description = document.querySelector('meta[name="description"]');
      if (description) {
        let saved = originalAttributes.get(description);
        if (!saved) { saved = {}; originalAttributes.set(description, saved); }
        if (!("content" in saved)) saved.content = description.getAttribute("content") || "";
        const baseDescription = saved.content;
        const nextDescription = dictionary[baseDescription] || baseDescription;
        if (description.getAttribute("content") !== nextDescription) description.setAttribute("content", nextDescription);
      }
      try { localStorage.setItem(KEY, activeLanguage); } catch { /* Language remains active for this view. */ }
    } finally {
      observer?.observe(document.body, observerOptions);
    }
  }

  function handleMutations(records) {
    const changedNodes = new Set();
    const changedAttributes = new Set();
    for (const record of records) {
      if (record.type === "characterData") {
        original.set(record.target, record.target.nodeValue || "");
        changedNodes.add(record.target);
      } else if (record.type === "attributes") {
        let saved = originalAttributes.get(record.target);
        if (!saved) { saved = {}; originalAttributes.set(record.target, saved); }
        saved[record.attributeName] = record.target.getAttribute(record.attributeName) || "";
        changedAttributes.add(record.target);
      } else {
        for (const node of record.addedNodes) changedNodes.add(node);
      }
    }
    if (!changedNodes.size && !changedAttributes.size) return;
    observer?.disconnect();
    try {
      const dictionary = getDictionary();
      for (const node of changedNodes) translateSubtree(node, dictionary);
      for (const element of changedAttributes) translateAttributes(element, dictionary);
    } finally {
      observer?.observe(document.body, observerOptions);
    }
  }

  function init() {
    const picker = document.querySelector("[data-language-picker]");
    let lang = "id";
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && Object.prototype.hasOwnProperty.call(translations, saved)) lang = saved;
    } catch { /* Default to Indonesian when local storage is unavailable. */ }

    picker?.addEventListener("change", () => applyLanguage(picker.value));
    observer = new MutationObserver(handleMutations);
    observer.observe(document.body, observerOptions);
    applyLanguage(lang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
