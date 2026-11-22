(() => {
  const selector = "time[data-locale-date][data-date-start]";
  const parseDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
  };

  function renderDate(element) {
    const locale = document.documentElement.lang || "id-ID";
    const start = parseDate(element.dataset.dateStart);
    const end = parseDate(element.dataset.dateEnd);
    if (!start) return;
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    });
    const first = formatter.format(start);
    const last = end ? formatter.format(end) : "";
    const separator = locale.startsWith("zh") ? " 至 "
      : locale.startsWith("ja") ? "～"
      : locale.startsWith("ko") ? " ~ "
      : " – ";
    element.textContent = last && last !== first
      ? first + separator + last
      : first;
  }

  function updateDates() {
    document.querySelectorAll(selector).forEach(renderDate);
  }

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang")) updateDates();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateDates, { once: true });
  } else {
    updateDates();
  }
})();
