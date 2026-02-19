// src/App.jsx

import { useEffect } from "react";
import { useTaskStore } from "./store/taskStore";
import Column from "./components/Column";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import "./index.css";

function App() {
  const {
    columns,
    loading,
    error,
    fetchInitialData,
    loadPersistedState,
  } = useTaskStore();

  // Load persisted data + fetch initial API data
  useEffect(() => {
    loadPersistedState();
    fetchInitialData();
  }, [fetchInitialData, loadPersistedState]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="app-container">
      <h1 className="app-title">🗂️ Task Board</h1>

      {error && <ErrorMessage message={error} />}

      <section className="board" aria-label="Task Board">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </section>
    </main>
  );
}

export default App;
