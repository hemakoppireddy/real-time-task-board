// src/services/mockApi.js

const API_DELAY = 1000; // Simulate network latency
const FAILURE_RATE = 0.2; // 20% chance of API call failing

let tasks = [
  { id: 'task-1', columnId: 'todo', title: 'Plan project sprint', description: 'Outline epics and user stories.' },
  { id: 'task-2', columnId: 'inprogress', title: 'Develop authentication module', description: 'Implement JWT-based authentication.' }
];
let columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

const simulateApiCall = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error('Network error or API failure.'));
      } else {
        resolve(data);
      }
    }, API_DELAY);
  });
};

export const fetchTasks = () => simulateApiCall(tasks);
export const fetchColumns = () => simulateApiCall(columns);
export const addTaskApi = (task) => simulateApiCall(task).then(res => { tasks.push(res); return res; });
export const updateTaskApi = (updatedTask) => simulateApiCall(updatedTask).then(res => {
  tasks = tasks.map(t => t.id === res.id ? res : t);
  return res;
});
export const deleteTaskApi = (taskId) => simulateApiCall({ id: taskId }).then(() => {
  tasks = tasks.filter(t => t.id !== taskId);
  return { success: true };
});
export const moveTaskApi = (taskId, newColumnId, newPosition) => simulateApiCall({ taskId, newColumnId, newPosition }).then(res => {
  // In a real app, this would update task order and column on backend
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    const [movedTask] = tasks.splice(taskIndex, 1);
    movedTask.columnId = newColumnId;
    // For simplicity, just add to end of new column for now; actual position logic is more complex
    tasks.push(movedTask);
  }
  return res;
});
