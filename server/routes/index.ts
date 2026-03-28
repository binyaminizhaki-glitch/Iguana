import { Router } from 'express';
import { authRouter } from './auth.js';
import { usersRouter } from './users.js';
import { friendsRouter } from './friends.js';
import { statusRouter } from './status.js';
import { eventsRouter } from './events.js';
import { chatRouter } from './chat.js';
import { notificationsRouter } from './notifications.js';
import { metaRouter } from './meta.js';
import { locationRouter } from './location.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/friends', friendsRouter);
apiRouter.use('/status', statusRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/chat', chatRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/meta', metaRouter);
apiRouter.use('/location', locationRouter);
