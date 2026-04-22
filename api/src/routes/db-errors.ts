export function isFkViolation(err: { message?: string; code?: string } | null): boolean {
  if (!err) return false;
  const msg = err.message ?? "";
  return err.code === "23503" || msg.includes("foreign key") || msg.includes("23503");
}

export function isUniqueViolation(err: { code?: string } | null): boolean {
  return err?.code === "23505";
}

export function isNoRows(err: { code?: string } | null): boolean {
  return err?.code === "PGRST116";
}
