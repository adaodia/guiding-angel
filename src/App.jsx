
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('guiding-angel-tasks')) || []
    } catch {
      return []
    }
  })
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('guiding-angel-tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    if (!taskName.trim()) return

    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        name: taskName.trim(),
        dueDate,
        completed: false,
      },
    ])
    setTaskName('')
    setDueDate('')
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const today = new Date().toLocaleDateString('en-CA')
  const pending = tasks.filter(task => !task.completed)
  const completed = tasks.filter(task => task.completed)
  const visibleTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  })

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">✦</div>
        <h2>Guiding Angel</h2>
        <p className="brand-caption">A little help for every day.</p>
        <div className="sidebar-note">
          <span>✧</span>
          <p>One step at a time. You don't have to do everything at once.</p>
        </div>
        <p className="sidebar-footer">YOUR DAY, WITH A LITTLE GUIDANCE</p>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <span className="eyebrow">YOUR PERSONAL PLANNER</span>
          <span className="today-label">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', month: 'short', day: 'numeric'
            })}
          </span>
        </header>

        <section className="welcome">
          <span className="welcome-icon">☀</span>
          <p className="eyebrow">A FRESH START</p>
          <h1>Let's make today<br />a little lighter.</h1>
          <p className="welcome-text">
            Keep track of what matters. Take things at your own pace.
          </p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon">◷</span>
            <p>Still to do</p>
            <strong>{pending.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <p>Completed</p>
            <strong>{completed.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon">♡</span>
            <p>Due today</p>
            <strong>{pending.filter(t => t.dueDate === today).length}</strong>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR LIST</p>
              <h2>What's on your mind?</h2>
            </div>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <input
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              placeholder="Add a task, e.g. Pay electricity bill"
              aria-label="Task name"
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              aria-label="Due date"
            />
            <button type="submit">+ Add task</button>
          </form>

          <div className="list-toolbar">
            <h3>Your tasks <span>{visibleTasks.length}</span></h3>
            <div className="filters">
              {['All', 'Pending', 'Completed'].map(item => (
                <button
                  key={item}
                  className={filter === item ? 'filter active' : 'filter'}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✧</div>
              <h3>{filter === 'Completed' ? 'Nothing completed yet' : 'Your mind can rest a little.'}</h3>
              <p>
                {filter === 'Completed'
                  ? 'Tasks you finish will appear here.'
                  : 'Add your first task above. You can do this.'}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {visibleTasks.map(task => (
                <article className={task.completed ? 'task-row is-done' : 'task-row'} key={task.id}>
                  <button
                    className={task.completed ? 'check checked' : 'check'}
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? 'Mark as pending' : 'Mark as complete'}
                    type="button"
                  >
                    {task.completed ? '✓' : ''}
                  </button>
                  <div className="task-details">
                    <span className="task-title">{task.name}</span>
                    {task.dueDate && (
                      <span className="task-date">
                        Due {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                        {task.dueDate < today && !task.completed ? ' · Overdue' : ''}
                      </span>
                    )}
                  </div>
                  <button className="delete-button" onClick={() => deleteTask(task.id)} type="button">
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>✦</span> Small steps count. Be kind to yourself today.
        </footer>
      </section>
    </main>
  )
}

export default App
