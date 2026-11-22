(() => {
  const KEY = "smkn1mandau-language";
  const EN_FILES = [
    "/locales/en-base.json",
    "/locales/en-extra-1.json",
    "/locales/en-extra-2.json",
    "/locales/en-extra-3.json",
    "/locales/en-extra-4.json"
  ];
  const MS_FILES = [
    "/locales/ms-base.json",
    "/locales/ms-extra-1.json",
    "/locales/ms-extra-2.json",
    "/locales/ms-extra-3.json",
    "/locales/ms-extra-4.json",
    "/locales/ms-completion.json"
  ];
  const ZH_FILES = [
    "/locales/zh-base.json",
    "/locales/zh-extra-1.json",
    "/locales/zh-extra-2.json",
    "/locales/zh-extra-3.json",
    "/locales/zh-extra-4.json",
    "/locales/zh-completion.json"
  ];
  const chunkFiles = (prefix) => Array.from({ length: 13 }, (_, index) =>
    "/locales/" + prefix + "-" + String(index + 1).padStart(2, "0") + ".json"
  );
  const localeConfigs = {
    "id-ID": { files: [] },
    "en-US": { files: EN_FILES },
    "en-GB": { files: EN_FILES, overrides: ["/locales/en-GB-overrides.json"] },
    "en-AU": { files: EN_FILES, overrides: ["/locales/en-GB-overrides.json"] },
    "en-CA": { files: EN_FILES, overrides: ["/locales/en-CA-overrides.json"] },
    "en-SG": { files: EN_FILES, overrides: ["/locales/en-GB-overrides.json"] },
    "ms-MY": { files: MS_FILES },
    "ms-SG": { files: MS_FILES, overrides: ["/locales/ms-SG-overrides.json"] },
    "zh-CN": { files: ZH_FILES },
    "zh-SG": { files: ZH_FILES, overrides: ["/locales/zh-SG-overrides.json"] },
    "ko-KR": { files: chunkFiles("ko"), overrides: ["/locales/ko-overrides.json"] },
    "ja-JP": { files: chunkFiles("ja") },
    "ta-SG": { files: chunkFiles("ta"), overrides: ["/locales/ta-overrides.json"] }
  };
  const legacyLocaleAliases = {
    id: "id-ID",
    en: "en-US",
    ms: "ms-MY",
    zh: "zh-CN",
    "zh-Hant": "zh-CN"
  };
  const translations = Object.fromEntries(Object.keys(localeConfigs).map((locale) => [locale, {}]));
  const loadedLocales = new Set();
  const localeFontStylesheets = {
    "zh-CN": ["/fonts/noto-sans-sc.css"],
    "zh-SG": ["/fonts/noto-sans-sc.css"],
    "ja-JP": ["/fonts/japanese/genzui-sans/genzui-sans.css"],
    "ko-KR": ["/fonts/korean/gothic-a1.css"],
    "ta-SG": ["/fonts/tamil/noto-sans-tamil.css"]
  };

  function normalizeLanguage(value) {
    if (Object.prototype.hasOwnProperty.call(localeConfigs, value)) return value;
    return legacyLocaleAliases[value] || "id-ID";
  }

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

  async function loadExtraTranslations(lang) {
    if (lang === "id-ID") return true;
    if (loadedLocales.has(lang)) return true;
    const config = localeConfigs[lang];
    if (!config) return false;
    try {
      const responses = await Promise.all(config.files.map((url) =>
        fetch(url, { credentials: "same-origin", cache: "force-cache" })
      ));
      if (!responses.every((response) => response.ok)) return false;
      const dictionaries = await Promise.all(responses.map((response) => response.json()));
      const merged = {};
      for (const dictionary of dictionaries) {
        if (!dictionary || typeof dictionary !== "object" || Array.isArray(dictionary)) return false;
        Object.assign(merged, dictionary);
      }
      if (config.overrides?.length) {
        const overrideResponses = await Promise.all(config.overrides.map((url) =>
          fetch(url, { credentials: "same-origin", cache: "force-cache" })
        ));
        if (!overrideResponses.every((response) => response.ok)) return false;
        const overrides = await Promise.all(overrideResponses.map((response) => response.json()));
        for (const override of overrides) {
          if (!override || typeof override !== "object" || Array.isArray(override)) return false;
          Object.assign(merged, override);
        }
      }
      translations[lang] = merged;
      loadedLocales.add(lang);
      return true;
    } catch {
      return false;
    }
  }

  const original = new WeakMap();
  const originalAttributes = new WeakMap();
  const attributeNames = ["placeholder", "aria-label", "title", "aria-description"];
  const observerOptions = { childList: true, characterData: true, attributes: true, attributeFilter: attributeNames, subtree: true };
  let observer = null;
  let activeLanguage = "id-ID";

  const getDictionary = () => translations[activeLanguage] || {};
  const documentLanguage = (lang) => lang;

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
    const requestedLanguage = normalizeLanguage(lang);
    const requestId = ++languageRequestId;
    const localeLoaded = await loadExtraTranslations(requestedLanguage);
    if (requestId !== languageRequestId) return;
    if (!localeLoaded) {
      activeLanguage = "id-ID";
      document.documentElement.lang = "id-ID";
      syncLanguageControls("id-ID");
      try { localStorage.setItem(KEY, "id-ID"); } catch { /* Keep the source language for this view. */ }
      return;
    }
    activeLanguage = requestedLanguage;
    loadLocaleFontStylesheets(activeLanguage);
    const dictionary = getDictionary();
    observer?.disconnect();
    try {
      document.documentElement.lang = documentLanguage(activeLanguage);
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
    let lang = "id-ID";
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) lang = normalizeLanguage(saved);
    } catch { /* Default to Indonesian when local storage is unavailable. */ }

    picker?.addEventListener("change", () => applyLanguage(picker.value));
    observer = new MutationObserver(handleMutations);
    observer.observe(document.body, observerOptions);
    applyLanguage(lang);
  }

  let languageRequestId = 0;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
