import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTaskStore } from "../store/taskStore";
import * as api from "../services/mockApi";

describe("Task Store - Optimistic Updates", () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      columns: [],
      loading: false,
      error: null,
    });

    localStorage.clear();
  });

  it("adds task optimistically and confirms on success", async () => {
    vi.spyOn(api, "addTaskApi").mockResolvedValue({
      id: "task-100",
      columnId: "todo",
      title: "Test Task",
      description: "Test Description",
    });

    await useTaskStore.getState().addTask(
      "todo",
      "Test Task",
      "Test Description"
    );

    const tasks = useTaskStore.getState().tasks;

    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe("task-100");
  });

  it("rolls back task if API fails", async () => {
    vi.spyOn(api, "addTaskApi").mockRejectedValue(
      new Error("API failure")
    );

    await expect(
      useTaskStore.getState().addTask(
        "todo",
        "Fail Task",
        "Should Rollback"
      )
    ).rejects.toThrow();

    const tasks = useTaskStore.getState().tasks;

    expect(tasks.length).toBe(0);
  });

  it("updates task optimistically and confirms", async () => {
    useTaskStore.setState({
      tasks: [
        {
          id: "task-1",
          columnId: "todo",
          title: "Old",
          description: "Old Desc",
        },
      ],
    });

    vi.spyOn(api, "updateTaskApi").mockResolvedValue({});

    await useTaskStore
      .getState()
      .updateTask("task-1", { title: "Updated" });

    const updatedTask =
      useTaskStore.getState().tasks[0];

    expect(updatedTask.title).toBe("Updated");
  });

  it("rolls back update if API fails", async () => {
    useTaskStore.setState({
      tasks: [
        {
          id: "task-1",
          columnId: "todo",
          title: "Old",
          description: "Old Desc",
        },
      ],
    });

    vi.spyOn(api, "updateTaskApi").mockRejectedValue(
      new Error("Update Failed")
    );

    await expect(
      useTaskStore
        .getState()
        .updateTask("task-1", { title: "New" })
    ).rejects.toThrow();

    const task =
      useTaskStore.getState().tasks[0];

    expect(task.title).toBe("Old");
  });

  it("deletes task optimistically and confirms", async () => {
    useTaskStore.setState({
      tasks: [
        {
          id: "task-1",
          columnId: "todo",
          title: "Delete Me",
          description: "Test",
        },
      ],
    });

    vi.spyOn(api, "deleteTaskApi").mockResolvedValue({});

    await useTaskStore
      .getState()
      .deleteTask("task-1");

    expect(
      useTaskStore.getState().tasks.length
    ).toBe(0);
  });

  it("rolls back delete if API fails", async () => {
    useTaskStore.setState({
      tasks: [
        {
          id: "task-1",
          columnId: "todo",
          title: "Delete Me",
          description: "Test",
        },
      ],
    });

    vi.spyOn(api, "deleteTaskApi").mockRejectedValue(
      new Error("Delete Failed")
    );

    await expect(
      useTaskStore
        .getState()
        .deleteTask("task-1")
    ).rejects.toThrow();

    expect(
      useTaskStore.getState().tasks.length
    ).toBe(1);
  });
});