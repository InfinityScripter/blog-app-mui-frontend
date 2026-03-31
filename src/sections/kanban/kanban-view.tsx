'use client';

import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import {
  Box,
  Paper,
  Stack,
  Select,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  createTask,
  updateTask,
  useGetBoard,
  useGetBoards,
  createColumn,
} from 'src/actions/kanban-real';

// ----------------------------------------------------------------------

export function KanbanView() {
  const { boards } = useGetBoards();
  const [boardId, setBoardId] = useState<string | null>(null);
  const { board, boardMutate } = useGetBoard(boardId);
  const [newColName, setNewColName] = useState('');
  const [dragging, setDragging] = useState<{ taskId: string; fromColumnId: string } | null>(null);

  const handleAddColumn = async () => {
    if (!boardId || !newColName.trim()) return;
    await createColumn(boardId, newColName.trim());
    setNewColName('');
    boardMutate();
  };

  const handleAddTask = async (columnId: string) => {
    // eslint-disable-next-line no-alert
    const title = window.prompt('Название задачи:');
    if (!title) return;
    await createTask(columnId, title);
    boardMutate();
  };

  const handleDrop = async (targetColumnId: string, position: number) => {
    if (!dragging) return;
    await updateTask(dragging.taskId, { columnId: targetColumnId, position });
    setDragging(null);
    boardMutate();
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Typography variant="h4">Kanban</Typography>
        <Select
          value={boardId ?? ''}
          onChange={(e) => setBoardId(e.target.value || null)}
          displayEmpty
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Выберите доску</MenuItem>
          {boards.map((b: any) => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {board && (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {board.columns.map((col: any) => (
            <Paper
              key={col.id}
              sx={{ width: 280, flexShrink: 0, p: 2, bgcolor: 'background.neutral' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id, col.tasks.length)}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {col.name}
              </Typography>
              <Stack spacing={1}>
                {col.tasks.map((task: any) => (
                  <Paper
                    key={task.id}
                    draggable
                    onDragStart={() => setDragging({ taskId: task.id, fromColumnId: col.id })}
                    sx={{ p: 1.5, cursor: 'grab' }}
                  >
                    <Typography variant="body2">{task.title}</Typography>
                  </Paper>
                ))}
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => handleAddTask(col.id)}
                sx={{ mt: 1 }}
              >
                Добавить задачу
              </Button>
            </Paper>
          ))}

          <Paper sx={{ width: 280, flexShrink: 0, p: 2, bgcolor: 'background.neutral' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Название колонки"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddColumn();
              }}
            />
            <Button size="small" onClick={handleAddColumn} sx={{ mt: 1 }}>
              Добавить колонку
            </Button>
          </Paper>
        </Box>
      )}

      {!board && boardId && (
        <Typography color="text.secondary">Загрузка доски...</Typography>
      )}

      {!boardId && <Typography color="text.secondary">Выберите доску выше</Typography>}
    </Box>
  );
}
