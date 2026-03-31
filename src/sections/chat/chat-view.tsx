'use client';

import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';
import { useRef, useState, useEffect } from 'react';
import {
  sendMessage,
  useChatStream,
  useGetChannels,
  useGetMessages,
} from 'src/actions/chat-real';
import {
  Box,
  List,
  Paper,
  Stack,
  Avatar,
  Divider,
  ListItem,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemButton,
} from '@mui/material';

// ----------------------------------------------------------------------

export function ChatView() {
  const { user } = useAuthContext();
  const { channels } = useGetChannels();
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const { messages: initialMessages, messagesMutate } = useGetMessages(activeChannelId);
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const token = (user as any)?.accessToken;

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useChatStream(activeChannelId, token, (newMsgs) => {
    setMessages((prev) => [...prev, ...newMsgs]);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!activeChannelId || !input.trim()) return;
    await sendMessage(activeChannelId, input.trim());
    setInput('');
    messagesMutate();
  };

  const activeChannel = channels.find((c: any) => c.id === activeChannelId);

  const channelName = (c: any) =>
    c.type === 'direct'
      ? c.members?.find((m: any) => m.id !== user?.id)?.name ?? 'Direct'
      : c.name ?? 'Группа';

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
      {/* Channel list */}
      <Paper
        sx={{
          width: 280,
          flexShrink: 0,
          overflow: 'auto',
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Чаты
        </Typography>
        <Divider />
        <List disablePadding>
          {channels.map((c: any) => (
            <ListItem key={c.id} disablePadding>
              <ListItemButton
                selected={c.id === activeChannelId}
                onClick={() => setActiveChannelId(c.id)}
              >
                <ListItemText
                  primary={channelName(c)}
                  secondary={c.lastMessage ?? ''}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Message area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeChannelId ? (
          <>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                {activeChannel ? channelName(activeChannel) : ''}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((msg: any) => {
                const isOwn = msg.sender?.id === user?.id;
                return (
                  <Stack
                    key={msg.id}
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}
                  >
                    {!isOwn && (
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {msg.sender?.name?.[0]}
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        px: 2,
                        py: 1,
                        maxWidth: '70%',
                        bgcolor: isOwn ? 'primary.main' : 'background.neutral',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={isOwn ? 'primary.contrastText' : 'text.primary'}
                      >
                        {msg.body}
                      </Typography>
                    </Paper>
                  </Stack>
                );
              })}
              <div ref={bottomRef} />
            </Box>

            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Написать сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <IconButton color="primary" onClick={handleSend}>
                <Iconify icon="solar:plain-bold" />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography color="text.secondary">Выберите чат</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
