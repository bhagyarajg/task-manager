import { useMemo, useState } from 'react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = 'task-manager-tasks';

const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) as Task[] : [];
};

const saveTasks = (tasks: Task[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [taskText, setTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') return tasks.filter((task) => task.completed);
    if (filter === 'pending') return tasks.filter((task) => !task.completed);
    return tasks;
  }, [tasks, filter]);

  const addTask = () => {
    const trimmedText = taskText.trim();
    if (!trimmedText) return;

    const nextTasks = [
      ...tasks,
      { id: crypto.randomUUID(), title: trimmedText, completed: false },
    ];

    setTasks(nextTasks);
    saveTasks(nextTasks);
    setTaskText('');
  };

  const deleteTask = (id: string) => {
    const nextTasks = tasks.filter((task) => task.id !== id);
    setTasks(nextTasks);
    saveTasks(nextTasks);
  };

  const toggleTask = (id: string) => {
    const nextTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTasks(nextTasks);
    saveTasks(nextTasks);
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Task Manager</p>
            <h1>Track your work with ease</h1>
          </div>
          <div className="stats">
            <span>{tasks.length} tasks</span>
            <span>{tasks.filter((task) => task.completed).length} completed</span>
          </div>
        </header>

        <form
          className="task-form"
          onSubmit={(event) => {
            event.preventDefault();
            addTask();
          }}
        >
          <label htmlFor="task-input" className="sr-only">
            New task description
          </label>
          <input
            id="task-input"
            className="task-input"
            type="text"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="Add a new task"
          />
          <button type="submit" className="primary-button">
            Add task
          </button>
        </form>

        <div className="filter-group" role="group" aria-label="Task filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={filter === 'pending' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={filter === 'completed' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty-state">No tasks found.</li>
          ) : (
            filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                <button
                  type="button"
                  className={`task-check ${task.completed ? 'checked' : ''}`}
                  aria-pressed={task.completed}
                  onClick={() => toggleTask(task.id)}
                >
                  <span>{task.completed ? '✓' : ''}</span>
                </button>
                <span className={task.completed ? 'task-label completed' : 'task-label'}>
                  {task.title}
                </span>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}

export default App;
