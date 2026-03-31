'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useGetEvents, createEvent, deleteEvent } from 'src/actions/calendar-real';

// ----------------------------------------------------------------------

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const EVENT_COLORS: Record<string, string> = {
  primary: '#1976d2',
  secondary: '#9c27b0',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
};

// ----------------------------------------------------------------------

export function CalendarView() {
  const { user } = useAuthContext();
  const { events, eventsMutate } = useGetEvents();
  const [current, setCurrent] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    type: 'personal',
    color: 'primary',
  });

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday = index 0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = Array<null>(startOffset)
    .fill(null)
    .concat(Array.from({ length: lastDay.getDate() }, (_, i) => i + 1));
  while (days.length % 7 !== 0) days.push(null);

  const getEventsForDay = (day: number) => {
    const d = new Date(year, month, day);
    return events.filter((e: any) => {
      const s = new Date(e.start);
      const en = new Date(e.end);
      return (
        d >= new Date(s.getFullYear(), s.getMonth(), s.getDate()) &&
        d <= new Date(en.getFullYear(), en.getMonth(), en.getDate())
      );
    });
  };

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;
    await createEvent({ ...newEvent });
    setOpen(false);
    setNewEvent({ title: '', start: '', end: '', type: 'personal', color: 'primary' });
    eventsMutate();
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    eventsMutate();
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Typography variant="h4">Календарь</Typography>
        <Box sx={{ flex: 1 }} />
        <Button onClick={() => setCurrent(new Date(year, month - 1, 1))}>←</Button>
        <Typography variant="h6">
          {MONTH_NAMES[month]} {year}
        </Typography>
        <Button onClick={() => setCurrent(new Date(year, month + 1, 1))}>→</Button>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Событие
        </Button>
      </Stack>

      <Grid container columns={7} sx={{ border: 1, borderColor: 'divider' }}>
        {DAY_NAMES.map((d) => (
          <Grid key={d} size={1} sx={{ p: 1, borderBottom: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" fontWeight="bold">
              {d}
            </Typography>
          </Grid>
        ))}
        {days.map((day, idx) => (
          <Grid
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            size={1}
            sx={{
              minHeight: 100,
              p: 0.5,
              border: 0.5,
              borderColor: 'divider',
              bgcolor: day ? 'background.paper' : 'background.neutral',
            }}
          >
            {day && (
              <>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {day}
                </Typography>
                {getEventsForDay(day).map((e: any) => (
                  <Chip
                    key={e.id}
                    label={e.title}
                    size="small"
                    sx={{
                      mb: 0.5,
                      bgcolor: EVENT_COLORS[e.color] ?? EVENT_COLORS.primary,
                      color: 'white',
                      fontSize: '0.65rem',
                      height: 18,
                    }}
                    onDelete={
                      e.createdBy === user?.id ? () => handleDelete(e.id) : undefined
                    }
                  />
                ))}
              </>
            )}
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Новое событие</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={newEvent.title}
              onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
            />
            <TextField
              label="Начало"
              type="datetime-local"
              slotProps={{ inputLabel: { shrink: true } }}
              value={newEvent.start}
              onChange={(e) => setNewEvent((p) => ({ ...p, start: e.target.value }))}
            />
            <TextField
              label="Конец"
              type="datetime-local"
              slotProps={{ inputLabel: { shrink: true } }}
              value={newEvent.end}
              onChange={(e) => setNewEvent((p) => ({ ...p, end: e.target.value }))}
            />
            <FormControl>
              <InputLabel>Тип</InputLabel>
              <Select
                value={newEvent.type}
                label="Тип"
                onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value }))}
              >
                <MenuItem value="personal">Личное</MenuItem>
                <MenuItem value="public">Публичное</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Цвет</InputLabel>
              <Select
                value={newEvent.color}
                label="Цвет"
                onChange={(e) => setNewEvent((p) => ({ ...p, color: e.target.value }))}
              >
                {Object.keys(EVENT_COLORS).map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
