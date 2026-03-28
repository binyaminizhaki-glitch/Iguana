-- Location foundation for GPS-aware map feed and explicit consent records.

alter table public.location_samples
  add column if not exists accuracy_m double precision,
  add column if not exists location_mode text not null default 'zone' check (location_mode in ('zone', 'precise', 'manual')),
  add column if not exists captured_at timestamptz not null default now(),
  add column if not exists expires_at timestamptz;

create index if not exists idx_location_samples_user_captured
  on public.location_samples (user_id, captured_at desc);

create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null check (consent_type in ('precise_location')),
  policy_version text not null,
  is_granted boolean not null,
  granted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_consent_events_user_time
  on public.consent_events (user_id, created_at desc);

create table if not exists public.guardian_links (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_user_id, guardian_user_id)
);

create index if not exists idx_guardian_links_student
  on public.guardian_links (student_user_id, status);

alter table public.consent_events enable row level security;
alter table public.guardian_links enable row level security;

create policy consent_events_select_self
on public.consent_events
for select
to authenticated
using (user_id = auth.uid());

create policy consent_events_insert_self
on public.consent_events
for insert
to authenticated
with check (user_id = auth.uid());

create policy guardian_links_select_participant
on public.guardian_links
for select
to authenticated
using (student_user_id = auth.uid() or guardian_user_id = auth.uid());

create policy guardian_links_insert_student
on public.guardian_links
for insert
to authenticated
with check (student_user_id = auth.uid());

drop policy if exists location_samples_select_self on public.location_samples;

create policy location_samples_select_with_privacy
on public.location_samples
for select
to authenticated
using (
  user_id = auth.uid()
  or (
    exists (
      select 1
      from public.user_settings us
      where us.user_id = location_samples.user_id
        and us.precise_location_enabled = true
    )
    and public.is_friends(auth.uid(), user_id)
  )
);
