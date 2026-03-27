import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { EventItem } from '../types.js';
import { mapEvent } from '../mappers.js';
import { createRepositories } from '../repositories.js';

export const eventsRouter = Router();

eventsRouter.use(requireAuth);

eventsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { eventRepository } = createRepositories(req.accessToken ?? '');
    res.json({ events: (await eventRepository.getAllEvents()).map(mapEvent) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading events.' });
  }
});

eventsRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const title = String(req.body?.title ?? '').trim();
    const subject = String(req.body?.subject ?? '').trim();
    const location = String(req.body?.location ?? '').trim();
    const starts_at = String(req.body?.startsAt ?? '');
    const ends_at = String(req.body?.endsAt ?? '');
    const kind: EventItem['kind'] = req.body?.kind === 'event' ? 'event' : 'study';

    if (!title || !subject || !location || !starts_at || !ends_at) {
      res.status(400).json({ error: 'title, subject, location, startsAt, endsAt are required.' });
      return;
    }

    const { eventRepository } = createRepositories(req.accessToken ?? '');
    const event = await eventRepository.createEventForUser({
      creatorId: req.user!.id,
      kind,
      title,
      subject,
      location,
      startsAt: starts_at,
      endsAt: ends_at,
      maxParticipants: Number(req.body?.maxParticipants ?? 12),
    });

    res.status(201).json({ event: mapEvent(event) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed creating event.' });
  }
});

eventsRouter.post('/:eventId/join', async (req: AuthenticatedRequest, res) => {
  try {
    const { eventRepository } = createRepositories(req.accessToken ?? '');
    const result = await eventRepository.joinEvent(req.params.eventId, req.user!.id);
    if (result.error === 'full') {
      res.status(409).json({ error: 'Event is full.' });
      return;
    }

    if (result.error === 'not_found' || !result.event) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    res.json({ event: mapEvent(result.event) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed joining event.' });
  }
});

eventsRouter.post('/:eventId/leave', async (req: AuthenticatedRequest, res) => {
  try {
    const { eventRepository } = createRepositories(req.accessToken ?? '');
    const event = await eventRepository.leaveEvent(req.params.eventId, req.user!.id);
    if (!event) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    res.json({ event: mapEvent(event) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed leaving event.' });
  }
});
