// src/components/TaskCard.jsx

import { useState } from "react";
import { useDrag } from "react-dnd";
import { Pencil, Trash2 } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import EditTaskModal from "./EditTaskModal";

const ITEM_TYPE = "TASK";

function TaskCard({ task }) {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [editing, setEditing] = useState(false);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
    } catch {}
  };

  return (
    <>
      <div
        ref={dragRef}
        className="task-card"
        style={{ opacity: isDragging ? 0.5 : 1 }}
        tabIndex={0}
        role="article"
        aria-label={`Task: ${task.title}`}
      >
        <h3>{task.title}</h3>
        <p>{task.description}</p>

        <div className="task-actions">
          <button onClick={() => setEditing(true)}>
            <Pencil size={14} />
          </button>
          <button onClick={handleDelete}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {editing && (
        <EditTaskModal task={task} onClose={() => setEditing(false)} />
      )}
    </>
  );
}

export default TaskCard;
