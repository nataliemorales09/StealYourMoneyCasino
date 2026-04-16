begin;

-- Schema generated from docs/chartdb.dbml
-- Target: PostgreSQL (Supabase)

create table if not exists public.branches (
  branch_id bigint generated always as identity primary key,
  city text,
  state text
);

create table if not exists public.persons (
  person_id bigint generated always as identity primary key,
  name_first text,
  name_last text,
  email text
);

create table if not exists public.employees (
  employee_id bigint primary key references public.persons(person_id) on delete cascade,
  position text
);

create table if not exists public.games (
  game_id bigint generated always as identity primary key,
  name text,
  price_per_play double precision
);

create table if not exists public.customers (
  customer_id bigint primary key references public.persons(person_id) on delete cascade,
  credit double precision not null
);

create table if not exists public.special_rooms (
  room_id bigint generated always as identity primary key,
  type text
);

-- Join tables
create table if not exists public.games_at_branches (
  game_id bigint not null references public.games(game_id) on delete cascade,
  branch_id bigint not null references public.branches(branch_id) on delete cascade,
  primary key (game_id, branch_id)
);

create index if not exists games_at_branches_branch_id_idx on public.games_at_branches(branch_id);

create table if not exists public.rooms_at_branches (
  room_id bigint not null references public.special_rooms(room_id) on delete cascade,
  branch_id bigint not null references public.branches(branch_id) on delete cascade,
  primary key (room_id, branch_id)
);

create index if not exists rooms_at_branches_branch_id_idx on public.rooms_at_branches(branch_id);

-- Employment relationships
create table if not exists public.works_at (
  employee_id bigint not null references public.employees(employee_id) on delete cascade,
  branch_id bigint not null references public.branches(branch_id) on delete cascade,
  since date not null,
  "to" date,
  primary key (employee_id, branch_id, since)
);

create index if not exists works_at_branch_id_idx on public.works_at(branch_id);

-- Management assignment (one manager per row; enforce at most one manager per branch + per employee)
create table if not exists public.management (
  employee_id bigint not null unique references public.employees(employee_id) on delete cascade,
  branch_id bigint not null unique references public.branches(branch_id) on delete cascade
);

-- Gameplay events (allow multiple plays over time)
create table if not exists public.gameplay (
  customer_id bigint not null references public.customers(customer_id) on delete cascade,
  game_id bigint not null references public.games(game_id) on delete cascade,
  time_played timestamptz not null,
  money_won double precision not null,
  primary key (customer_id, game_id, time_played)
);

create index if not exists gameplay_game_id_idx on public.gameplay(game_id);

-- Cocktails
create table if not exists public.cocktails (
  drink_id bigint primary key,
  name text not null
);

create table if not exists public.cocktail_offerings (
  offering_id bigint primary key,
  bar_id bigint not null references public.special_rooms(room_id) on delete cascade,
  drink_id bigint not null references public.cocktails(drink_id) on delete restrict,
  price double precision not null,
  unique (bar_id, drink_id)
);

create index if not exists cocktail_offerings_drink_id_idx on public.cocktail_offerings(drink_id);

create table if not exists public.cocktail_purchases (
  customer_id bigint not null references public.customers(customer_id) on delete cascade,
  offering_id bigint not null references public.cocktail_offerings(offering_id) on delete restrict,
  date timestamptz not null,
  primary key (customer_id, offering_id, date)
);

create index if not exists cocktail_purchases_offering_id_idx on public.cocktail_purchases(offering_id);

-- Shows
create table if not exists public.shows (
  show_id bigint primary key,
  name bigint
);

create table if not exists public.show_offerings (
  showroom_id bigint not null references public.special_rooms(room_id) on delete cascade,
  show_id bigint references public.shows(show_id) on delete set null,
  date timestamptz,
  primary key (showroom_id, show_id, date)
);

create index if not exists show_offerings_show_id_idx on public.show_offerings(show_id);

commit;

