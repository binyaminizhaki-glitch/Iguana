import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { UserStatus } from '../types.js';
import { mapUserStatus } from '../mappers.js';
import { createRepositories } from '../repositories.js';

export const statusRouter = Router();

statusRouter.use(requireAuth);

statusRouter.post('/activate', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const locationLabel = String(req.body?.locationLabel ?? '').trim();
    const note = String(req.body?.note ?? '').trim();
    const visibilityInput = String(req.body?.visibility ?? user.default_visibility);
    const visibility: UserStatus['visibility'] =
      visibilityInput === 'all' || visibilityInput === 'grade' ? visibilityInput : 'friends';
    const durationMinutes = Number(req.body?.durationMinutes ?? 15);

    if (!locationLabel) {
      res.status(400).json({ error: 'locationLabel is required.' });
      return;
    }

    const { statusRepository } = createRepositories(req.accessToken ?? '');
    const { status, created } = await statusRepository.activateStatus({
      userId: user.id,
      locationLabel,
      note,
      visibility,
      durationMinutes,
    });
    res.status(created ? 201 : 200).json({ status: mapUserStatus(status) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed activating status.' });
  }
});

statusRouter.post('/deactivate', async (req: AuthenticatedRequest, res) => {
  try {
    const { statusRepository } = createRepositories(req.accessToken ?? '');
    const status = await statusRepository.deactivateStatus(req.user!.id);
    if (!status) {
      res.status(404).json({ error: 'No active status found.' });
      return;
    }
    res.json({ status: mapUserStatus(status) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed deactivating status.' });
  }
});

statusRouter.patch('/extend', async (req: AuthenticatedRequest, res) => {
  try {
    const addMinutes = Number(req.body?.addMinutes ?? 10);
    const { statusRepository } = createRepositories(req.accessToken ?? '');
    const status = await statusRepository.extendStatus(req.user!.id, addMinutes);
    if (!status) {
      res.status(404).json({ error: 'No active status found.' });
      return;
    }

    res.json({ status: mapUserStatus(status) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed extending status.' });
  }
});

statusRouter.get('/outside', async (req: AuthenticatedRequest, res) => {
  try {
    const { statusRepository } = createRepositories(req.accessToken ?? '');
    const visible = (await statusRepository.getVisibleStatusesFor(req.user!.id)).map(({ status, user }) => ({
      status: mapUserStatus(status),
      user: {
        id: user.id,
        name: user.full_name,
        grade: user.grade,
      },
    }));

    res.json({ results: visible });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading outside statuses.' });
  }
});
