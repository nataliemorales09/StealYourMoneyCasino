/** Parses a positive integer path/query id; returns null if invalid. */
export function parseIdParam(raw: string | undefined): number | null {
  if (raw === undefined || raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}
