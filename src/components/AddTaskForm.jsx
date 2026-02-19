// src/components/AddTaskForm.jsx

import { useState } from "react";
import { useTaskStore } from "../store/taskStore";

function AddTaskForm({ columnId }) {
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);

    try {
      await addTask(columnId, title, description);
      setTitle("");
      setDescription("");
    } catch {
      // Error handled globally
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <label>
        <span className="sr-only">Task title</span>
        <input
          type="text"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        <span className="sr-only">Task description</span>
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default AddTaskForm;
