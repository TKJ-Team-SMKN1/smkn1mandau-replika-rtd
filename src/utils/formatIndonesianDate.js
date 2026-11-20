const MONTHS = {
  januari: "01",
  februari: "02",
  maret: "03",
  april: "04",
  mei: "05",
  juni: "06",
  juli: "07",
  agustus: "08",
  september: "09",
  oktober: "10",
  november: "11",
  desember: "12"
};

function isoDate(day, monthName, year) {
  const month = MONTHS[String(monthName).toLocaleLowerCase("id")];
  const date = String(day).padStart(2, "0");
  if (!month || Number(day) < 1 || Number(day) > 31) return null;
  return String(year) + "-" + month + "-" + date;
}

export function parseIndonesianDateRange(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  const range = text.match(/^(\d{1,2})\s*[–-]\s*(\d{1,2})\s+([\p{L}]+)\s+(\d{4})$/u);
  if (range) {
    const start = isoDate(range[1], range[3], range[4]);
    const end = isoDate(range[2], range[3], range[4]);
    return start && end ? { start, end } : null;
  }
  const single = text.match(/^(\d{1,2})\s+([\p{L}]+)\s+(\d{4})$/u);
  if (single) {
    const start = isoDate(single[1], single[2], single[3]);
    return start ? { start, end: null } : null;
  }
  return null;
}
