-- Row-Level Security policies for IASA schema.

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_requests enable row level security;
alter table public.blocks enable row level security;
alter table public.statuses enable row level security;
alter table public.location_samples enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.message_reads enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES
create policy profiles_select_authenticated
on public.profiles
for select
to authenticated
using (true);

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- USER SETTINGS
create policy user_settings_select_self
on public.user_settings
for select
to authenticated
using (user_id = auth.uid());

create policy user_settings_upsert_self
on public.user_settings
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- FRIENDSHIPS
create policy friendships_select_participant
on public.friendships
for select
to authenticated
using (user_a = auth.uid() or user_b = auth.uid());

create policy friendships_insert_participant
on public.friendships
for insert
to authenticated
with check (user_a = auth.uid() or user_b = auth.uid());

create policy friendships_delete_participant
on public.friendships
for delete
to authenticated
using (user_a = auth.uid() or user_b = auth.uid());

-- FRIEND REQUESTS
create policy friend_requests_select_participant
on public.friend_requests
for select
to authenticated
using (from_user_id = auth.uid() or to_user_id = auth.uid());

create policy friend_requests_insert_sender
on public.friend_requests
for insert
to authenticated
with check (from_user_id = auth.uid());

create policy friend_requests_update_target_or_sender
on public.friend_requests
for update
to authenticated
using (from_user_id = auth.uid() or to_user_id = auth.uid())
with check (from_user_id = auth.uid() or to_user_id = auth.uid());

-- BLOCKS
create policy blocks_select_owner
on public.blocks
for select
to authenticated
using (blocker_user_id = auth.uid());

create policy blocks_manage_owner
on public.blocks
for all
to authenticated
using (blocker_user_id = auth.uid())
with check (blocker_user_id = auth.uid());

-- STATUSES
create policy statuses_select_with_visibility
on public.statuses
for select
to authenticated
using (public.can_view_status(auth.uid(), user_id, visibility));

create policy statuses_manage_self
on public.statuses
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- LOCATION SAMPLES
create policy location_samples_select_self
on public.location_samples
for select
to authenticated
using (user_id = auth.uid());

create policy location_samples_insert_self
on public.location_samples
for insert
to authenticated
with check (user_id = auth.uid());

-- EVENTS
create policy events_select_authenticated
on public.events
for select
to authenticated
using (true);

create policy events_insert_creator
on public.events
for insert
to authenticated
with check (creator_id = auth.uid());

create policy events_update_creator
on public.events
for update
to authenticated
using (creator_id = auth.uid())
with check (creator_id = auth.uid());

create policy events_delete_creator
on public.events
for delete
to authenticated
using (creator_id = auth.uid());

-- EVENT PARTICIPANTS
create policy event_participants_select_authenticated
on public.event_participants
for select
to authenticated
using (true);

create policy event_participants_insert_self
on public.event_participants
for insert
to authenticated
with check (user_id = auth.uid());

create policy event_participants_delete_self
on public.event_participants
for delete
to authenticated
using (user_id = auth.uid());

-- CONVERSATIONS
create policy conversations_select_member
on public.conversations
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.uid()
  )
);

create policy conversations_insert_creator
on public.conversations
for insert
to authenticated
with check (created_by = auth.uid());

-- CONVERSATION PARTICIPANTS
create policy conversation_participants_select_member
on public.conversation_participants
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.conversation_participants cp2
    where cp2.conversation_id = conversation_participants.conversation_id
      and cp2.user_id = auth.uid()
  )
);

create policy conversation_participants_insert_member
on public.conversation_participants
for insert
to authenticated
with check (user_id = auth.uid());

-- MESSAGES
create policy messages_select_member
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

create policy messages_insert_sender_member
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

-- MESSAGE READS
create policy message_reads_select_self
on public.message_reads
for select
to authenticated
using (user_id = auth.uid());

create policy message_reads_insert_self
on public.message_reads
for insert
to authenticated
with check (user_id = auth.uid());

-- NOTIFICATIONS
create policy notifications_select_self
on public.notifications
for select
to authenticated
using (user_id = auth.uid());

create policy notifications_update_self
on public.notifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- NOTIFICATION PREFERENCES
create policy notification_preferences_manage_self
on public.notification_preferences
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- AUDIT LOGS (user can read their own actions only)
create policy audit_logs_select_self
on public.audit_logs
for select
to authenticated
using (actor_user_id = auth.uid());
