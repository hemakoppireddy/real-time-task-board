import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import Column from "../components/Column";
import { useTaskStore } from "../store/taskStore";
import * as api from "../services/mockApi";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("Column Integration - Optimistic Add + Rollback", () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      columns: [{ id: "todo", title: "To Do" }],
      loading: false,
      error: null,
    });

    localStorage.clear();
  });

  it("optimistically adds task and rolls back on failure", async () => {
    // Force API failure
    vi.spyOn(api, "addTaskApi").mockRejectedValue(
      new Error("API Failed")
    );

    render(
      <DndProvider backend={HTML5Backend}>
        <Column column={{ id: "todo", title: "To Do" }} />
      </DndProvider>
    );

    const titleInput = screen.getByPlaceholderText(/title/i);
    const descInput = screen.getByPlaceholderText(/description/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(titleInput, {
      target: { value: "Temp Task" },
    });

    fireEvent.change(descInput, {
      target: { value: "Temp Desc" },
    });

    fireEvent.click(addButton);

    // 1️⃣ Optimistic task appears immediately
    expect(screen.getByText("Temp Task")).toBeInTheDocument();

    // 2️⃣ After API failure, it disappears
    await waitFor(() => {
      expect(
        screen.queryByText("Temp Task")
      ).not.toBeInTheDocument();
    });
  });
});