-- Initial PostgreSQL schema for IASA backend.
-- This schema mirrors the in-memory entities in server/store.ts.

create table if not exists users (
  id text primary key,
  email text not null unique,
  name text not null,
  grade text not null,
  avatar_url text,
  precise_location_enabled boolean not null default true,
  default_visibility text not null default 'all' check (default_visibility in ('friends', 'grade', 'all')),
  created_at timestamptz not null default now()
);

create table if not exists friendships (
  id text primary key,
  user_a text not null references users(id) on delete cascade,
  user_b text not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint friendships_unique_pair unique (user_a, user_b)
);

create table if not exists friend_requests (
  id text primary key,
  from_user_id text not null references users(id) on delete cascade,
  to_user_id text not null references users(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists user_statuses (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  is_active boolean not null default true,
  visibility text not null check (visibility in ('friends', 'grade', 'all')),
  location_label text not null,
  note text not null default '',
  zone_id text,
  starts_at timestamptz not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists idx_user_statuses_active on user_statuses (is_active, updated_at desc);
create index if not exists idx_user_statuses_user on user_statuses (user_id, is_active);

create table if not exists events (
  id text primary key,
  type text not null check (type in ('study', 'event')),
  title text not null,
  subject text not null,
  location text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  creator_id text not null references users(id) on delete cascade,
  max_participants int not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_events_filters on events (starts_at, subject, location);

create table if not exists event_participants (
  event_id text not null references events(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists conversations (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversation_participants (
  conversation_id text not null references conversations(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists messages (
  id text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  sender_id text not null references users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_conv_created on messages (conversation_id, created_at desc);

create table if not exists notifications (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  type text not null check (type in ('friend_request', 'message', 'event_reminder', 'system')),
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user_created on notifications (user_id, created_at desc);
