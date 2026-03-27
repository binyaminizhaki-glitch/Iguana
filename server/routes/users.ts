import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { mapUser } from '../mappers.js';
import { createRepositories } from '../repositories.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

const allowedVisibility = ['friends', 'grade', 'all'] as const;

usersRouter.get('/me', async (req: AuthenticatedRequest, res) => {
  try {
    const { userRepository } = createRepositories(req.accessToken ?? '');
    const user = await userRepository.getUserById(req.user!.id);
    res.json({ user: user ? mapUser(user) : null });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading current user.' });
  }
});

usersRouter.patch('/me/privacy', async (req: AuthenticatedRequest, res) => {
  try {
    const { userRepository } = createRepositories(req.accessToken ?? '');
    const user = await userRepository.getUserById(req.user!.id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const default_visibility = req.body?.defaultVisibility;
    const precise_location_enabled = req.body?.preciseLocationEnabled;

    const updates: Partial<typeof user> = {};
    if (default_visibility && ['friends', 'grade', 'all'].includes(default_visibility)) {
      updates.default_visibility = default_visibility;
    }
    if (typeof precise_location_enabled === 'boolean') {
      updates.precise_location_enabled = precise_location_enabled;
    }

    await userRepository.updateUser(user.id, updates);
    const updatedUser = await userRepository.getUserById(user.id);
    res.json({ user: updatedUser ? mapUser(updatedUser) : null });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed updating privacy settings.' });
  }
});

usersRouter.patch('/me/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const { userRepository } = createRepositories(req.accessToken ?? '');
    const user = await userRepository.getUserById(req.user!.id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const fullNameRaw = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const gradeRaw = typeof req.body?.grade === 'string' ? req.body.grade.trim() : '';
    const defaultVisibilityRaw = req.body?.defaultVisibility;
    const avatarUrlRaw = req.body?.avatarUrl;
    const preciseLocationRaw = req.body?.preciseLocationEnabled;

    const fieldErrors: Record<string, string> = {};

    if (fullNameRaw.length < 2) {
      fieldErrors.fullName = 'Full name must include at least 2 characters.';
    }

    if (!gradeRaw || gradeRaw === 'unknown') {
      fieldErrors.grade = 'Grade is required.';
    }

    if (!allowedVisibility.includes(defaultVisibilityRaw)) {
      fieldErrors.defaultVisibility = 'defaultVisibility must be one of friends, grade, or all.';
    }

    if (typeof preciseLocationRaw !== 'undefined' && typeof preciseLocationRaw !== 'boolean') {
      fieldErrors.preciseLocationEnabled = 'preciseLocationEnabled must be a boolean when provided.';
    }

    if (
      typeof avatarUrlRaw !== 'undefined' &&
      avatarUrlRaw !== null &&
      typeof avatarUrlRaw !== 'string'
    ) {
      fieldErrors.avatarUrl = 'avatarUrl must be a string or null when provided.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      res.status(400).json({
        error: 'Invalid profile payload.',
        fieldErrors,
      });
      return;
    }

    const updates: Partial<typeof user> = {
      full_name: fullNameRaw,
      grade: gradeRaw,
      default_visibility: defaultVisibilityRaw,
    };

    if (typeof avatarUrlRaw === 'string') {
      updates.avatar_url = avatarUrlRaw.trim() || undefined;
    } else if (avatarUrlRaw === null) {
      updates.avatar_url = undefined;
    }

    if (typeof preciseLocationRaw === 'boolean') {
      updates.precise_location_enabled = preciseLocationRaw;
    }

    await userRepository.updateUser(user.id, updates);
    const updatedUser = await userRepository.getUserById(user.id);
    res.json({ user: updatedUser ? mapUser(updatedUser) : null });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed updating user profile.' });
  }
});
