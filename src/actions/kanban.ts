import { useMemo } from "react";
import useSWR, { mutate } from "swr";
import axios, { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

const enableServer = false;

const KANBAN_ENDPOINT = endpoints.kanban;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignee: string[];
  due: Date | string | null;
  description: string;
  attachments: string[];
  comments: string[];
  completed: boolean;
  [key: string]: unknown;
}

interface Column {
  id: string;
  name: string;
  taskIds: string[];
  [key: string]: unknown;
}

interface Board {
  tasks: Record<string, Task[]>;
  columns: Column[];
}

interface BoardResponse {
  board: Board;
}

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR<BoardResponse>(
    KANBAN_ENDPOINT,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(() => {
    const tasks = data?.board?.tasks ?? {};
    const columns = data?.board?.columns ?? [];

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !columns.length,
    };
  }, [
    data?.board?.columns,
    data?.board?.tasks,
    error,
    isLoading,
    isValidating,
  ]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData: Column): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnData };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "create-column" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // add new column in board.columns
      const columns = [...board.columns, columnData];

      // add new task in board.tasks
      const tasks = { ...board.tasks, [columnData.id]: [] };

      return {
        ...currentData,
        board: { ...board, columns, tasks },
      } as BoardResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function updateColumn(
  columnId: string,
  columnName: string,
): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, columnName };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "update-column" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      const columns = board.columns.map((column) =>
        column.id === columnId
          ? {
              // Update data when found
              ...column,
              name: columnName,
            }
          : column,
      );

      return { ...currentData, board: { ...board, columns } } as BoardResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function moveColumn(updateColumns: Column[]): Promise<void> {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      return {
        ...currentData,
        board: { ...board, columns: updateColumns },
      } as BoardResponse;
    },
    false,
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateColumns };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "move-column" },
    });
  }
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId: string): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "clear-column" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // remove all tasks in column
      const tasks = { ...board.tasks, [columnId]: [] };

      return { ...currentData, board: { ...board, tasks } } as BoardResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId: string): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "delete-column" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // delete column in board.columns
      const columns = board.columns.filter((column) => column.id !== columnId);

      // delete tasks by column deleted
      const tasks = Object.keys(board.tasks)
        .filter((key) => key !== columnId)
        .reduce((obj: Record<string, Task[]>, key) => {
          obj[key] = board.tasks[key];
          return obj;
        }, {});

      return {
        ...currentData,
        board: { ...board, columns, tasks },
      } as BoardResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function createTask(
  columnId: string,
  taskData: Task,
): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "create-task" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // add task in board.tasks
      const tasks = {
        ...board.tasks,
        [columnId]: [taskData, ...(board.tasks[columnId] ?? [])],
      };

      return { ...currentData, board: { ...board, tasks } } as BoardResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function updateTask(
  columnId: string,
  taskData: Task,
): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "update-task" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // tasks in column
      const tasksInColumn = board.tasks[columnId] ?? [];

      // find and update task
      const updateTasks = tasksInColumn.map((task) =>
        task.id === taskData.id
          ? {
              // Update data when found
              ...task,
              ...taskData,
            }
          : task,
      );

      const tasks = { ...board.tasks, [columnId]: updateTasks };

      return { ...currentData, board: { ...board, tasks } } as BoardResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function moveTask(
  updateTasks: Record<string, Task[]>,
): Promise<void> {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // update board.tasks
      const tasks = updateTasks;

      return { ...currentData, board: { ...board, tasks } } as BoardResponse;
    },
    false,
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateTasks };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "move-task" },
    });
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(
  columnId: string,
  taskId: string,
): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskId };
    await axios.post(KANBAN_ENDPOINT, data, {
      params: { endpoint: "delete-task" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardResponse | undefined) => {
      const board = currentData?.board;
      if (!board) return currentData;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: (board.tasks[columnId] ?? []).filter(
          (task) => task.id !== taskId,
        ),
      };

      return { ...currentData, board: { ...board, tasks } } as BoardResponse;
    },
    false,
  );
}
