import type { FastifyInstance } from "fastify";
import { createCustomerSchema, createEmployeeSchema, createPersonSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isFkViolation, isNoRows, isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

function parseNumberParam(raw: string | undefined): number | null {
  if (raw === undefined || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Wires person/employee/customer HTTP routes onto the Fastify app. */
export async function registerPeopleRoutes(app: FastifyInstance): Promise<void> {
  // Note: register /person/employee and /person/customer BEFORE /person/:id
  // so the dynamic :id route doesn't shadow them.

  /**
   * GET /person/employee
   *
   * Optional query parameters:
   * - id: positive integer; filters to a specific employee (overlaps /person/:id intent)
   * - branch: positive integer; filters employees who work at a branch (via works_at.branch_id)
   * - position: string; filters by exact position match
   *
   * Returns up to 20 rows. If no rows match, returns { data: [] }.
   */
  app.get("/person/employee", async (request, reply) => {
    const q = request.query as { id?: string; branch?: string; position?: string };
    const supabase = getSupabase();

    const employeeId = q.id ? parseIdParam(q.id) : null;
    if (q.id && employeeId === null) {
      return reply.status(400).send({ error: "Invalid id" });
    }

    const branchId = q.branch ? parseIdParam(q.branch) : null;
    if (q.branch && branchId === null) {
      return reply.status(400).send({ error: "Invalid branch" });
    }

    const select = branchId
      ? "employee_id, position, persons(*), works_at!inner(branch_id, since, to)"
      : "employee_id, position, persons(*), works_at(branch_id, since, to)";

    let qb = supabase.from("employees").select(select).limit(20);

    if (employeeId !== null) qb = qb.eq("employee_id", employeeId);
    if (q.position) qb = qb.eq("position", q.position);
    if (branchId !== null) qb = qb.eq("works_at.branch_id", branchId);

    const { data, error } = await qb;

    if (error) {
      request.log.error(error, "list employees failed");
      return reply.status(500).send({ error: "Database error listing employees" });
    }

    return { data: data ?? [] };
  });

  /**
   * GET /person/customer
   *
   * Optional query parameters:
   * - id: positive integer; filters to a specific customer (overlaps /person/:id intent)
   * - min_credit: number; inclusive lower bound for credit
   * - max_credit: number; inclusive upper bound for credit
   *
   * Returns up to 20 rows. If no rows match, returns { data: [] }.
   */
  app.get("/person/customer", async (request, reply) => {
    const q = request.query as { id?: string; min_credit?: string; max_credit?: string };
    const supabase = getSupabase();

    const customerId = q.id ? parseIdParam(q.id) : null;
    if (q.id && customerId === null) {
      return reply.status(400).send({ error: "Invalid id" });
    }

    const minCredit = parseNumberParam(q.min_credit);
    if (q.min_credit !== undefined && minCredit === null) {
      return reply.status(400).send({ error: "Invalid min_credit" });
    }

    const maxCredit = parseNumberParam(q.max_credit);
    if (q.max_credit !== undefined && maxCredit === null) {
      return reply.status(400).send({ error: "Invalid max_credit" });
    }

    let qb = supabase.from("customers").select("customer_id, credit, persons(*)").limit(20);

    if (customerId !== null) qb = qb.eq("customer_id", customerId);
    if (minCredit !== null) qb = qb.gte("credit", minCredit);
    if (maxCredit !== null) qb = qb.lte("credit", maxCredit);

    const { data, error } = await qb;

    if (error) {
      request.log.error(error, "list customers failed");
      return reply.status(500).send({ error: "Database error listing customers" });
    }

    return { data: data ?? [] };
  });

  /**
   * GET /person/:id
   *
   * Path parameters:
   * - id: positive integer person_id
   */
  app.get<{ Params: { id: string } }>("/person/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid person id" });

    const supabase = getSupabase();

    const { data, error } = await supabase.from("persons").select("*").eq("person_id", id).single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Person not found" });
      request.log.error(error, "get person failed");
      return reply.status(500).send({ error: "Database error loading person" });
    }

    return { data };
  });

  /**
   * POST /person
   *
   * Body:
   * - createPersonSchema (name_first?, name_last?, email?)
   */
  app.post("/person", async (request, reply) => {
    const parsed = createPersonSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("persons").insert(parsed.data).select("*").single();

    if (error) {
      request.log.error(error, "create person failed");
      return reply.status(500).send({ error: "Database error creating person" });
    }

    return reply.status(201).send({ data });
  });

  /**
   * POST /person/employee
   *
   * Body:
   * - createEmployeeSchema (employee_id, position?)
   *
   * Notes:
   * - employee_id must reference an existing person (employees.employee_id -> persons.person_id)
   */
  app.post("/person/employee", async (request, reply) => {
    const parsed = createEmployeeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("employees").insert(parsed.data).select("*").single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "Employee already exists" });
      }
      if (isFkViolation(error)) {
        return reply.status(400).send({ error: "Person not found" });
      }
      request.log.error(error, "create employee failed");
      return reply.status(500).send({ error: "Database error creating employee" });
    }

    return reply.status(201).send({ data });
  });

  /**
   * POST /person/customer
   *
   * Body:
   * - createCustomerSchema (customer_id, credit)
   *
   * Notes:
   * - customer_id must reference an existing person (customers.customer_id -> persons.person_id)
   */
  app.post("/person/customer", async (request, reply) => {
    const parsed = createCustomerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("customers").insert(parsed.data).select("*").single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "Customer already exists" });
      }
      if (isFkViolation(error)) {
        return reply.status(400).send({ error: "Person not found" });
      }
      request.log.error(error, "create customer failed");
      return reply.status(500).send({ error: "Database error creating customer" });
    }

    return reply.status(201).send({ data });
  });
}
