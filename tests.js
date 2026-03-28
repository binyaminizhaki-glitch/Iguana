const baseUrl = process.env.API_BASE_URL ?? `http://localhost:${process.env.API_PORT ?? 4000}`;
const devUserId = process.env.TEST_USER_ID ?? 'u1';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': devUserId,
};

const tests = [
  {
    name: 'health',
    method: 'GET',
    path: '/health',
    headers: {},
    assert: async (response, body) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (body?.status !== 'ok') {
        throw new Error(`Unexpected health status: ${body?.status}`);
      }
    },
  },
  {
    name: 'readiness',
    method: 'GET',
    path: '/readiness',
    headers: {},
    assert: async (response, body) => {
      if (![200, 503].includes(response.status)) {
        throw new Error(`Expected 200 or 503, got ${response.status}`);
      }
      const validStatus = body?.status === 'ready' || body?.status === 'not_ready';
      if (!validStatus) {
        throw new Error(`Unexpected readiness status: ${body?.status}`);
      }
    },
  },
  {
    name: 'meta backend mode',
    method: 'GET',
    path: '/api/meta/backend-mode',
    assert: async (response, body) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (!['memory', 'supabase'].includes(body?.mode)) {
        throw new Error(`Unexpected backend mode: ${body?.mode}`);
      }
    },
  },
  {
    name: 'users me',
    method: 'GET',
    path: '/api/users/me',
    assert: async (response, body) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (!body?.user?.id) {
        throw new Error('Missing user id in /api/users/me response');
      }
    },
  },
  {
    name: 'friends',
    method: 'GET',
    path: '/api/friends',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'friend requests',
    method: 'GET',
    path: '/api/friends/requests',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'outside statuses',
    method: 'GET',
    path: '/api/status/outside',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'record location consent granted',
    method: 'POST',
    path: '/api/users/me/consent/location',
    body: {
      isGranted: true,
      policyVersion: 'v1',
    },
    assert: async (response, body) => {
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}`);
      }
      if (body?.consent?.isGranted !== true) {
        throw new Error('Consent should be granted=true');
      }
    },
  },
  {
    name: 'create location sample',
    method: 'POST',
    path: '/api/location/samples',
    body: {
      latitude: 31.7767,
      longitude: 35.2345,
      accuracyM: 8,
      source: 'gps',
      locationMode: 'precise',
      zoneId: 'grass',
    },
    assert: async (response, body) => {
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}`);
      }
      if (!body?.sample?.id) {
        throw new Error('Missing location sample id');
      }
    },
  },
  {
    name: 'my latest location sample',
    method: 'GET',
    path: '/api/location/me/latest',
    assert: async (response, body) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (body?.sample && typeof body.sample.latitude !== 'number') {
        throw new Error('Expected sample latitude to be numeric when sample exists');
      }
    },
  },
  {
    name: 'outside location feed',
    method: 'GET',
    path: '/api/location/outside',
    assert: async (response, body) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
      if (!Array.isArray(body?.results)) {
        throw new Error('Expected results array');
      }
    },
  },
  {
    name: 'activate status',
    method: 'POST',
    path: '/api/status/activate',
    body: {
      locationLabel: 'Smoke Test',
      note: `smoke-${Date.now()}`,
      visibility: 'friends',
      durationMinutes: 5,
    },
    assert: async (response, body) => {
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}`);
      }
      if (!body?.status?.id) {
        throw new Error('Missing status id after activation');
      }
    },
  },
  {
    name: 'extend status',
    method: 'PATCH',
    path: '/api/status/extend',
    body: { addMinutes: 5 },
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'deactivate status',
    method: 'POST',
    path: '/api/status/deactivate',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'events',
    method: 'GET',
    path: '/api/events',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'chat conversations',
    method: 'GET',
    path: '/api/chat/conversations',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'notifications',
    method: 'GET',
    path: '/api/notifications',
    assert: async (response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, got ${response.status}`);
      }
    },
  },
  {
    name: 'logout',
    method: 'POST',
    path: '/api/auth/logout',
    assert: async (response) => {
      if (![200, 204].includes(response.status)) {
        throw new Error(`Expected 200 or 204, got ${response.status}`);
      }
    },
  },
];

async function parseBody(response) {
  const rawText = await response.text();
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return rawText;
  }
}

async function run() {
  console.log(`Running smoke suite against ${baseUrl}`);

  for (const test of tests) {
    const response = await fetch(`${baseUrl}${test.path}`, {
      method: test.method,
      headers: { ...defaultHeaders, ...(test.headers ?? {}) },
      body: test.body ? JSON.stringify(test.body) : undefined,
    });

    const body = await parseBody(response);

    try {
      await test.assert(response, body);
      console.log(`PASS ${test.name} -> ${response.status}`);
    } catch (error) {
      console.error(`FAIL ${test.name} -> ${response.status}`);
      if (body) {
        console.error(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
      }
      throw error;
    }
  }

  console.log('Smoke suite completed successfully.');
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
