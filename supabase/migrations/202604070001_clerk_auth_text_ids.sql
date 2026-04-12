-- Adapt auth + RLS for Clerk string user IDs.
-- Clerk uses string subjects (for example: user_2abc...), so auth.jwt()->>'sub'
-- must become the source of truth instead of auth.uid().

drop trigger if exists trg_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop policy if exists profiles_select_authenticated on public.profiles;
drop policy if exists profiles_update_self on public.profiles;
drop policy if exists user_settings_select_self on public.user_settings;
drop policy if exists user_settings_upsert_self on public.user_settings;
drop policy if exists friendships_select_participant on public.friendships;
drop policy if exists friendships_insert_participant on public.friendships;
drop policy if exists friendships_delete_participant on public.friendships;
drop policy if exists friend_requests_select_participant on public.friend_requests;
drop policy if exists friend_requests_insert_sender on public.friend_requests;
drop policy if exists friend_requests_update_target_or_sender on public.friend_requests;
drop policy if exists blocks_select_owner on public.blocks;
drop policy if exists blocks_manage_owner on public.blocks;
drop policy if exists statuses_select_with_visibility on public.statuses;
drop policy if exists statuses_manage_self on public.statuses;
drop policy if exists location_samples_select_self on public.location_samples;
drop policy if exists location_samples_insert_self on public.location_samples;
drop policy if exists events_select_authenticated on public.events;
drop policy if exists events_insert_creator on public.events;
drop policy if exists events_update_creator on public.events;
drop policy if exists events_delete_creator on public.events;
drop policy if exists event_participants_select_authenticated on public.event_participants;
drop policy if exists event_participants_insert_self on public.event_participants;
drop policy if exists event_participants_delete_self on public.event_participants;
drop policy if exists conversations_select_member on public.conversations;
drop policy if exists conversations_insert_creator on public.conversations;
drop policy if exists conversation_participants_select_member on public.conversation_participants;
drop policy if exists conversation_participants_insert_member on public.conversation_participants;
drop policy if exists messages_select_member on public.messages;
drop policy if exists messages_insert_sender_member on public.messages;
drop policy if exists message_reads_select_self on public.message_reads;
drop policy if exists message_reads_insert_self on public.message_reads;
drop policy if exists notifications_select_self on public.notifications;
drop policy if exists notifications_update_self on public.notifications;
drop policy if exists notification_preferences_manage_self on public.notification_preferences;
drop policy if exists audit_logs_select_self on public.audit_logs;
drop policy if exists consent_events_select_self on public.consent_events;
drop policy if exists consent_events_insert_self on public.consent_events;
drop policy if exists guardian_links_select_participant on public.guardian_links;
drop policy if exists guardian_links_insert_student on public.guardian_links;

alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.user_settings drop constraint if exists user_settings_user_id_fkey;
alter table public.friendships drop constraint if exists friendships_user_a_fkey;
alter table public.friendships drop constraint if exists friendships_user_b_fkey;
alter table public.friend_requests drop constraint if exists friend_requests_from_user_id_fkey;
alter table public.friend_requests drop constraint if exists friend_requests_to_user_id_fkey;
alter table public.blocks drop constraint if exists blocks_blocker_user_id_fkey;
alter table public.blocks drop constraint if exists blocks_blocked_user_id_fkey;
alter table public.statuses drop constraint if exists statuses_user_id_fkey;
alter table public.location_samples drop constraint if exists location_samples_user_id_fkey;
alter table public.events drop constraint if exists events_creator_id_fkey;
alter table public.event_participants drop constraint if exists event_participants_user_id_fkey;
alter table public.conversations drop constraint if exists conversations_created_by_fkey;
alter table public.conversation_participants drop constraint if exists conversation_participants_user_id_fkey;
alter table public.messages drop constraint if exists messages_sender_id_fkey;
alter table public.message_reads drop constraint if exists message_reads_user_id_fkey;
alter table public.notifications drop constraint if exists notifications_user_id_fkey;
alter table public.notification_preferences drop constraint if exists notification_preferences_user_id_fkey;
alter table public.audit_logs drop constraint if exists audit_logs_actor_user_id_fkey;
alter table public.consent_events drop constraint if exists consent_events_user_id_fkey;
alter table public.guardian_links drop constraint if exists guardian_links_student_user_id_fkey;
alter table public.guardian_links drop constraint if exists guardian_links_guardian_user_id_fkey;

drop function if exists public.is_friends(uuid, uuid);
drop function if exists public.can_view_status(uuid, uuid, visibility_scope);

alter table public.profiles
  alter column id type text using id::text;

alter table public.user_settings
  alter column user_id type text using user_id::text;

alter table public.friendships
  alter column user_a type text using user_a::text,
  alter column user_b type text using user_b::text;

alter table public.friend_requests
  alter column from_user_id type text using from_user_id::text,
  alter column to_user_id type text using to_user_id::text;

alter table public.blocks
  alter column blocker_user_id type text using blocker_user_id::text,
  alter column blocked_user_id type text using blocked_user_id::text;

alter table public.statuses
  alter column user_id type text using user_id::text;

alter table public.location_samples
  alter column user_id type text using user_id::text;

alter table public.events
  alter column creator_id type text using creator_id::text;

alter table public.event_participants
  alter column user_id type text using user_id::text;

alter table public.conversations
  alter column created_by type text using created_by::text;

alter table public.conversation_participants
  alter column user_id type text using user_id::text;

alter table public.messages
  alter column sender_id type text using sender_id::text;

alter table public.message_reads
  alter column user_id type text using user_id::text;

alter table public.notifications
  alter column user_id type text using user_id::text;

alter table public.notification_preferences
  alter column user_id type text using user_id::text;

alter table public.audit_logs
  alter column actor_user_id type text using actor_user_id::text;

alter table public.consent_events
  alter column user_id type text using user_id::text;

alter table public.guardian_links
  alter column student_user_id type text using student_user_id::text,
  alter column guardian_user_id type text using guardian_user_id::text;

alter table public.user_settings
  add constraint user_settings_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.friendships
  add constraint friendships_user_a_fkey
    foreign key (user_a) references public.profiles(id) on delete cascade,
  add constraint friendships_user_b_fkey
    foreign key (user_b) references public.profiles(id) on delete cascade;

alter table public.friend_requests
  add constraint friend_requests_from_user_id_fkey
    foreign key (from_user_id) references public.profiles(id) on delete cascade,
  add constraint friend_requests_to_user_id_fkey
    foreign key (to_user_id) references public.profiles(id) on delete cascade;

alter table public.blocks
  add constraint blocks_blocker_user_id_fkey
    foreign key (blocker_user_id) references public.profiles(id) on delete cascade,
  add constraint blocks_blocked_user_id_fkey
    foreign key (blocked_user_id) references public.profiles(id) on delete cascade;

alter table public.statuses
  add constraint statuses_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.location_samples
  add constraint location_samples_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.events
  add constraint events_creator_id_fkey
    foreign key (creator_id) references public.profiles(id) on delete cascade;

alter table public.event_participants
  add constraint event_participants_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.conversations
  add constraint conversations_created_by_fkey
    foreign key (created_by) references public.profiles(id) on delete cascade;

alter table public.conversation_participants
  add constraint conversation_participants_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.messages
  add constraint messages_sender_id_fkey
    foreign key (sender_id) references public.profiles(id) on delete cascade;

alter table public.message_reads
  add constraint message_reads_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.notifications
  add constraint notifications_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.notification_preferences
  add constraint notification_preferences_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.audit_logs
  add constraint audit_logs_actor_user_id_fkey
    foreign key (actor_user_id) references public.profiles(id) on delete set null;

alter table public.consent_events
  add constraint consent_events_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.guardian_links
  add constraint guardian_links_student_user_id_fkey
    foreign key (student_user_id) references public.profiles(id) on delete cascade,
  add constraint guardian_links_guardian_user_id_fkey
    foreign key (guardian_user_id) references public.profiles(id) on delete cascade;

create or replace function public.is_friends(a text, b text)
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

create or replace function public.can_view_status(viewer text, owner text, scope visibility_scope)
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

create policy profiles_select_authenticated
on public.profiles
for select
to authenticated
using (true);

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = auth.jwt()->>'sub')
with check (id = auth.jwt()->>'sub');

create policy user_settings_select_self
on public.user_settings
for select
to authenticated
using (user_id = auth.jwt()->>'sub');

create policy user_settings_upsert_self
on public.user_settings
for all
to authenticated
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');

create policy friendships_select_participant
on public.friendships
for select
to authenticated
using (user_a = auth.jwt()->>'sub' or user_b = auth.jwt()->>'sub');

create policy friendships_insert_participant
on public.friendships
for insert
to authenticated
with check (user_a = auth.jwt()->>'sub' or user_b = auth.jwt()->>'sub');

create policy friendships_delete_participant
on public.friendships
for delete
to authenticated
using (user_a = auth.jwt()->>'sub' or user_b = auth.jwt()->>'sub');

create policy friend_requests_select_participant
on public.friend_requests
for select
to authenticated
using (from_user_id = auth.jwt()->>'sub' or to_user_id = auth.jwt()->>'sub');

create policy friend_requests_insert_sender
on public.friend_requests
for insert
to authenticated
with check (from_user_id = auth.jwt()->>'sub');

create policy friend_requests_update_target_or_sender
on public.friend_requests
for update
to authenticated
using (from_user_id = auth.jwt()->>'sub' or to_user_id = auth.jwt()->>'sub')
with check (from_user_id = auth.jwt()->>'sub' or to_user_id = auth.jwt()->>'sub');

create policy blocks_select_owner
on public.blocks
for select
to authenticated
using (blocker_user_id = auth.jwt()->>'sub');

create policy blocks_manage_owner
on public.blocks
for all
to authenticated
using (blocker_user_id = auth.jwt()->>'sub')
with check (blocker_user_id = auth.jwt()->>'sub');

create policy statuses_select_with_visibility
on public.statuses
for select
to authenticated
using (public.can_view_status(auth.jwt()->>'sub', user_id, visibility));

create policy statuses_manage_self
on public.statuses
for all
to authenticated
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');

create policy location_samples_select_self
on public.location_samples
for select
to authenticated
using (user_id = auth.jwt()->>'sub');

create policy location_samples_insert_self
on public.location_samples
for insert
to authenticated
with check (user_id = auth.jwt()->>'sub');

create policy events_select_authenticated
on public.events
for select
to authenticated
using (true);

create policy events_insert_creator
on public.events
for insert
to authenticated
with check (creator_id = auth.jwt()->>'sub');

create policy events_update_creator
on public.events
for update
to authenticated
using (creator_id = auth.jwt()->>'sub')
with check (creator_id = auth.jwt()->>'sub');

create policy events_delete_creator
on public.events
for delete
to authenticated
using (creator_id = auth.jwt()->>'sub');

create policy event_participants_select_authenticated
on public.event_participants
for select
to authenticated
using (true);

create policy event_participants_insert_self
on public.event_participants
for insert
to authenticated
with check (user_id = auth.jwt()->>'sub');

create policy event_participants_delete_self
on public.event_participants
for delete
to authenticated
using (user_id = auth.jwt()->>'sub');

create policy conversations_select_member
on public.conversations
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.jwt()->>'sub'
  )
);

create policy conversations_insert_creator
on public.conversations
for insert
to authenticated
with check (created_by = auth.jwt()->>'sub');

create policy conversation_participants_select_member
on public.conversation_participants
for select
to authenticated
using (
  user_id = auth.jwt()->>'sub'
  or exists (
    select 1
    from public.conversation_participants cp2
    where cp2.conversation_id = conversation_participants.conversation_id
      and cp2.user_id = auth.jwt()->>'sub'
  )
);

create policy conversation_participants_insert_member
on public.conversation_participants
for insert
to authenticated
with check (user_id = auth.jwt()->>'sub');

create policy messages_select_member
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.jwt()->>'sub'
  )
);

create policy messages_insert_sender_member
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.jwt()->>'sub'
  and exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.jwt()->>'sub'
  )
);

create policy message_reads_select_self
on public.message_reads
for select
to authenticated
using (user_id = auth.jwt()->>'sub');

create policy message_reads_insert_self
on public.message_reads
for insert
to authenticated
with check (user_id = auth.jwt()->>'sub');

create policy notifications_select_self
on public.notifications
for select
to authenticated
using (user_id = auth.jwt()->>'sub');

create policy notifications_update_self
on public.notifications
for update
to authenticated
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');

create policy notification_preferences_manage_self
on public.notification_preferences
for all
to authenticated
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');

create policy audit_logs_select_self
on public.audit_logs
for select
to authenticated
using (actor_user_id = auth.jwt()->>'sub');

create policy consent_events_select_self
on public.consent_events
for select
to authenticated
using (user_id = auth.jwt()->>'sub');

create policy consent_events_insert_self
on public.consent_events
for insert
to authenticated
with check (user_id = auth.jwt()->>'sub');

create policy guardian_links_select_participant
on public.guardian_links
for select
to authenticated
using (student_user_id = auth.jwt()->>'sub' or guardian_user_id = auth.jwt()->>'sub');

create policy guardian_links_insert_student
on public.guardian_links
for insert
to authenticated
with check (student_user_id = auth.jwt()->>'sub');
