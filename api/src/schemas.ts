import { z } from "zod";

export const createBranchSchema = z.object({
  city: z.string().max(200).optional().nullable(),
  state: z.string().max(200).optional().nullable(),
});
export type CreateBranchInput = z.infer<typeof createBranchSchema>;

export const createPersonSchema = z.object({
  name_first: z.string().max(200).optional().nullable(),
  name_last: z.string().max(200).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
});
export type CreatePersonInput = z.infer<typeof createPersonSchema>;

export const createEmployeeSchema = z.object({
  employee_id: z.coerce.number().int().positive(),
  position: z.string().max(200).optional().nullable(),
});
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const createCustomerSchema = z.object({
  customer_id: z.coerce.number().int().positive(),
  credit: z.coerce.number(),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const createGameSchema = z.object({
  name: z.string().max(200).optional().nullable(),
  price_per_play: z.coerce.number().optional().nullable(),
});
export type CreateGameInput = z.infer<typeof createGameSchema>;

export const createSpecialRoomSchema = z.object({
  type: z.string().max(200).optional().nullable(),
});
export type CreateSpecialRoomInput = z.infer<typeof createSpecialRoomSchema>;

export const createGameplaySchema = z.object({
  customer_id: z.coerce.number().int().positive(),
  game_id: z.coerce.number().int().positive(),
  time_played: z.string().min(1),
  money_won: z.coerce.number(),
});
export type CreateGameplayInput = z.infer<typeof createGameplaySchema>;

export const createCocktailSchema = z.object({
  drink_id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(200),
});
export type CreateCocktailInput = z.infer<typeof createCocktailSchema>;

export const createCocktailOfferingSchema = z.object({
  offering_id: z.coerce.number().int().positive(),
  bar_id: z.coerce.number().int().positive(),
  drink_id: z.coerce.number().int().positive(),
  price: z.coerce.number(),
});
export type CreateCocktailOfferingInput = z.infer<typeof createCocktailOfferingSchema>;

export const createCocktailPurchaseSchema = z.object({
  customer_id: z.coerce.number().int().positive(),
  offering_id: z.coerce.number().int().positive(),
  date: z.string().min(1),
});
export type CreateCocktailPurchaseInput = z.infer<typeof createCocktailPurchaseSchema>;

export const createShowSchema = z.object({
  show_id: z.coerce.number().int().positive(),
  name: z.coerce.number().optional().nullable(),
});
export type CreateShowInput = z.infer<typeof createShowSchema>;

export const createShowOfferingSchema = z.object({
  showroom_id: z.coerce.number().int().positive(),
  show_id: z.coerce.number().int().positive().optional().nullable(),
  date: z.string().optional().nullable(),
});
export type CreateShowOfferingInput = z.infer<typeof createShowOfferingSchema>;
