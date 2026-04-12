export type VisibilityScope = 'friends' | 'grade' | 'all';
export type LocationMode = 'zone' | 'precise' | 'manual';
export type LocationSource = 'gps' | 'manual' | 'app';

export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  grade: string;
  avatarUrl?: string;
  preciseLocationEnabled: boolean;
  defaultVisibility: VisibilityScope;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMyProfileInput {
  fullName: string;
  grade: string;
  defaultVisibility: VisibilityScope;
  avatarUrl?: string;
  preciseLocationEnabled?: boolean;
}

export interface UpdateMyPrivacyInput {
  defaultVisibility?: VisibilityScope;
  preciseLocationEnabled?: boolean;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000';

type AuthTokenProvider = (() => Promise<string | null> | string | null) | null;

let authToken: string | null = null;
let authTokenProvider: AuthTokenProvider = null;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const resolvedToken = authTokenProvider ? await authTokenProvider() : authToken;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  };

  if (resolvedToken) {
    headers['Authorization'] = `Bearer ${resolvedToken}`;
  } else {
    const userId = localStorage.getItem('iasa_dev_user_id') || 'u1';
    headers['x-user-id'] = userId;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export interface ActivateStatusInput {
  locationLabel: string;
  note: string;
  visibility: VisibilityScope;
  durationMinutes?: number;
}

export interface OutsideResult {
  status: {
    id: string;
    userId: string;
    visibility: VisibilityScope;
    locationLabel: string;
    note: string;
    expiresAt?: string;
  };
  user: {
    id: string;
    name: string;
    grade: string;
    isFriend: boolean;
  };
}

export interface ChatConversationSummary {
  id: string;
  peer: {
    id: string;
    name: string;
  } | null;
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface LocationSampleDTO {
  id: string;
  userId: string;
  latitude?: number;
  longitude?: number;
  accuracyM?: number;
  source: LocationSource;
  locationMode: LocationMode;
  zoneId?: string;
  capturedAt: string;
  createdAt: string;
  expiresAt?: string;
}

export interface CreateLocationSampleInput {
  latitude: number;
  longitude: number;
  accuracyM?: number;
  source?: LocationSource;
  locationMode?: LocationMode;
  zoneId?: string;
}

export interface RecordLocationConsentInput {
  isGranted: boolean;
  policyVersion?: string;
}

export interface OutsideLocationResult {
  status: {
    id: string;
    userId: string;
    visibility: VisibilityScope;
    locationLabel: string;
    note: string;
    zoneId?: string;
    startsAt: string;
    expiresAt?: string;
    updatedAt: string;
  };
  user: {
    id: string;
    name: string;
    grade: string;
    isFriend: boolean;
  };
  sample: LocationSampleDTO | null;
}

export const api = {
  setAuthTokenProvider(provider: AuthTokenProvider) {
    authTokenProvider = provider;
  },
  setAuthToken(token: string, userId: string) {
    authToken = token;
    localStorage.setItem('iasa_dev_user_id', userId);
  },
  clearAuthToken() {
    authToken = null;
    authTokenProvider = null;
    localStorage.removeItem('iasa_dev_user_id');
  },
  getMe() {
    return apiFetch<{ user: UserDTO | null }>('/api/users/me');
  },
  updateMyProfile(input: UpdateMyProfileInput) {
    return apiFetch<{ user: UserDTO | null }>('/api/users/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  updateMyPrivacy(input: UpdateMyPrivacyInput) {
    return apiFetch<{ user: UserDTO | null }>('/api/users/me/privacy', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  recordLocationConsent(input: RecordLocationConsentInput) {
    return apiFetch<{ user: UserDTO | null; consent: any }>('/api/users/me/consent/location', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  activateStatus(input: any) {
    return apiFetch<{ status: any }>('/api/status/activate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  deactivateStatus() {
    return apiFetch<{ status: any }>('/api/status/deactivate', {
      method: 'POST',
    });
  },
  extendStatus(addMinutes = 10) {
    return apiFetch<{ status: any }>('/api/status/extend', {
      method: 'PATCH',
      body: JSON.stringify({ addMinutes }),
    });
  },
  getOutside() {
    return apiFetch<{ results: OutsideResult[] }>('/api/status/outside');
  },
  createLocationSample(input: CreateLocationSampleInput) {
    return apiFetch<{ sample: LocationSampleDTO }>('/api/location/samples', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getMyLatestLocationSample() {
    return apiFetch<{ sample: LocationSampleDTO | null }>('/api/location/me/latest');
  },
  getOutsideLocationFeed() {
    return apiFetch<{ results: OutsideLocationResult[] }>('/api/location/outside');
  },
  getConversations() {
    return apiFetch<{ conversations: ChatConversationSummary[] }>('/api/chat/conversations');
  },
  getMessages(conversationId: string) {
    return apiFetch<{ messages: ChatMessage[] }>(`/api/chat/conversations/${conversationId}/messages`);
  },
  sendMessage(conversationId: string, text: string) {
    return apiFetch<{ message: ChatMessage }>(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};
