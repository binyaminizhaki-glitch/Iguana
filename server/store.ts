import {
  Conversation,
  EventItem,
  Friendship,
  FriendRequest,
  Message,
  NotificationItem,
  User,
  UserStatus,
  VisibilityScope,
} from './types.js';

const now = () => new Date().toISOString();

const users: User[] = [
  {
    id: 'u1',
    email: 'daniel@iasa.edu',
    full_name: 'דניאל',
    grade: 'י״ב',
    precise_location_enabled: false,
    default_visibility: 'friends',
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 'u2',
    email: 'noa@iasa.edu',
    full_name: 'נועה',
    grade: 'י״ב',
    precise_location_enabled: true,
    default_visibility: 'friends',
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 'u3',
    email: 'itay@iasa.edu',
    full_name: 'איתי',
    grade: 'י״א',
    precise_location_enabled: true,
    default_visibility: 'grade',
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 'u4',
    email: 'newuser@iasa.edu',
    full_name: 'New User',
    grade: 'unknown',
    precise_location_enabled: false,
    default_visibility: 'friends',
    created_at: now(),
    updated_at: now(),
  },
];

const friendships: Friendship[] = [
  { id: 'f1', user_a: 'u1', user_b: 'u2', created_at: now() },
];

const friendRequests: FriendRequest[] = [
  { id: 'fr1', from_user_id: 'u3', to_user_id: 'u1', status: 'pending', created_at: now() },
];

const statuses: UserStatus[] = [];

const events: EventItem[] = [
  {
    id: 'e1',
    kind: 'study',
    title: 'תרגול מתמטיקה',
    subject: 'מתמטיקה 5 יחידות',
    location: 'ספרייה',
    starts_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    creator_id: 'u2',
    participant_ids: ['u2'],
    max_participants: 8,
    created_at: now(),
    updated_at: now(),
  },
];

const conversations: Conversation[] = [
  { id: 'c1', created_by: 'u1', created_at: now(), updated_at: now() },
];

const messages: Message[] = [
  { id: 'm1', conversation_id: 'c1', sender_id: 'u2', body: 'אתה בחוץ?', created_at: now() },
];

const notifications: NotificationItem[] = [
  {
    id: 'n1',
    user_id: 'u1',
    kind: 'friend_request',
    title: 'בקשת חברות חדשה',
    body: 'איתי שלח לך בקשת חברות',
    is_read: false,
    created_at: now(),
    payload: {},
  },
];

let idCounter = 1000;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

function getUserById(userId: string): User | undefined {
  return users.find((u) => u.id === userId);
}

function getFriendsOf(userId: string): User[] {
  const friendIds = friendships
    .filter((f) => f.user_a === userId || f.user_b === userId)
    .map((f) => (f.user_a === userId ? f.user_b : f.user_a));
  return users.filter((u) => friendIds.includes(u.id));
}

function canViewerSeeStatus(viewer: User, target: User, visibility: VisibilityScope): boolean {
  if (viewer.id === target.id) {
    return true;
  }
  if (visibility === 'all') {
    return true;
  }
  if (visibility === 'grade') {
    return viewer.grade === target.grade;
  }
  return getFriendsOf(target.id).some((f) => f.id === viewer.id);
}

export const db = {
  users,
  friendships,
  friendRequests,
  statuses,
  events,
  conversations,
  messages,
  notifications,
  nextId,
  now,
  getUserById,
  getFriendsOf,
  canViewerSeeStatus,
};
