import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { mapFriendRequest, mapUser } from '../mappers.js';
import { createRepositories } from '../repositories.js';

export const friendsRouter = Router();

friendsRouter.use(requireAuth);

friendsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { friendshipRepository } = createRepositories(req.accessToken ?? '');
    const friends = await friendshipRepository.getFriendsOf(userId);
    res.json({ friends: friends.map(mapUser) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading friends.' });
  }
});

friendsRouter.get('/requests', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { friendshipRepository } = createRepositories(req.accessToken ?? '');
    const { incoming, outgoing } = await friendshipRepository.getFriendRequests(userId);
    res.json({
      incoming: incoming.map(mapFriendRequest),
      outgoing: outgoing.map(mapFriendRequest),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading friend requests.' });
  }
});

friendsRouter.post('/requests', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const toUserId = String(req.body?.toUserId ?? '');
    if (!toUserId) {
      res.status(400).json({ error: 'toUserId is required.' });
      return;
    }

    const { friendshipRepository } = createRepositories(req.accessToken ?? '');
    const request = await friendshipRepository.createFriendRequest(userId, toUserId);
    res.status(201).json({ request: mapFriendRequest(request) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed creating friend request.' });
  }
});

friendsRouter.post('/requests/:requestId/accept', async (req: AuthenticatedRequest, res) => {
  try {
    const { friendshipRepository } = createRepositories(req.accessToken ?? '');
    const accepted = await friendshipRepository.acceptFriendRequest(req.params.requestId);
    if (!accepted) {
      res.status(404).json({ error: 'Pending request not found.' });
      return;
    }
    res.json({ request: mapFriendRequest(accepted) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed accepting friend request.' });
  }
});

friendsRouter.post('/requests/:requestId/reject', async (req: AuthenticatedRequest, res) => {
  try {
    const { friendshipRepository } = createRepositories(req.accessToken ?? '');
    const rejected = await friendshipRepository.rejectFriendRequest(req.params.requestId);
    if (!rejected) {
      res.status(404).json({ error: 'Pending request not found.' });
      return;
    }
    res.json({ request: mapFriendRequest(rejected) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed rejecting friend request.' });
  }
});
