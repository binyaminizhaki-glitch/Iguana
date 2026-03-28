import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { mapLocationSample, mapUserStatus } from '../mappers.js';
import { createRepositories } from '../repositories.js';
import { LocationMode, LocationSource } from '../types.js';

export const locationRouter = Router();

locationRouter.use(requireAuth);

function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

locationRouter.post('/samples', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const latitude = parseNumber(req.body?.latitude);
    const longitude = parseNumber(req.body?.longitude);
    const accuracy = parseNumber(req.body?.accuracyM);
    const sourceInput = String(req.body?.source ?? 'gps');
    const modeInput = String(req.body?.locationMode ?? (user.precise_location_enabled ? 'precise' : 'zone'));
    const zoneIdRaw = req.body?.zoneId;

    if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      res.status(400).json({ error: 'latitude and longitude are required.' });
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      res.status(400).json({ error: 'latitude/longitude out of range.' });
      return;
    }

    const locationMode: LocationMode = modeInput === 'precise' || modeInput === 'manual' ? modeInput : 'zone';
    const source: LocationSource = sourceInput === 'manual' || sourceInput === 'app' ? sourceInput : 'gps';
    const zoneId = typeof zoneIdRaw === 'string' && zoneIdRaw.trim() ? zoneIdRaw.trim() : undefined;

    const { locationRepository } = createRepositories(req.accessToken ?? '');
    const sample = await locationRepository.createSample({
      userId: user.id,
      latitude,
      longitude,
      accuracyM: accuracy,
      source,
      locationMode,
      zoneId,
    });

    res.status(201).json({ sample: mapLocationSample(sample) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed creating location sample.' });
  }
});

locationRouter.get('/me/latest', async (req: AuthenticatedRequest, res) => {
  try {
    const { locationRepository } = createRepositories(req.accessToken ?? '');
    const sample = await locationRepository.getLatestSampleForUser(req.user!.id);
    res.json({ sample: sample ? mapLocationSample(sample) : null });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading latest location sample.' });
  }
});

locationRouter.get('/outside', async (req: AuthenticatedRequest, res) => {
  try {
    const { locationRepository, friendshipRepository } = createRepositories(req.accessToken ?? '');
    const rows = await locationRepository.getVisibleLocationFeed(req.user!.id);
    const viewerId = req.user!.id;

    res.json({
      results: await Promise.all(
        rows.map(async ({ user, status, sample }) => ({
          user: {
            id: user.id,
            name: user.full_name,
            grade: user.grade,
            isFriend: user.id === viewerId ? false : await friendshipRepository.areFriends(viewerId, user.id),
          },
          status: mapUserStatus(status),
          sample: sample ? mapLocationSample(sample) : null,
        })),
      ),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading outside location feed.' });
  }
});
