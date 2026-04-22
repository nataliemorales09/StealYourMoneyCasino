import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { getSupabase } from "./supabase.js";
import {
  createBranchSchema,
  createCocktailOfferingSchema,
  createCocktailPurchaseSchema,
  createCocktailSchema,
  createCustomerSchema,
  createEmployeeSchema,
  createGameSchema,
  createGameplaySchema,
  createPersonSchema,
  createShowOfferingSchema,
  createShowSchema,
  createSpecialRoomSchema,
} from "./schemas.js";
import { registerPeopleRoutes } from "./routes/people.js";
import { registerEmploymentRoutes } from "./routes/employment.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

async function main(): Promise<void> {
  const supabase = getSupabase(); // Fail fast if env is missing

  const app = Fastify({ logger: true });
  await app.register(cors, {
    origin: true,
  });
  app.get("/health", async () => ({ ok: true }));

  app.register(registerPeopleRoutes);
  app.register(registerEmploymentRoutes);

  // Branches
  app.get("/branches", async (_req, reply) => {
    const { data, error } = await supabase.from("branches").select("*").order("branch_id");
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  app.post("/branches", async (req, reply) => {
    const parsed = createBranchSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("branches").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Persons
  app.get("/persons", async (_req, reply) => {
    const { data, error } = await supabase.from("persons").select("*").order("person_id");
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  app.post("/persons", async (req, reply) => {
    const parsed = createPersonSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("persons").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Employees (requires existing person_id)
  app.post("/employees", async (req, reply) => {
    const parsed = createEmployeeSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("employees").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Customers (requires existing person_id)
  app.post("/customers", async (req, reply) => {
    const parsed = createCustomerSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("customers").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Games
  app.get("/games", async (_req, reply) => {
    const { data, error } = await supabase.from("games").select("*").order("game_id");
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  app.post("/games", async (req, reply) => {
    const parsed = createGameSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("games").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Special rooms
  app.post("/special-rooms", async (req, reply) => {
    const parsed = createSpecialRoomSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase
      .from("special_rooms")
      .insert(parsed.data)
      .select("*")
      .single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Gameplay events
  app.post("/gameplay", async (req, reply) => {
    const parsed = createGameplaySchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("gameplay").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Cocktails
  app.post("/cocktails", async (req, reply) => {
    const parsed = createCocktailSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("cocktails").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  app.post("/cocktail-offerings", async (req, reply) => {
    const parsed = createCocktailOfferingSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase
      .from("cocktail_offerings")
      .insert(parsed.data)
      .select("*")
      .single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  app.post("/cocktail-purchases", async (req, reply) => {
    const parsed = createCocktailPurchaseSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase
      .from("cocktail_purchases")
      .insert(parsed.data)
      .select("*")
      .single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  // Shows
  app.post("/shows", async (req, reply) => {
    const parsed = createShowSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase.from("shows").insert(parsed.data).select("*").single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  app.post("/show-offerings", async (req, reply) => {
    const parsed = createShowOfferingSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());
    const { data, error } = await supabase
      .from("show_offerings")
      .insert(parsed.data)
      .select("*")
      .single();
    if (error) return reply.code(500).send({ error: error.message });
    return { data };
  });

  try {
    await app.listen({ port, host });
    app.log.info(`Listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
