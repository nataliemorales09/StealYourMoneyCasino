import type { FastifyInstance } from "fastify";
import { createGameSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires game HTTP routes onto the Fastify app. */
export async function registerGameRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /games
   *
   * Optional query parameters:
   * - id: positive integer; filters to a specific game_id
   * - name: string; filters by exact name match
   *
   * Returns up to 20 rows. If no rows match, returns { data: [] }.
   */
  app.get("/games", async (request, reply) => {
    const q = request.query as { id?: string; name?: string };
    const supabase = getSupabase();

    const gameId = q.id ? parseIdParam(q.id) : null;
    if (q.id && gameId === null) {
      return reply.status(400).send({ error: "Invalid id" });
    }

    let qb = supabase.from("games").select("*").order("game_id").limit(20);
    if (gameId !== null) qb = qb.eq("game_id", gameId);
    if (q.name) qb = qb.eq("name", q.name);

    const { data, error } = await qb;
    if (error) {
      request.log.error(error, "list games failed");
      return reply.status(500).send({ error: "Database error listing games" });
    }

    return { data: data ?? [] };
  });

  /**
   * POST /games
   *
   * Body:
   * - createGameSchema (name?, price_per_play?)
   */
  app.post("/games", async (request, reply) => {
    const parsed = createGameSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("games").insert(parsed.data).select("*").single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "Game already exists" });
      }
      request.log.error(error, "create game failed");
      return reply.status(500).send({ error: "Database error creating game" });
    }

    return reply.status(201).send({ data });
  });
}
