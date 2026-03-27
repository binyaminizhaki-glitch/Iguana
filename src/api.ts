export type VisibilityScope = 'friends' | 'grade' | 'all';

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

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000';

// Store auth token in local storage
let authToken: string | null = localStorage.getItem('iasa_auth_token');

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  };

  // Add auth token if available, else fall back to dev header
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  } else {
    // Dev mode: use x-user-id header as fallback
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

export const api = {
  setAuthToken(token: string, userId: string) {
    authToken = token;
    localStorage.setItem('iasa_auth_token', token);
    localStorage.setItem('iasa_dev_user_id', userId);
  },
  clearAuthToken() {
    authToken = null;
    localStorage.removeItem('iasa_auth_token');
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
