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
  // --------------------
  // STATE
  // --------------------
  tasks: [],
  columns: [],
  loading: false,
  error: null,

  // --------------------
  // FETCH INITIAL DATA
  // --------------------
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
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },

  // --------------------
  // ADD TASK (OPTIMISTIC)
  // --------------------
  addTask: async (columnId, title, description) => {
    const tempId = "temp-" + uuidv4();

    const newTask = {
      id: tempId,
      columnId,
      title,
      description,
    };

    // 1️⃣ Optimistic UI update
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    try {
      // 2️⃣ API call
      const savedTask = await addTaskApi(newTask);

      // 3️⃣ Replace temp task with real task
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === tempId ? savedTask : task
        ),
      }));
    } catch (err) {
      // 4️⃣ Rollback on failure
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== tempId),
        error: err.message,
      }));

      throw err;
    }
  },

  // --------------------
  // UPDATE TASK (OPTIMISTIC)
  // --------------------
  updateTask: async (taskId, updatedFields) => {
    const originalTasks = get().tasks;
    const existingTask = originalTasks.find((t) => t.id === taskId);

    if (!existingTask) return;

    const updatedTask = { ...existingTask, ...updatedFields };

    // 1️⃣ Optimistic update
    set({
      tasks: originalTasks.map((task) =>
        task.id === taskId ? updatedTask : task
      ),
    });

    try {
      // 2️⃣ API call
      await updateTaskApi(updatedTask);
    } catch (err) {
      // 3️⃣ Rollback FULL snapshot
      set({
        tasks: originalTasks,
        error: err.message,
      });

      throw err;
    }
  },

  // --------------------
  // DELETE TASK (OPTIMISTIC)
  // --------------------
  deleteTask: async (taskId) => {
    const originalTasks = get().tasks;

    // 1️⃣ Optimistic remove
    set({
      tasks: originalTasks.filter((task) => task.id !== taskId),
    });

    try {
      // 2️⃣ API call
      await deleteTaskApi(taskId);
    } catch (err) {
      // 3️⃣ Rollback
      set({
        tasks: originalTasks,
        error: err.message,
      });

      throw err;
    }
  },

  // --------------------
  // MOVE TASK (OPTIMISTIC)
  // --------------------
  moveTask: async (taskId, destColumnId) => {
    const originalTasks = get().tasks;

    // 1️⃣ Optimistic move
    set({
      tasks: originalTasks.map((task) =>
        task.id === taskId
          ? { ...task, columnId: destColumnId }
          : task
      ),
    });

    try {
      // 2️⃣ API call
      await moveTaskApi(taskId, destColumnId);
    } catch (err) {
      // 3️⃣ Rollback
      set({
        tasks: originalTasks,
        error: err.message,
      });

      throw err;
    }
  },

  // --------------------
  // LOCAL PERSISTENCE
  // --------------------
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
      set(JSON.parse(saved));
    }
  },
}));
