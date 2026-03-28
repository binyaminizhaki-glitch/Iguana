import * as Types from './types.js';
import { getSupabaseUserClient, isSupabaseRlsConfigured } from './db/supabase.js';
import { db } from './store.js';

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  grade: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type UserSettingsRow = {
  user_id: string;
  precise_location_enabled: boolean;
  default_visibility: Types.VisibilityScope;
};

function toUser(profile: ProfileRow, settings?: UserSettingsRow): Types.User {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    grade: profile.grade,
    avatar_url: profile.avatar_url ?? undefined,
    precise_location_enabled: settings?.precise_location_enabled ?? true,
    default_visibility: settings?.default_visibility ?? 'all',
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}

async function getUsersWithSettings(client: ReturnType<typeof getSupabaseUserClient>, userIds: string[]): Promise<Types.User[]> {
  if (userIds.length === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('id, email, full_name, grade, avatar_url, created_at, updated_at')
    .in('id', userIds);

  if (profilesError) {
    throw new Error(`Failed loading profiles: ${profilesError.message}`);
  }

  const { data: settings, error: settingsError } = await client
    .from('user_settings')
    .select('user_id, precise_location_enabled, default_visibility')
    .in('user_id', userIds);

  if (settingsError) {
    throw new Error(`Failed loading user settings: ${settingsError.message}`);
  }

  const settingsByUserId = new Map((settings ?? []).map((row) => [row.user_id, row as UserSettingsRow]));
  return (profiles ?? []).map((profile) => toUser(profile as ProfileRow, settingsByUserId.get(profile.id)));
}

async function areUsersFriends(client: ReturnType<typeof getSupabaseUserClient>, userA: string, userB: string): Promise<boolean> {
  const { data, error } = await client
    .from('friendships')
    .select('id')
    .or(`and(user_a.eq.${userA},user_b.eq.${userB}),and(user_a.eq.${userB},user_b.eq.${userA})`)
    .limit(1);

  if (error) {
    throw new Error(`Failed checking friendship for location visibility: ${error.message}`);
  }

  return (data ?? []).length > 0;
}

async function enrichEvents(
  client: ReturnType<typeof getSupabaseUserClient>,
  eventRows: Array<Omit<Types.EventItem, 'participant_ids'>>,
): Promise<Types.EventItem[]> {
  if (eventRows.length === 0) {
    return [];
  }

  const eventIds = eventRows.map((event) => event.id);
  const { data: participants, error } = await client
    .from('event_participants')
    .select('event_id, user_id')
    .in('event_id', eventIds);

  if (error) {
    throw new Error(`Failed loading event participants: ${error.message}`);
  }

  const participantsByEvent = new Map<string, string[]>();
  for (const row of participants ?? []) {
    const existing = participantsByEvent.get(row.event_id) ?? [];
    existing.push(row.user_id);
    participantsByEvent.set(row.event_id, existing);
  }

  return eventRows.map((event) => ({
    ...event,
    participant_ids: participantsByEvent.get(event.id) ?? [],
  }));
}

export interface IUserRepository {
  getUserById(id: string): Promise<Types.User | undefined>;
  getUserByEmail(email: string): Promise<Types.User | undefined>;
  getAllUsers(): Promise<Types.User[]>;
  createUser(user: Types.User): Promise<void>;
  updateUser(id: string, user: Partial<Types.User>): Promise<void>;
}

export interface IFriendshipRepository {
  getFriendsOf(userId: string): Promise<Types.User[]>;
  areFriends(userA: string, userB: string): Promise<boolean>;
  createFriendship(userA: string, userB: string): Promise<void>;
  getFriendRequests(userId: string): Promise<{ incoming: Types.FriendRequest[]; outgoing: Types.FriendRequest[] }>;
  createFriendRequest(fromUserId: string, toUserId: string): Promise<Types.FriendRequest>;
  acceptFriendRequest(requestId: string): Promise<Types.FriendRequest | null>;
  rejectFriendRequest(requestId: string): Promise<Types.FriendRequest | null>;
}

export interface IStatusRepository {
  getActiveStatuses(): Promise<Types.UserStatus[]>;
  getUserStatus(userId: string): Promise<Types.UserStatus | undefined>;
  createOrUpdateStatus(status: Types.UserStatus): Promise<void>;
  deactivateStatus(userId: string): Promise<Types.UserStatus | undefined>;
  activateStatus(input: {
    userId: string;
    locationLabel: string;
    note: string;
    visibility: Types.UserStatus['visibility'];
    durationMinutes?: number;
  }): Promise<{ status: Types.UserStatus; created: boolean }>;
  extendStatus(userId: string, addMinutes: number): Promise<Types.UserStatus | undefined>;
  getVisibleStatusesFor(viewerId: string): Promise<Array<{ status: Types.UserStatus; user: Types.User }>>;
}

export interface ILocationRepository {
  createSample(input: {
    userId: string;
    latitude: number;
    longitude: number;
    accuracyM?: number;
    source: Types.LocationSource;
    locationMode: Types.LocationMode;
    zoneId?: string;
  }): Promise<Types.LocationSample>;
  getLatestSampleForUser(userId: string): Promise<Types.LocationSample | undefined>;
  getVisibleLocationFeed(viewerId: string): Promise<Array<{ status: Types.UserStatus; user: Types.User; sample?: Types.LocationSample }>>;
}

export interface IConsentRepository {
  recordPreciseLocationConsent(input: {
    userId: string;
    policyVersion: string;
    isGranted: boolean;
  }): Promise<Types.ConsentEvent>;
  getLatestPreciseLocationConsent(userId: string): Promise<Types.ConsentEvent | undefined>;
}

export interface IEventRepository {
  getAllEvents(): Promise<Types.EventItem[]>;
  getEventById(id: string): Promise<Types.EventItem | undefined>;
  createEvent(event: Types.EventItem): Promise<void>;
  createEventForUser(input: {
    creatorId: string;
    kind: Types.EventItem['kind'];
    title: string;
    subject: string;
    location: string;
    startsAt: string;
    endsAt: string;
    maxParticipants?: number;
  }): Promise<Types.EventItem>;
  addEventParticipant(eventId: string, userId: string): Promise<void>;
  removeEventParticipant(eventId: string, userId: string): Promise<void>;
  joinEvent(eventId: string, userId: string): Promise<{ event?: Types.EventItem; error?: 'not_found' | 'full' }>;
  leaveEvent(eventId: string, userId: string): Promise<Types.EventItem | undefined>;
}

export interface IConversationRepository {
  getConversationsFor(userId: string): Promise<Types.Conversation[]>;
  getConversationById(id: string): Promise<Types.Conversation | undefined>;
  createConversation(createdBy: string): Promise<Types.Conversation>;
  getMessagesFor(conversationId: string): Promise<Types.Message[]>;
  addMessage(message: Types.Message): Promise<Types.Message>;
}

export interface INotificationRepository {
  getNotificationsFor(userId: string): Promise<Types.NotificationItem[]>;
  markAsRead(notificationId: string): Promise<Types.NotificationItem | undefined>;
}

export function createRepositories(accessToken: string) {
  if (!isSupabaseRlsConfigured || !accessToken) {
    return createMemoryRepositories();
  }

  const client = getSupabaseUserClient(accessToken);

  const userRepository: IUserRepository = {
    async getUserById(id) {
      const users = await getUsersWithSettings(client, [id]);
      return users[0];
    },
    async getUserByEmail(email) {
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('id, email, full_name, grade, track, avatar_url, created_at, updated_at')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        throw new Error(`Failed loading profile by email: ${profileError.message}`);
      }
      if (!profile) {
        return undefined;
      }

      const { data: settings, error: settingsError } = await client
        .from('user_settings')
        .select('user_id, precise_location_enabled, default_visibility')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (settingsError) {
        throw new Error(`Failed loading user settings by email: ${settingsError.message}`);
      }

      return toUser(profile as ProfileRow, (settings as UserSettingsRow | null) ?? undefined);
    },
    async getAllUsers() {
      const { data: profiles, error: profilesError } = await client
        .from('profiles')
        .select('id, email, full_name, grade, avatar_url, created_at, updated_at');

      if (profilesError) {
        throw new Error(`Failed loading all profiles: ${profilesError.message}`);
      }

      const userIds = (profiles ?? []).map((row) => row.id);
      const { data: settings, error: settingsError } = await client
        .from('user_settings')
        .select('user_id, precise_location_enabled, default_visibility')
        .in('user_id', userIds);

      if (settingsError) {
        throw new Error(`Failed loading all user settings: ${settingsError.message}`);
      }

      const settingsByUserId = new Map((settings ?? []).map((row) => [row.user_id, row as UserSettingsRow]));
      return (profiles ?? []).map((profile) => toUser(profile as ProfileRow, settingsByUserId.get(profile.id)));
    },
    async createUser(user) {
      const { error: profileError } = await client.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        grade: user.grade,
        avatar_url: user.avatar_url ?? null,
      });

      if (profileError) {
        throw new Error(`Failed creating profile: ${profileError.message}`);
      }

      const { error: settingsError } = await client.from('user_settings').insert({
        user_id: user.id,
        precise_location_enabled: user.precise_location_enabled,
        default_visibility: user.default_visibility,
      });

      if (settingsError) {
        throw new Error(`Failed creating user settings: ${settingsError.message}`);
      }
    },
    async updateUser(id, updates) {
      const profilePatch: Record<string, unknown> = {};
      const settingsPatch: Record<string, unknown> = {};

      if (typeof updates.email === 'string') profilePatch.email = updates.email;
      if (typeof updates.full_name === 'string') profilePatch.full_name = updates.full_name;
      if (typeof updates.grade === 'string') profilePatch.grade = updates.grade;
      if (typeof updates.avatar_url === 'string') profilePatch.avatar_url = updates.avatar_url;
      if (typeof updates.avatar_url !== 'undefined') profilePatch.avatar_url = updates.avatar_url ?? null;
      if (typeof updates.precise_location_enabled === 'boolean') {
        settingsPatch.precise_location_enabled = updates.precise_location_enabled;
      }
      if (typeof updates.default_visibility === 'string') {
        settingsPatch.default_visibility = updates.default_visibility;
      }

      if (Object.keys(profilePatch).length > 0) {
        const { error } = await client.from('profiles').update(profilePatch).eq('id', id);
        if (error) {
          throw new Error(`Failed updating profile: ${error.message}`);
        }
      }

      if (Object.keys(settingsPatch).length > 0) {
        const { error } = await client.from('user_settings').update(settingsPatch).eq('user_id', id);
        if (error) {
          throw new Error(`Failed updating user settings: ${error.message}`);
        }
      }
    },
  };

  const friendshipRepository: IFriendshipRepository = {
    async getFriendsOf(userId) {
      const { data: friendships, error } = await client
        .from('friendships')
        .select('user_a, user_b')
        .or(`user_a.eq.${userId},user_b.eq.${userId}`);

      if (error) {
        throw new Error(`Failed loading friendships: ${error.message}`);
      }

      const friendIds = (friendships ?? []).map((row) => (row.user_a === userId ? row.user_b : row.user_a));
      const uniqueFriendIds = [...new Set(friendIds)];
      return getUsersWithSettings(client, uniqueFriendIds);
    },
    async areFriends(userA, userB) {
      const { data, error } = await client
        .from('friendships')
        .select('id')
        .or(`and(user_a.eq.${userA},user_b.eq.${userB}),and(user_a.eq.${userB},user_b.eq.${userA})`)
        .limit(1);

      if (error) {
        throw new Error(`Failed checking friendship: ${error.message}`);
      }
      return (data ?? []).length > 0;
    },
    async createFriendship(userA, userB) {
      const { error } = await client.from('friendships').insert({ user_a: userA, user_b: userB });
      if (error) {
        throw new Error(`Failed creating friendship: ${error.message}`);
      }
    },
    async getFriendRequests(userId) {
      const { data: incoming, error: incomingError } = await client
        .from('friend_requests')
        .select('id, from_user_id, to_user_id, status, created_at, responded_at')
        .eq('to_user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (incomingError) {
        throw new Error(`Failed loading incoming requests: ${incomingError.message}`);
      }

      const { data: outgoing, error: outgoingError } = await client
        .from('friend_requests')
        .select('id, from_user_id, to_user_id, status, created_at, responded_at')
        .eq('from_user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (outgoingError) {
        throw new Error(`Failed loading outgoing requests: ${outgoingError.message}`);
      }

      return {
        incoming: (incoming ?? []) as Types.FriendRequest[],
        outgoing: (outgoing ?? []) as Types.FriendRequest[],
      };
    },
    async createFriendRequest(fromUserId, toUserId) {
      const { data, error } = await client
        .from('friend_requests')
        .insert({ from_user_id: fromUserId, to_user_id: toUserId })
        .select('id, from_user_id, to_user_id, status, created_at, responded_at')
        .single();

      if (error) {
        throw new Error(`Failed creating friend request: ${error.message}`);
      }

      return data as Types.FriendRequest;
    },
    async acceptFriendRequest(requestId) {
      const respondedAt = new Date().toISOString();
      const { data: request, error: requestError } = await client
        .from('friend_requests')
        .update({ status: 'accepted', responded_at: respondedAt })
        .eq('id', requestId)
        .eq('status', 'pending')
        .select('id, from_user_id, to_user_id, status, created_at, responded_at')
        .maybeSingle();

      if (requestError) {
        throw new Error(`Failed accepting friend request: ${requestError.message}`);
      }
      if (!request) {
        return null;
      }

      const { error: friendshipError } = await client.from('friendships').insert({
        user_a: request.from_user_id,
        user_b: request.to_user_id,
      });

      if (friendshipError) {
        throw new Error(`Failed creating friendship from request: ${friendshipError.message}`);
      }

      return request as Types.FriendRequest;
    },
    async rejectFriendRequest(requestId) {
      const respondedAt = new Date().toISOString();
      const { data, error } = await client
        .from('friend_requests')
        .update({ status: 'rejected', responded_at: respondedAt })
        .eq('id', requestId)
        .eq('status', 'pending')
        .select('id, from_user_id, to_user_id, status, created_at, responded_at')
        .maybeSingle();

      if (error) {
        throw new Error(`Failed rejecting friend request: ${error.message}`);
      }

      return (data as Types.FriendRequest | null) ?? null;
    },
  };

  const statusRepository: IStatusRepository = {
    async getActiveStatuses() {
      const { data, error } = await client
        .from('statuses')
        .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed loading active statuses: ${error.message}`);
      }
      return (data ?? []) as Types.UserStatus[];
    },
    async getUserStatus(userId) {
      const { data, error } = await client
        .from('statuses')
        .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed loading user status: ${error.message}`);
      }
      return (data as Types.UserStatus | null) ?? undefined;
    },
    async createOrUpdateStatus(status) {
      const { error } = await client
        .from('statuses')
        .upsert(status, { onConflict: 'id' });

      if (error) {
        throw new Error(`Failed creating/updating status: ${error.message}`);
      }
    },
    async deactivateStatus(userId) {
      const { data, error } = await client
        .from('statuses')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_active', true)
        .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed deactivating status: ${error.message}`);
      }
      return (data as Types.UserStatus | null) ?? undefined;
    },
    async activateStatus({ userId, locationLabel, note, visibility, durationMinutes }) {
      const expiresAt = Number.isFinite(durationMinutes) && (durationMinutes ?? 0) > 0
        ? new Date(Date.now() + (durationMinutes as number) * 60 * 1000).toISOString()
        : null;

      const { data: existing, error: existingError } = await client
        .from('statuses')
        .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (existingError) {
        throw new Error(`Failed checking existing status: ${existingError.message}`);
      }

      if (existing) {
        const { data: updated, error: updateError } = await client
          .from('statuses')
          .update({
            visibility,
            location_label: locationLabel,
            note,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
          .single();

        if (updateError) {
          throw new Error(`Failed updating active status: ${updateError.message}`);
        }

        return { status: updated as Types.UserStatus, created: false };
      }

      const { data: created, error: createError } = await client
        .from('statuses')
        .insert({
          user_id: userId,
          is_active: true,
          visibility,
          location_label: locationLabel,
          note,
          expires_at: expiresAt,
        })
        .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
        .single();

      if (createError) {
        throw new Error(`Failed creating status: ${createError.message}`);
      }

      return { status: created as Types.UserStatus, created: true };
    },
    async extendStatus(userId, addMinutes) {
      const existing = await this.getUserStatus(userId);
      if (!existing) {
        return undefined;
      }

      const currentExpiry = existing.expires_at ? new Date(existing.expires_at).getTime() : Date.now();
      const nextExpiry = new Date(currentExpiry + addMinutes * 60 * 1000).toISOString();

      const { data, error } = await client
        .from('statuses')
        .update({ expires_at: nextExpiry, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select('id, user_id, is_active, visibility, location_label, note, zone_id, starts_at, expires_at, updated_at')
        .single();

      if (error) {
        throw new Error(`Failed extending status: ${error.message}`);
      }

      return data as Types.UserStatus;
    },
    async getVisibleStatusesFor() {
      const statuses = await this.getActiveStatuses();
      const userIds = [...new Set(statuses.map((status) => status.user_id))] as string[];
      const users = await getUsersWithSettings(client, userIds);
      const usersById = new Map(users.map((user) => [user.id, user]));

      return statuses
        .map((status) => {
          const user = usersById.get(status.user_id);
          if (!user) {
            return undefined;
          }
          return { status, user };
        })
        .filter((entry): entry is { status: Types.UserStatus; user: Types.User } => Boolean(entry));
    },
  };

  const locationRepository: ILocationRepository = {
    async createSample({ userId, latitude, longitude, accuracyM, source, locationMode, zoneId }) {
      const nowIso = new Date().toISOString();
      const { data, error } = await client
        .from('location_samples')
        .insert({
          user_id: userId,
          latitude,
          longitude,
          accuracy_m: accuracyM ?? null,
          source,
          location_mode: locationMode,
          zone_id: zoneId ?? null,
          captured_at: nowIso,
        })
        .select('id, user_id, latitude, longitude, accuracy_m, source, location_mode, zone_id, captured_at, created_at, expires_at')
        .single();

      if (error) {
        throw new Error(`Failed creating location sample: ${error.message}`);
      }

      return data as Types.LocationSample;
    },
    async getLatestSampleForUser(userId) {
      const { data, error } = await client
        .from('location_samples')
        .select('id, user_id, latitude, longitude, accuracy_m, source, location_mode, zone_id, captured_at, created_at, expires_at')
        .eq('user_id', userId)
        .order('captured_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed loading latest location sample: ${error.message}`);
      }

      return (data as Types.LocationSample | null) ?? undefined;
    },
    async getVisibleLocationFeed(viewerId) {
      const visibleStatuses = await statusRepository.getVisibleStatusesFor(viewerId);
      const rows: Array<{ status: Types.UserStatus; user: Types.User; sample?: Types.LocationSample }> = [];

      for (const row of visibleStatuses) {
        let sample: Types.LocationSample | undefined;
        if (row.user.id === viewerId) {
          sample = await this.getLatestSampleForUser(row.user.id);
        } else if (row.user.precise_location_enabled) {
          const friends = await areUsersFriends(client, viewerId, row.user.id);
          if (friends) {
            sample = await this.getLatestSampleForUser(row.user.id);
          }
        }

        rows.push({
          status: row.status,
          user: row.user,
          sample,
        });
      }

      return rows;
    },
  };

  const consentRepository: IConsentRepository = {
    async recordPreciseLocationConsent({ userId, policyVersion, isGranted }) {
      const nowIso = new Date().toISOString();
      const { data, error } = await client
        .from('consent_events')
        .insert({
          user_id: userId,
          consent_type: 'precise_location',
          policy_version: policyVersion,
          is_granted: isGranted,
          granted_at: isGranted ? nowIso : null,
          revoked_at: isGranted ? null : nowIso,
        })
        .select('id, user_id, consent_type, policy_version, is_granted, granted_at, revoked_at, created_at')
        .single();

      if (error) {
        throw new Error(`Failed recording precise location consent: ${error.message}`);
      }

      return data as Types.ConsentEvent;
    },
    async getLatestPreciseLocationConsent(userId) {
      const { data, error } = await client
        .from('consent_events')
        .select('id, user_id, consent_type, policy_version, is_granted, granted_at, revoked_at, created_at')
        .eq('user_id', userId)
        .eq('consent_type', 'precise_location')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed loading latest precise location consent: ${error.message}`);
      }

      return (data as Types.ConsentEvent | null) ?? undefined;
    },
  };

  const eventRepository: IEventRepository = {
    async getAllEvents() {
      const { data, error } = await client
        .from('events')
        .select('id, kind, title, subject, location, starts_at, ends_at, creator_id, max_participants, created_at, updated_at')
        .order('starts_at', { ascending: true });

      if (error) {
        throw new Error(`Failed loading events: ${error.message}`);
      }

      return enrichEvents(client, (data ?? []) as Array<Omit<Types.EventItem, 'participant_ids'>>);
    },
    async getEventById(id) {
      const { data, error } = await client
        .from('events')
        .select('id, kind, title, subject, location, starts_at, ends_at, creator_id, max_participants, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed loading event by id: ${error.message}`);
      }
      if (!data) {
        return undefined;
      }

      const events = await enrichEvents(client, [data as Omit<Types.EventItem, 'participant_ids'>]);
      return events[0];
    },
    async createEvent(event) {
      const { error: insertError } = await client.from('events').insert({
        id: event.id,
        kind: event.kind,
        title: event.title,
        subject: event.subject,
        location: event.location,
        starts_at: event.starts_at,
        ends_at: event.ends_at,
        creator_id: event.creator_id,
        max_participants: event.max_participants,
      });

      if (insertError) {
        throw new Error(`Failed creating event: ${insertError.message}`);
      }

      if (event.participant_ids.length > 0) {
        const { error: participantsError } = await client.from('event_participants').insert(
          event.participant_ids.map((participantId) => ({ event_id: event.id, user_id: participantId })),
        );

        if (participantsError) {
          throw new Error(`Failed creating event participants: ${participantsError.message}`);
        }
      }
    },
    async createEventForUser({ creatorId, kind, title, subject, location, startsAt, endsAt, maxParticipants }) {
      const { data, error } = await client
        .from('events')
        .insert({
          kind,
          title,
          subject,
          location,
          starts_at: startsAt,
          ends_at: endsAt,
          creator_id: creatorId,
          max_participants: maxParticipants ?? 12,
        })
        .select('id, kind, title, subject, location, starts_at, ends_at, creator_id, max_participants, created_at, updated_at')
        .single();

      if (error) {
        throw new Error(`Failed creating event for user: ${error.message}`);
      }

      const eventId = data.id;
      const { error: participantError } = await client.from('event_participants').insert({
        event_id: eventId,
        user_id: creatorId,
      });

      if (participantError) {
        throw new Error(`Failed adding creator as participant: ${participantError.message}`);
      }

      const enriched = await enrichEvents(client, [data as Omit<Types.EventItem, 'participant_ids'>]);
      return enriched[0];
    },
    async addEventParticipant(eventId, userId) {
      const { error } = await client.from('event_participants').insert({ event_id: eventId, user_id: userId });
      if (error) {
        throw new Error(`Failed adding event participant: ${error.message}`);
      }
    },
    async removeEventParticipant(eventId, userId) {
      const { error } = await client.from('event_participants').delete().eq('event_id', eventId).eq('user_id', userId);
      if (error) {
        throw new Error(`Failed removing event participant: ${error.message}`);
      }
    },
    async joinEvent(eventId, userId) {
      const event = await this.getEventById(eventId);
      if (!event) {
        return { error: 'not_found' };
      }

      if (event.participant_ids.includes(userId)) {
        return { event };
      }

      if (event.participant_ids.length >= event.max_participants) {
        return { error: 'full' };
      }

      await this.addEventParticipant(eventId, userId);
      const updated = await this.getEventById(eventId);
      return { event: updated };
    },
    async leaveEvent(eventId, userId) {
      await this.removeEventParticipant(eventId, userId);
      return this.getEventById(eventId);
    },
  };

  const conversationRepository: IConversationRepository = {
    async getConversationsFor() {
      const { data, error } = await client
        .from('conversations')
        .select('id, created_by, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed loading conversations: ${error.message}`);
      }
      return (data ?? []) as Types.Conversation[];
    },
    async getConversationById(id) {
      const { data, error } = await client
        .from('conversations')
        .select('id, created_by, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed loading conversation by id: ${error.message}`);
      }
      return (data as Types.Conversation | null) ?? undefined;
    },
    async createConversation(createdBy) {
      const { data, error } = await client
        .from('conversations')
        .insert({ created_by: createdBy })
        .select('id, created_by, created_at, updated_at')
        .single();

      if (error) {
        throw new Error(`Failed creating conversation: ${error.message}`);
      }

      const { error: participantsError } = await client.from('conversation_participants').insert({
        conversation_id: data.id,
        user_id: createdBy,
      });

      if (participantsError) {
        throw new Error(`Failed creating conversation participant: ${participantsError.message}`);
      }

      return data as Types.Conversation;
    },
    async getMessagesFor(conversationId) {
      const { data, error } = await client
        .from('messages')
        .select('id, conversation_id, sender_id, body, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed loading messages: ${error.message}`);
      }
      return (data ?? []) as Types.Message[];
    },
    async addMessage(message) {
      const { data, error } = await client
        .from('messages')
        .insert({
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        body: message.body,
      })
        .select('id, conversation_id, sender_id, body, created_at')
        .single();

      if (error) {
        throw new Error(`Failed adding message: ${error.message}`);
      }

      return data as Types.Message;
    },
  };

  const notificationRepository: INotificationRepository = {
    async getNotificationsFor(userId) {
      const { data, error } = await client
        .from('notifications')
        .select('id, user_id, kind, title, body, is_read, created_at, payload')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed loading notifications: ${error.message}`);
      }

      return (data ?? []) as Types.NotificationItem[];
    },
    async markAsRead(notificationId) {
      const { data, error } = await client
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select('id, user_id, kind, title, body, is_read, created_at, payload')
        .maybeSingle();

      if (error) {
        throw new Error(`Failed marking notification as read: ${error.message}`);
      }

      return (data as Types.NotificationItem | null) ?? undefined;
    },
  };

  return {
    userRepository,
    friendshipRepository,
    statusRepository,
    locationRepository,
    consentRepository,
    eventRepository,
    conversationRepository,
    notificationRepository,
  };
}

function createMemoryRepositories() {
  const userRepository: IUserRepository = {
    async getUserById(id) {
      return db.getUserById(id);
    },
    async getUserByEmail(email) {
      return db.users.find((u) => u.email === email);
    },
    async getAllUsers() {
      return db.users;
    },
    async createUser(user) {
      db.users.push(user);
    },
    async updateUser(id, updates) {
      const user = db.getUserById(id);
      if (user) {
        Object.assign(user, updates);
      }
    },
  };

  const friendshipRepository: IFriendshipRepository = {
    async getFriendsOf(userId) {
      return db.getFriendsOf(userId);
    },
    async areFriends(userA, userB) {
      return db.friendships.some(
        (f) => (f.user_a === userA && f.user_b === userB) || (f.user_a === userB && f.user_b === userA),
      );
    },
    async createFriendship(userA, userB) {
      db.friendships.push({ id: db.nextId('f'), user_a: userA, user_b: userB, created_at: db.now() });
    },
    async getFriendRequests(userId) {
      return {
        incoming: db.friendRequests.filter((r) => r.to_user_id === userId && r.status === 'pending'),
        outgoing: db.friendRequests.filter((r) => r.from_user_id === userId && r.status === 'pending'),
      };
    },
    async createFriendRequest(fromUserId, toUserId) {
      const request: Types.FriendRequest = {
        id: db.nextId('fr'),
        from_user_id: fromUserId,
        to_user_id: toUserId,
        status: 'pending',
        created_at: db.now(),
      };
      db.friendRequests.push(request);
      return request;
    },
    async acceptFriendRequest(requestId) {
      const request = db.friendRequests.find((r) => r.id === requestId);
      if (!request) {
        return null;
      }
      request.status = 'accepted';
      request.responded_at = db.now();
      db.friendships.push({
        id: db.nextId('f'),
        user_a: request.from_user_id,
        user_b: request.to_user_id,
        created_at: db.now(),
      });
      return request;
    },
    async rejectFriendRequest(requestId) {
      const request = db.friendRequests.find((r) => r.id === requestId);
      if (!request) {
        return null;
      }
      request.status = 'rejected';
      request.responded_at = db.now();
      return request;
    },
  };

  const statusRepository: IStatusRepository = {
    async getActiveStatuses() {
      return db.statuses.filter((s) => s.is_active);
    },
    async getUserStatus(userId) {
      return db.statuses.find((s) => s.user_id === userId && s.is_active);
    },
    async createOrUpdateStatus(status) {
      const existing = db.statuses.find((s) => s.id === status.id);
      if (existing) {
        Object.assign(existing, status);
      } else {
        db.statuses.push(status);
      }
    },
    async deactivateStatus(userId) {
      const status = db.statuses.find((s) => s.user_id === userId && s.is_active);
      if (status) {
        status.is_active = false;
        status.updated_at = db.now();
      }
      return status;
    },
    async activateStatus({ userId, locationLabel, note, visibility, durationMinutes }) {
      const expiresAt = Number.isFinite(durationMinutes) && (durationMinutes ?? 0) > 0
        ? new Date(Date.now() + (durationMinutes as number) * 60 * 1000).toISOString()
        : undefined;

      const existing = db.statuses.find((s) => s.user_id === userId && s.is_active);
      if (existing) {
        existing.visibility = visibility;
        existing.location_label = locationLabel;
        existing.note = note;
        existing.expires_at = expiresAt;
        existing.updated_at = db.now();
        return { status: existing, created: false };
      }

      const status: Types.UserStatus = {
        id: db.nextId('st'),
        user_id: userId,
        is_active: true,
        visibility,
        location_label: locationLabel,
        note,
        starts_at: db.now(),
        expires_at: expiresAt,
        updated_at: db.now(),
      };
      db.statuses.push(status);
      return { status, created: true };
    },
    async extendStatus(userId, addMinutes) {
      const status = db.statuses.find((s) => s.user_id === userId && s.is_active);
      if (!status) {
        return undefined;
      }

      const currentExpiry = status.expires_at ? new Date(status.expires_at).getTime() : Date.now();
      status.expires_at = new Date(currentExpiry + addMinutes * 60 * 1000).toISOString();
      status.updated_at = db.now();
      return status;
    },
    async getVisibleStatusesFor(viewerId) {
      const viewer = db.getUserById(viewerId);
      if (!viewer) {
        return [];
      }

      return db.statuses
        .filter((status) => status.is_active)
        .map((status) => {
          const user = db.getUserById(status.user_id);
          if (!user) {
            return undefined;
          }
          if (!db.canViewerSeeStatus(viewer, user, status.visibility)) {
            return undefined;
          }
          return { status, user };
        })
        .filter((entry): entry is { status: Types.UserStatus; user: Types.User } => Boolean(entry));
    },
  };

  const locationRepository: ILocationRepository = {
    async createSample({ userId, latitude, longitude, accuracyM, source, locationMode, zoneId }) {
      const sample: Types.LocationSample = {
        id: db.nextId('ls'),
        user_id: userId,
        latitude,
        longitude,
        accuracy_m: accuracyM,
        source,
        location_mode: locationMode,
        zone_id: zoneId,
        captured_at: db.now(),
        created_at: db.now(),
      };
      db.locationSamples.push(sample);
      return sample;
    },
    async getLatestSampleForUser(userId) {
      const sorted = [...db.locationSamples]
        .filter((sample) => sample.user_id === userId)
        .sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime());

      return sorted[0];
    },
    async getVisibleLocationFeed(viewerId) {
      const visibleStatuses = await statusRepository.getVisibleStatusesFor(viewerId);

      return Promise.all(
        visibleStatuses.map(async ({ status, user }) => {
          let sample: Types.LocationSample | undefined;
          const canSeePrecise = user.id === viewerId
            || (user.precise_location_enabled && (await friendshipRepository.areFriends(viewerId, user.id)));

          if (canSeePrecise) {
            sample = await this.getLatestSampleForUser(user.id);
          }

          return {
            status,
            user,
            sample,
          };
        }),
      );
    },
  };

  const consentRepository: IConsentRepository = {
    async recordPreciseLocationConsent({ userId, policyVersion, isGranted }) {
      const nowIso = db.now();
      const event: Types.ConsentEvent = {
        id: db.nextId('ce'),
        user_id: userId,
        consent_type: 'precise_location',
        policy_version: policyVersion,
        is_granted: isGranted,
        granted_at: isGranted ? nowIso : undefined,
        revoked_at: isGranted ? undefined : nowIso,
        created_at: nowIso,
      };
      db.consentEvents.push(event);
      return event;
    },
    async getLatestPreciseLocationConsent(userId) {
      const sorted = [...db.consentEvents]
        .filter((event) => event.user_id === userId && event.consent_type === 'precise_location')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return sorted[0];
    },
  };

  const eventRepository: IEventRepository = {
    async getAllEvents() {
      return db.events;
    },
    async getEventById(id) {
      return db.events.find((e) => e.id === id);
    },
    async createEvent(event) {
      db.events.push(event);
    },
    async createEventForUser({ creatorId, kind, title, subject, location, startsAt, endsAt, maxParticipants }) {
      const event: Types.EventItem = {
        id: db.nextId('e'),
        kind,
        title,
        subject,
        location,
        starts_at: startsAt,
        ends_at: endsAt,
        creator_id: creatorId,
        participant_ids: [creatorId],
        max_participants: maxParticipants ?? 12,
        created_at: db.now(),
        updated_at: db.now(),
      };
      db.events.push(event);
      return event;
    },
    async addEventParticipant(eventId, userId) {
      const event = db.events.find((e) => e.id === eventId);
      if (event && !event.participant_ids.includes(userId)) {
        event.participant_ids.push(userId);
        event.updated_at = db.now();
      }
    },
    async removeEventParticipant(eventId, userId) {
      const event = db.events.find((e) => e.id === eventId);
      if (event) {
        event.participant_ids = event.participant_ids.filter((id) => id !== userId);
        event.updated_at = db.now();
      }
    },
    async joinEvent(eventId, userId) {
      const event = db.events.find((e) => e.id === eventId);
      if (!event) {
        return { error: 'not_found' };
      }
      if (event.participant_ids.includes(userId)) {
        return { event };
      }
      if (event.participant_ids.length >= event.max_participants) {
        return { error: 'full' };
      }
      event.participant_ids.push(userId);
      event.updated_at = db.now();
      return { event };
    },
    async leaveEvent(eventId, userId) {
      const event = db.events.find((e) => e.id === eventId);
      if (!event) {
        return undefined;
      }
      event.participant_ids = event.participant_ids.filter((id) => id !== userId);
      event.updated_at = db.now();
      return event;
    },
  };

  const conversationRepository: IConversationRepository = {
    async getConversationsFor(userId) {
      return db.conversations.filter((c) => c.created_by === userId);
    },
    async getConversationById(id) {
      return db.conversations.find((c) => c.id === id);
    },
    async createConversation(createdBy) {
      const conversation: Types.Conversation = {
        id: db.nextId('c'),
        created_by: createdBy,
        created_at: db.now(),
        updated_at: db.now(),
      };
      db.conversations.push(conversation);
      return conversation;
    },
    async getMessagesFor(conversationId) {
      return db.messages.filter((m) => m.conversation_id === conversationId);
    },
    async addMessage(message) {
      db.messages.push(message);
      const conversation = db.conversations.find((c) => c.id === message.conversation_id);
      if (conversation) {
        conversation.updated_at = db.now();
      }
      return message;
    },
  };

  const notificationRepository: INotificationRepository = {
    async getNotificationsFor(userId) {
      return db.notifications.filter((n) => n.user_id === userId);
    },
    async markAsRead(notificationId) {
      const notification = db.notifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
      }
      return notification;
    },
  };

  return {
    userRepository,
    friendshipRepository,
    statusRepository,
    locationRepository,
    consentRepository,
    eventRepository,
    conversationRepository,
    notificationRepository,
  };
}
