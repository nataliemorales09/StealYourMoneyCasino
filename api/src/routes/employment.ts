import type { FastifyInstance } from "fastify";
import { getSupabase } from "../supabase.js";
import { parseIdParam } from "./params.js";

function parseTimeParam(raw: string | undefined): string | null {
  if (raw === undefined || raw === "") return null;
  // We keep this permissive because DB columns are strings (see works_at.since/to).
  // Typical values should be ISO-8601 strings.
  return raw;
}

/** Wires employment HTTP routes onto the Fastify app. */
export async function registerEmploymentRoutes(app: FastifyInstance): Promise<void> {
  // Register /employment/management BEFORE /employment to avoid any ambiguity.

  /**
   * GET /employment/management
   *
   * Optional query parameters:
   * - id: positive integer; filters to a specific employee_id
   * - branch: positive integer; filters to a specific branch_id
   * - from: time string; filters to employees whose works_at.since is <= from (working since then or earlier)
   * - to: time string OR "now"
   *   - if "now": selects current employment rows (works_at.to is null)
   *   - otherwise: selects employees who worked through the given time:
   *     (works_at.to is null OR works_at.to >= to)
   *
   * Returns up to 20 rows. If no rows match, returns { data: [] }.
   */
  app.get("/employment/management", async (request, reply) => {
    const q = request.query as { id?: string; branch?: string; from?: string; to?: string };
    const supabase = getSupabase();

    const employeeId = q.id ? parseIdParam(q.id) : null;
    if (q.id && employeeId === null) return reply.status(400).send({ error: "Invalid id" });

    const branchId = q.branch ? parseIdParam(q.branch) : null;
    if (q.branch && branchId === null) return reply.status(400).send({ error: "Invalid branch" });

    const from = parseTimeParam(q.from);
    const toRaw = q.to;
    const to = toRaw && toRaw !== "now" ? parseTimeParam(toRaw) : null;
    if (toRaw !== undefined && toRaw !== "" && toRaw !== "now" && to === null) {
      return reply.status(400).send({ error: "Invalid to" });
    }

    // We join:
    // - management!inner to ensure the employee manages a branch
    // - works_at to enable time-window filtering
    // - persons for identity fields
    //
    // If filtering by branch, use management!inner so the branch filter applies at join time.
    const select =
      "employee_id, position, persons(*), management!inner(branch_id), works_at(branch_id, since, to)";

    let qb = supabase.from("employees").select(select).limit(20);

    if (employeeId !== null) qb = qb.eq("employee_id", employeeId);
    if (branchId !== null) qb = qb.eq("management.branch_id", branchId);

    // Time filters apply to works_at rows. Since works_at is a nested relation, PostgREST-style
    // filtering uses dotted paths.
    if (from !== null) qb = qb.lte("works_at.since", from);

    if (toRaw === "now") {
      qb = qb.is("works_at.to", null);
    } else if (to !== null) {
      qb = qb.or(`works_at.to.is.null,works_at.to.gte.${to}`);
    }

    const { data, error } = await qb;
    if (error) {
      request.log.error(error, "list management employment failed");
      return reply.status(500).send({ error: "Database error listing management employment" });
    }

    return { data: data ?? [] };
  });

  /**
   * GET /employment
   *
   * Optional query parameters:
   * - id: positive integer; filters to a specific employee_id
   * - branch: positive integer; filters employees who work at a branch (via works_at.branch_id)
   * - position: string; filters by exact position match
   * - from: time string; filters to employees whose works_at.since is <= from (working since then or earlier)
   * - to: time string OR "now"
   *   - if "now": selects current employment rows (works_at.to is null)
   *   - otherwise: selects employees who worked through the given time:
   *     (works_at.to is null OR works_at.to >= to)
   *
   * Returns up to 20 rows. If no rows match, returns { data: [] }.
   */
  app.get("/employment", async (request, reply) => {
    const q = request.query as { id?: string; branch?: string; position?: string; from?: string; to?: string };
    const supabase = getSupabase();

    const employeeId = q.id ? parseIdParam(q.id) : null;
    if (q.id && employeeId === null) {
      return reply.status(400).send({ error: "Invalid id" });
    }

    const branchId = q.branch ? parseIdParam(q.branch) : null;
    if (q.branch && branchId === null) {
      return reply.status(400).send({ error: "Invalid branch" });
    }

    const from = parseTimeParam(q.from);
    const toRaw = q.to;
    const to = toRaw && toRaw !== "now" ? parseTimeParam(toRaw) : null;
    if (toRaw !== undefined && toRaw !== "" && toRaw !== "now" && to === null) {
      return reply.status(400).send({ error: "Invalid to" });
    }

    const select = branchId
      ? "employee_id, position, persons(*), works_at!inner(branch_id, since, to)"
      : "employee_id, position, persons(*), works_at(branch_id, since, to)";

    let qb = supabase.from("employees").select(select).limit(20);

    if (employeeId !== null) qb = qb.eq("employee_id", employeeId);
    if (q.position) qb = qb.eq("position", q.position);
    if (branchId !== null) qb = qb.eq("works_at.branch_id", branchId);
    if (from !== null) qb = qb.lte("works_at.since", from);

    if (toRaw === "now") {
      qb = qb.is("works_at.to", null);
    } else if (to !== null) {
      qb = qb.or(`works_at.to.is.null,works_at.to.gte.${to}`);
    }

    const { data, error } = await qb;

    if (error) {
      request.log.error(error, "list employment failed");
      return reply.status(500).send({ error: "Database error listing employment" });
    }

    return { data: data ?? [] };
  });
}
