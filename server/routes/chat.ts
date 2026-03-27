import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { mapMessage } from '../mappers.js';
import { createRepositories } from '../repositories.js';

export const chatRouter = Router();

chatRouter.use(requireAuth);

chatRouter.get('/conversations', async (req: AuthenticatedRequest, res) => {
  try {
    const viewerId = req.user!.id;
    const { conversationRepository } = createRepositories(req.accessToken ?? '');
    const conversations = await conversationRepository.getConversationsFor(viewerId);

    const summaries = await Promise.all(
      conversations.map(async (conversation) => {
        const conversationMessages = await conversationRepository.getMessagesFor(conversation.id);
        const lastMessage = [...conversationMessages].sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;

        return {
          id: conversation.id,
          peer: null,
          lastMessage: lastMessage
            ? {
                text: lastMessage.body,
                createdAt: lastMessage.created_at,
                senderId: lastMessage.sender_id,
              }
            : null,
          unreadCount: 0,
          updatedAt: conversation.updated_at,
        };
      }),
    );

    res.json({ conversations: summaries });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading conversations.' });
  }
});

chatRouter.get('/conversations/:conversationId/messages', async (req: AuthenticatedRequest, res) => {
  try {
    const { conversationRepository } = createRepositories(req.accessToken ?? '');
    const conversation = await conversationRepository.getConversationById(req.params.conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    const messages = await conversationRepository.getMessagesFor(conversation.id);
    res.json({ messages: messages.map(mapMessage) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed loading messages.' });
  }
});

chatRouter.post('/conversations/:conversationId/messages', async (req: AuthenticatedRequest, res) => {
  try {
    const body = String(req.body?.text ?? '').trim();
    if (!body) {
      res.status(400).json({ error: 'text is required.' });
      return;
    }

    const { conversationRepository } = createRepositories(req.accessToken ?? '');
    const conversation = await conversationRepository.getConversationById(req.params.conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    const inserted = await conversationRepository.addMessage({
      id: '',
      conversation_id: conversation.id,
      sender_id: req.user!.id,
      body,
      created_at: '',
    });

    res.status(201).json({ message: mapMessage(inserted) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed sending message.' });
  }
});
