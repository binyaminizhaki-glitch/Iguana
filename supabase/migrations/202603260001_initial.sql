-- IASA full backend schema for Supabase/Postgres.
-- Covers profiles, privacy, friendships, statuses, GPS samples, events, chat, notifications, and audit.

create extension if not exists pgcrypto;

create type visibility_scope as enum ('friends', 'grade', 'all');
create type friend_request_status as enum ('pending', 'accepted', 'rejected');
create type event_kind as enum ('study', 'event');
create type notification_kind as enum ('friend_request', 'message', 'event_reminder', 'system');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  grade text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  precise_location_enabled boolean not null default false,
  default_visibility visibility_scope not null default 'friends',
  notification_digest text not null default 'live' check (notification_digest in ('live', 'hourly', 'daily')),
  sound_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint friendships_no_self check (user_a <> user_b)
);
create unique index if not exists idx_friendships_pair_unique
  on public.friendships (least(user_a, user_b), greatest(user_a, user_b));

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id uuid not null references public.profiles(id) on delete cascade,
  status friend_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friend_requests_no_self check (from_user_id <> to_user_id)
);
create index if not exists idx_friend_requests_target_status on public.friend_requests (to_user_id, status, created_at desc);

create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_user_id uuid not null references public.profiles(id) on delete cascade,
  blocked_user_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  constraint blocks_no_self check (blocker_user_id <> blocked_user_id),
  constraint blocks_unique_pair unique (blocker_user_id, blocked_user_id)
);

create table if not exists public.campus_zones (
  id text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_active boolean not null default true,
  visibility visibility_scope not null,
  location_label text not null,
  note text not null default '',
  zone_id text references public.campus_zones(id) on delete set null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists idx_statuses_active on public.statuses (is_active, updated_at desc);
create index if not exists idx_statuses_user on public.statuses (user_id, is_active);

create table if not exists public.location_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  latitude double precision,
  longitude double precision,
  zone_id text references public.campus_zones(id) on delete set null,
  source text not null default 'app' check (source in ('app', 'gps', 'manual')),
  created_at timestamptz not null default now()
);
create index if not exists idx_location_samples_user_time on public.location_samples (user_id, created_at desc);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  kind event_kind not null,
  title text not null,
  subject text not null,
  location text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  max_participants integer not null check (max_participants > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_events_search on public.events (starts_at, subject, location);

create table if not exists public.event_participants (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_conversation_time on public.messages (conversation_id, created_at desc);

create table if not exists public.message_reads (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind notification_kind not null,
  title text not null,
  body text not null,
  payload jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user_time on public.notifications (user_id, created_at desc);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  messages_enabled boolean not null default true,
  friend_requests_enabled boolean not null default true,
  events_enabled boolean not null default true,
  friends_outside_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_logs_actor_time on public.audit_logs (actor_user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

create trigger trg_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger trg_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create trigger trg_notification_preferences_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create or replace function public.is_friends(a uuid, b uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.friendships f
    where (f.user_a = a and f.user_b = b)
       or (f.user_a = b and f.user_b = a)
  );
$$;

create or replace function public.can_view_status(viewer uuid, owner uuid, scope visibility_scope)
returns boolean
language sql
stable
as $$
  select
    case
      when viewer = owner then true
      when scope = 'all' then true
      when scope = 'grade' then exists (
        select 1
        from public.profiles vp
        join public.profiles op on op.id = owner
        where vp.id = viewer and vp.grade = op.grade
      )
      else public.is_friends(viewer, owner)
    end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, grade)
  values (
    new.id,
    coalesce(new.email, concat(new.id::text, '@unknown.local')),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'New User'),
    coalesce(new.raw_user_meta_data ->> 'grade', 'unknown')
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger trg_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
