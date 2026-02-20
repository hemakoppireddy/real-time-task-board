// src/store/taskStore.js

import { create } from "zustand";
import {
  fetchTasks,
  fetchColumns,
  addTaskApi,
  updateTaskApi,
  deleteTaskApi,
  moveTaskApi,
} from "../services/mockApi";
import { v4 as uuidv4 } from "uuid";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  columns: [],
  loading: false,
  error: null,

  // =============================
  // FETCH INITIAL DATA
  // =============================
  fetchInitialData: async () => {
    set({ loading: true, error: null });

    try {
      const [tasksData, columnsData] = await Promise.all([
        fetchTasks(),
        fetchColumns(),
      ]);

      set({
        tasks: tasksData,
        columns: columnsData,
        loading: false,
      });

      get().persistState();
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },

  // =============================
  // ADD TASK (Optimistic)
  // =============================
  addTask: async (columnId, title, description) => {
    const tempId = "temp-" + uuidv4();

    const newTask = {
      id: tempId,
      columnId,
      title,
      description,
    };

    // Optimistic UI update
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    try {
      const savedTask = await addTaskApi(newTask);

      // Replace temp task with saved task
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === tempId ? savedTask : t
        ),
      }));

      get().persistState();
    } catch (err) {
      // Rollback
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== tempId),
        error: err.message,
      }));

      throw err;
    }
  },

  // =============================
  // UPDATE TASK (Optimistic)
  // =============================
  updateTask: async (taskId, updatedFields) => {
    const originalTasks = get().tasks;
    const originalTask = originalTasks.find(
      (t) => t.id === taskId
    );

    if (!originalTask) return;

    const updatedTask = { ...originalTask, ...updatedFields };

    // Optimistic update
    set({
      tasks: originalTasks.map((t) =>
        t.id === taskId ? updatedTask : t
      ),
    });

    try {
      await updateTaskApi(updatedTask);
      get().persistState();
    } catch (err) {
      // Rollback
      set({
        tasks: originalTasks,
        error: err.message,
      });

      throw err;
    }
  },

  // =============================
  // DELETE TASK (Optimistic)
  // =============================
  deleteTask: async (taskId) => {
    const originalTasks = get().tasks;

    // Optimistic remove
    set({
      tasks: originalTasks.filter((t) => t.id !== taskId),
    });

    try {
      await deleteTaskApi(taskId);
      get().persistState();
    } catch (err) {
      // Rollback
      set({
        tasks: originalTasks,
        error: err.message,
      });

      throw err;
    }
  },

  // =============================
  // MOVE TASK (Optimistic)
  // =============================
  moveTask: async (taskId, destColumnId) => {
    const originalTasks = get().tasks;

    // Optimistic move
    set({
      tasks: originalTasks.map((t) =>
        t.id === taskId
          ? { ...t, columnId: destColumnId }
          : t
      ),
    });

    try {
      await moveTaskApi(taskId, destColumnId);
      get().persistState();
    } catch (err) {
      // Rollback
      set({
        tasks: originalTasks,
        error: err.message,
      });

      throw err;
    }
  },

  // =============================
  // LOCAL PERSISTENCE
  // =============================
  persistState: () => {
    const { tasks, columns } = get();
    localStorage.setItem(
      "taskBoardState",
      JSON.stringify({ tasks, columns })
    );
  },

  loadPersistedState: () => {
    const saved = localStorage.getItem("taskBoardState");
    if (saved) {
      const parsed = JSON.parse(saved);
      set({
        tasks: parsed.tasks || [],
        columns: parsed.columns || [],
      });
    }
  },
}));