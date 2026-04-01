'use client';

import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';
import {
  createBoard,
  createColumn,
  createTask,
  deleteBoard,
  deleteColumn,
  deleteTask,
  updateTask,
  useGetBoard,
  useGetBoards,
} from 'src/actions/kanban-real';

// ----------------------------------------------------------------------

type Task = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
};

type Column = {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
};

// ----------------------------------------------------------------------
// Sortable task card

function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      elevation={isDragging ? 6 : 1}
      sx={{
        p: 1.5,
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        '&:hover .task-delete': { opacity: 1 },
        position: 'relative',
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-word' }}>
          {task.title}
        </Typography>
        <IconButton
          className="task-delete"
          size="small"
          color="error"
          sx={{ opacity: 0, transition: 'opacity 0.2s', flexShrink: 0, mt: -0.5, mr: -0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
        </IconButton>
      </Stack>
    </Paper>
  );
}

// Ghost card shown in DragOverlay
function TaskCardGhost({ task }: { task: Task }) {
  return (
    <Paper elevation={8} sx={{ p: 1.5, cursor: 'grabbing', width: 248 }}>
      <Typography variant="body2">{task.title}</Typography>
    </Paper>
  );
}

// ----------------------------------------------------------------------
// Column component

function KanbanColumn({
  col,
  onDeleteColumn,
  onDeleteTask,
  onAddTask,
}: {
  col: Column;
  onDeleteColumn: () => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}) {
  const taskIds = col.tasks.map((t) => t.id);

  return (
    <Paper
      sx={{
        width: 280,
        flexShrink: 0,
        p: 2,
        bgcolor: 'background.neutral',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="subtitle1">{col.name}</Typography>
        <Tooltip title="Удалить колонку">
          <IconButton size="small" color="error" onClick={onDeleteColumn}>
            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
          </IconButton>
        </Tooltip>
      </Stack>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Stack spacing={1} sx={{ minHeight: 8 }}>
          {col.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} />
          ))}
        </Stack>
      </SortableContext>

      <Button
        size="small"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={onAddTask}
        sx={{ mt: 0.5, justifyContent: 'flex-start' }}
      >
        Добавить задачу
      </Button>
    </Paper>
  );
}

// ----------------------------------------------------------------------

export function KanbanView() {
  const { user } = useAuthContext();
  const { boards, boardsMutate } = useGetBoards();
  const [boardId, setBoardId] = useState<string | null>(null);
  const { board, boardMutate } = useGetBoard(boardId);

  // Local optimistic columns state for smooth DnD
  const [localColumns, setLocalColumns] = useState<Column[] | null>(null);
  const columns: Column[] = localColumns ?? (board?.columns ?? []);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newColName, setNewColName] = useState('');

  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Reset local columns when board data refreshes
  const syncColumns = () => {
    setLocalColumns(null);
    boardMutate();
  };

  // ---- Board actions ----

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    const res = await createBoard(newBoardName.trim(), newBoardDesc.trim() || undefined);
    setCreateBoardOpen(false);
    setNewBoardName('');
    setNewBoardDesc('');
    boardsMutate();
    setBoardId((res.data as any).board.id);
  };

  const handleDeleteBoard = async () => {
    if (!boardId) return;
    if (!window.confirm('Удалить доску и все её данные?')) return;
    await deleteBoard(boardId);
    setBoardId(null);
    setLocalColumns(null);
    boardsMutate();
  };

  // ---- Column actions ----

  const handleAddColumn = async () => {
    if (!boardId || !newColName.trim()) return;
    await createColumn(boardId, newColName.trim());
    setNewColName('');
    syncColumns();
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!window.confirm('Удалить колонку со всеми задачами?')) return;
    await deleteColumn(columnId);
    syncColumns();
  };

  // ---- Task actions ----

  const handleAddTask = async (columnId: string) => {
    // eslint-disable-next-line no-alert
    const title = window.prompt('Название задачи:');
    if (!title?.trim()) return;
    await createTask(columnId, title.trim());
    syncColumns();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    syncColumns();
  };

  // ---- DnD handlers ----

  const findColumn = (taskId: string) =>
    columns.find((col) => col.tasks.some((t) => t.id === taskId));

  const handleDragStart = (event: DragStartEvent) => {
    const col = findColumn(event.active.id as string);
    const task = col?.tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
    // Snapshot local columns for optimistic updates
    if (!localColumns) setLocalColumns(board?.columns ?? []);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColIdx = columns.findIndex((col) => col.tasks.some((t) => t.id === active.id));
    if (activeColIdx === -1) return;

    // Check if over a column id directly (dropping on empty column)
    const overColIdx = columns.findIndex((col) => col.id === over.id);
    // Or over a task
    const overTaskColIdx = columns.findIndex((col) => col.tasks.some((t) => t.id === over.id));

    const targetColIdx = overColIdx !== -1 ? overColIdx : overTaskColIdx;
    if (targetColIdx === -1) return;

    if (activeColIdx === targetColIdx) {
      // Reorder within same column
      const col = columns[activeColIdx];
      const oldIdx = col.tasks.findIndex((t) => t.id === active.id);
      const newIdx = col.tasks.findIndex((t) => t.id === over.id);
      if (oldIdx !== newIdx && newIdx !== -1) {
        setLocalColumns((prev) => {
          const cols = prev ? [...prev] : [...columns];
          const newTasks = arrayMove(cols[activeColIdx].tasks, oldIdx, newIdx);
          cols[activeColIdx] = { ...cols[activeColIdx], tasks: newTasks };
          return cols;
        });
      }
    } else {
      // Move task to another column
      setLocalColumns((prev) => {
        const cols = prev ? prev.map((c) => ({ ...c, tasks: [...c.tasks] })) : columns.map((c) => ({ ...c, tasks: [...c.tasks] }));
        const task = cols[activeColIdx].tasks.find((t) => t.id === active.id)!;
        cols[activeColIdx].tasks = cols[activeColIdx].tasks.filter((t) => t.id !== active.id);

        const overTaskIdx = cols[targetColIdx].tasks.findIndex((t) => t.id === over.id);
        if (overTaskIdx !== -1) {
          cols[targetColIdx].tasks.splice(overTaskIdx, 0, task);
        } else {
          cols[targetColIdx].tasks.push(task);
        }
        return cols;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const finalColIdx = columns.findIndex((col) => col.tasks.some((t) => t.id === active.id));
    if (finalColIdx === -1) return;

    const finalCol = columns[finalColIdx];
    const taskIdx = finalCol.tasks.findIndex((t) => t.id === active.id);
    const targetColumnId = finalCol.id;
    const position = taskIdx;

    await updateTask(active.id as string, { columnId: targetColumnId, position });
    setLocalColumns(null);
    boardMutate();
  };

  // ----------------------------------------------------------------------

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Typography variant="h4">Kanban</Typography>

        <Select
          value={boardId ?? ''}
          onChange={(e) => { setBoardId(e.target.value || null); setLocalColumns(null); }}
          displayEmpty
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Выберите доску</MenuItem>
          {boards.map((b: any) => (
            <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
          ))}
        </Select>

        {boardId && (
          <Tooltip title="Удалить доску">
            <IconButton color="error" size="small" onClick={handleDeleteBoard}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Button
          variant="contained"
          size="small"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setCreateBoardOpen(true)}
        >
          Новая доска
        </Button>
      </Stack>

      {/* Create board dialog */}
      <Dialog open={createBoardOpen} onClose={() => setCreateBoardOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Создать доску</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateBoard(); }}
              autoFocus
            />
            <TextField
              label="Описание (необязательно)"
              value={newBoardDesc}
              onChange={(e) => setNewBoardDesc(e.target.value)}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateBoardOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateBoard} disabled={!newBoardName.trim()}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Board */}
      {board && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, alignItems: 'flex-start' }}>
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                col={col}
                onDeleteColumn={() => handleDeleteColumn(col.id)}
                onDeleteTask={handleDeleteTask}
                onAddTask={() => handleAddTask(col.id)}
              />
            ))}

            {/* Add column */}
            <Paper sx={{ width: 280, flexShrink: 0, p: 2, bgcolor: 'background.neutral' }}>
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Название колонки"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddColumn(); }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleAddColumn}
                  disabled={!newColName.trim()}
                >
                  Добавить колонку
                </Button>
              </Stack>
            </Paper>
          </Box>

          <DragOverlay>
            {activeTask ? <TaskCardGhost task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {!board && boardId && (
        <Typography color="text.secondary">Загрузка доски...</Typography>
      )}
      {!boardId && (
        <Typography color="text.secondary">Выберите доску или создайте новую</Typography>
      )}
    </Box>
  );
}
