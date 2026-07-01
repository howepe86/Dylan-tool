-- ClientLedger initial schema

create extension if not exists "uuid-ossp";

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

-- Clients
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  company text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_user_id_idx on public.clients (user_id);

create trigger clients_updated_at
  before update on public.clients
  for each row execute function update_updated_at();

-- Client interactions (time spent)
create type public.activity_type as enum (
  'lunch',
  'dinner',
  'golf',
  'meeting',
  'call',
  'email',
  'other'
);

create type public.input_source as enum ('manual', 'calendar', 'voice');

create table public.interactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  notes text,
  activity_type public.activity_type not null default 'meeting',
  occurred_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes >= 0),
  input_source public.input_source not null default 'manual',
  calendar_event_id text,
  voice_memo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index interactions_user_id_idx on public.interactions (user_id);
create index interactions_client_id_idx on public.interactions (client_id);
create index interactions_occurred_at_idx on public.interactions (occurred_at);

create trigger interactions_updated_at
  before update on public.interactions
  for each row execute function update_updated_at();

-- Expenses tied to clients (optionally to an interaction)
create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  interaction_id uuid references public.interactions (id) on delete set null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  category text not null default 'entertainment',
  description text,
  incurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index expenses_user_id_idx on public.expenses (user_id);
create index expenses_client_id_idx on public.expenses (client_id);
create index expenses_incurred_at_idx on public.expenses (incurred_at);

create trigger expenses_updated_at
  before update on public.expenses
  for each row execute function update_updated_at();

-- Revenue / deals
create type public.deal_status as enum ('pipeline', 'closed', 'lost');

create table public.deals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  status public.deal_status not null default 'pipeline',
  closed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deals_user_id_idx on public.deals (user_id);
create index deals_client_id_idx on public.deals (client_id);
create index deals_closed_at_idx on public.deals (closed_at);

create trigger deals_updated_at
  before update on public.deals
  for each row execute function update_updated_at();

-- Calendar connections (Google, etc.)
create type public.calendar_provider as enum ('google', 'outlook');

create table public.calendar_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider public.calendar_provider not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  calendar_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create trigger calendar_connections_updated_at
  before update on public.calendar_connections
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.interactions enable row level security;
alter table public.expenses enable row level security;
alter table public.deals enable row level security;
alter table public.calendar_connections enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own interactions"
  on public.interactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own expenses"
  on public.expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own deals"
  on public.deals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own calendar connections"
  on public.calendar_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
