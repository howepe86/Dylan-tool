/** Extract likely total amount from receipt OCR or pasted text. */
export function parseReceiptAmount(text: string): number | null {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const totalPatterns = [
    /(?:total|amount due|balance due|grand total)[:\s]*\$?\s*([\d,]+\.\d{2})/i,
    /\$\s*([\d,]+\.\d{2})\s*$/i,
  ];

  for (const line of lines.reverse()) {
    for (const pattern of totalPatterns) {
      const match = line.match(pattern);
      if (match) {
        const value = parseFloat(match[1].replace(/,/g, ""));
        if (value > 0 && value < 50_000) return value;
      }
    }
  }

  const allAmounts = text.match(/\$?\s*([\d,]+\.\d{2})/g);
  if (!allAmounts?.length) return null;

  const parsed = allAmounts
    .map((m) => parseFloat(m.replace(/[$,\s]/g, "")))
    .filter((n) => n > 1 && n < 50_000);

  return parsed.length ? Math.max(...parsed) : null;
}

export function parseReceiptMerchant(text: string): string | null {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length > 2);
  if (!firstLine) return null;
  const cleaned = firstLine.replace(/[^a-zA-Z0-9\s&'-]/g, "").trim();
  return cleaned.length >= 3 ? cleaned.slice(0, 60) : null;
}
