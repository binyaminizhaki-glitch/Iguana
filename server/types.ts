export type VisibilityScope = 'friends' | 'grade' | 'all';

export interface User {
  id: string;
  email: string;
  full_name: string;
  grade: string;
  avatar_url?: string;
  precise_location_enabled: boolean;
  default_visibility: VisibilityScope;
  created_at: string;
  updated_at: string;
}

export interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  responded_at?: string;
}

export interface Friendship {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
}

export interface UserStatus {
  id: string;
  user_id: string;
  is_active: boolean;
  visibility: VisibilityScope;
  location_label: string;
  note: string;
  zone_id?: string;
  starts_at: string;
  expires_at?: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  kind: 'study' | 'event';
  title: string;
  subject: string;
  location: string;
  starts_at: string;
  ends_at: string;
  creator_id: string;
  participant_ids: string[];
  max_participants: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  kind: 'friend_request' | 'message' | 'event_reminder' | 'system';
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  payload: Record<string, any>;
}
