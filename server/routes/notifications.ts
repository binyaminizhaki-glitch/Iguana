import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { mapNotification } from '../mappers.js';
import { createRepositories } from '../repositories.js';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { notificationRepository } = createRepositories(req.accessToken ?? '');
    const items = await notificationRepository.getNotificationsFor(userId);
    res.json({ notifications: items.map(mapNotification) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading notifications.' });
  }
});

notificationsRouter.post('/:notificationId/read', async (req: AuthenticatedRequest, res) => {
  try {
    const { notificationRepository } = createRepositories(req.accessToken ?? '');
    const item = await notificationRepository.markAsRead(req.params.notificationId);
    if (!item) {
      res.status(404).json({ error: 'Notification not found.' });
      return;
    }

    res.json({ notification: mapNotification(item) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed marking notification as read.' });
  }
});
