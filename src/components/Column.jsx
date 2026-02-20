// src/components/Column.jsx

import { useDrop } from "react-dnd";
import { useTaskStore } from "../store/taskStore";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";

const ITEM_TYPE = "TASK";

function Column({ column }) {
  const tasks = useTaskStore((state) => state.tasks);
  const moveTask = useTaskStore((state) => state.moveTask);

  const columnTasks = tasks.filter((task) => task.columnId === column.id);

  const [, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: async (item) => {
      try {
        await moveTask(item.id, column.id);
      } catch {
        // Rollback handled in store
      }
    },
  }));

  return (
    <div
      ref={dropRef}
      className="column"
      role="region"
      aria-labelledby={column.id}
    >
      <h2 id={column.id} className="column-title">
        {column.title}
      </h2>

      <div className="task-list">
        {columnTasks.length === 0 ? (
          <div className="empty-state">No tasks yet</div>
        ) : (
          columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      <AddTaskForm columnId={column.id} />
    </div>
  );
}

export default Column;
