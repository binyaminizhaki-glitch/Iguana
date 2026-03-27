#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const API_PORT = process.env.PERSISTENCE_TEST_PORT ?? '4100';
const API_BASE_URL = `http://127.0.0.1:${API_PORT}`;
const ACCESS_TOKEN = process.env.TEST_SUPABASE_JWT;

if (!ACCESS_TOKEN) {
  console.error('Missing TEST_SUPABASE_JWT. Provide a real user JWT token to run the persistence integration test.');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(path, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`);
      if (res.ok) {
        return;
      }
    } catch {
      // Keep retrying until timeout.
    }
    await sleep(500);
  }
  throw new Error(`Server did not become ready for ${path} within ${timeoutMs}ms`);
}

async function waitForServerDown(path, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`);
      if (!res.ok) {
        return;
      }
    } catch {
      return;
    }
    await sleep(500);
  }
  throw new Error(`Server did not stop for ${path} within ${timeoutMs}ms`);
}

function startServer() {
  const tsxCliPath = fileURLToPath(new URL('../../node_modules/tsx/dist/cli.mjs', import.meta.url));
  const serverEntryPath = path.resolve('server/index.ts');

  const child = spawn(process.execPath, [tsxCliPath, serverEntryPath], {
    env: {
      ...process.env,
      API_PORT,
      NODE_ENV: 'production',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[api] ${chunk}`);
  });
  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[api] ${chunk}`);
  });

  return child;
}

async function stopServer(child) {
  if (!child) {
    return;
  }

  const pid = child.pid;

  try {
    child.kill('SIGTERM');
  } catch {
    // Continue with hard kill fallback.
  }

  const graceful = await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(() => resolve('timeout'), 5000)),
  ]);

  if (graceful === 'timeout' && pid) {
    const killer = spawn('taskkill', ['/PID', String(pid), '/T', '/F'], {
      stdio: 'ignore',
      shell: false,
    });
    await Promise.race([
      new Promise((resolve) => killer.once('exit', resolve)),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  }
}

async function apiFetch(path, init = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    ...(init.headers ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} on ${path}: ${text}`);
  }

  return json;
}

async function assertStatusVisible(expectedNote) {
  const data = await apiFetch('/api/status/outside');
  const results = Array.isArray(data?.results) ? data.results : [];
  const found = results.some((entry) => entry?.status?.note === expectedNote);

  if (!found) {
    throw new Error(`Expected to find persisted status note "${expectedNote}" in /api/status/outside`);
  }
}

let server;

try {
  const note = `persistence-proof-${Date.now()}`;

  server = startServer();
  await waitForServer('/health');
  await waitForServer('/readiness');

  await apiFetch('/api/status/activate', {
    method: 'POST',
    body: JSON.stringify({
      locationLabel: 'Integration Test Zone',
      note,
      visibility: 'all',
      durationMinutes: 60,
    }),
  });

  await assertStatusVisible(note);

  await stopServer(server);
  await waitForServerDown('/health');
  server = undefined;

  server = startServer();
  await waitForServer('/health');
  await waitForServer('/readiness');

  await assertStatusVisible(note);

  await apiFetch('/api/status/deactivate', { method: 'POST' });

  console.log('Persistence integration test passed: status survived server restart via Supabase.');
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
} finally {
  await stopServer(server);
}
