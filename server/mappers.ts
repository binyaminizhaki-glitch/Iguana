// Mappers: Convert internal snake_case types to API camelCase DTOs

import * as Types from './types.js';

// API DTOs (camelCase)
export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  grade: string;
  avatarUrl?: string;
  preciseLocationEnabled: boolean;
  defaultVisibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatusDTO {
  id: string;
  userId: string;
  isActive: boolean;
  visibility: string;
  locationLabel: string;
  note: string;
  zoneId?: string;
  startsAt: string;
  expiresAt?: string;
  updatedAt: string;
}

export interface FriendshipDTO {
  id: string;
  userA: string;
  userB: string;
  createdAt: string;
}

export interface FriendRequestDTO {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: string;
  createdAt: string;
  respondedAt?: string;
}

export interface ConversationDTO {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  kind: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  payload: Record<string, any>;
}

export interface EventDTO {
  id: string;
  kind: string;
  title: string;
  subject: string;
  location: string;
  startsAt: string;
  endsAt: string;
  creatorId: string;
  participantIds: string[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

// Mapping functions
export function mapUser(user: Types.User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    grade: user.grade,
    avatarUrl: user.avatar_url,
    preciseLocationEnabled: user.precise_location_enabled,
    defaultVisibility: user.default_visibility,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

export function mapUserStatus(status: Types.UserStatus): UserStatusDTO {
  return {
    id: status.id,
    userId: status.user_id,
    isActive: status.is_active,
    visibility: status.visibility,
    locationLabel: status.location_label,
    note: status.note,
    zoneId: status.zone_id,
    startsAt: status.starts_at,
    expiresAt: status.expires_at,
    updatedAt: status.updated_at,
  };
}

export function mapFriendship(friendship: Types.Friendship): FriendshipDTO {
  return {
    id: friendship.id,
    userA: friendship.user_a,
    userB: friendship.user_b,
    createdAt: friendship.created_at,
  };
}

export function mapFriendRequest(request: Types.FriendRequest): FriendRequestDTO {
  return {
    id: request.id,
    fromUserId: request.from_user_id,
    toUserId: request.to_user_id,
    status: request.status,
    createdAt: request.created_at,
    respondedAt: request.responded_at,
  };
}

export function mapConversation(conversation: Types.Conversation): ConversationDTO {
  return {
    id: conversation.id,
    createdBy: conversation.created_by,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
}

export function mapMessage(message: Types.Message): MessageDTO {
  return {
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    body: message.body,
    createdAt: message.created_at,
  };
}

export function mapNotification(notification: Types.NotificationItem): NotificationDTO {
  return {
    id: notification.id,
    userId: notification.user_id,
    kind: notification.kind,
    title: notification.title,
    body: notification.body,
    isRead: notification.is_read,
    createdAt: notification.created_at,
    payload: notification.payload,
  };
}

export function mapEvent(event: Types.EventItem): EventDTO {
  return {
    id: event.id,
    kind: event.kind,
    title: event.title,
    subject: event.subject,
    location: event.location,
    startsAt: event.starts_at,
    endsAt: event.ends_at,
    creatorId: event.creator_id,
    participantIds: event.participant_ids,
    maxParticipants: event.max_participants,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  };
}
