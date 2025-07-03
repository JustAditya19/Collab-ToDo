import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './KanbanBoard.css';

const initialTasks = [
  { id: 1, title: 'Task A', status: 'Todo', priority: 'High', assignedTo: 'Alice' },
  { id: 2, title: 'Task B', status: 'In Progress', priority: 'Medium', assignedTo: 'Bob' },
  { id: 3, title: 'Task C', status: 'Done', priority: 'Low', assignedTo: 'Charlie' },
  { id: 4, title: 'Task D', status: 'Todo', priority: 'High', assignedTo: 'Alice' },
];

const KanbanBoard = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (newStatus) => {
    if (draggedTaskId == null) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggedTaskId && task.status !== newStatus) {
        addActivity(`${task.assignedTo} moved "${task.title}" to ${newStatus}`);
        return { ...task, status: newStatus };
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTaskId(null);
  };

  const allowDrop = (e) => e.preventDefault();

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const addActivity = (message) => {
    setActivityLog((prev) => {
      const updated = [message, ...prev];
      return updated.slice(0, 20);
    });
  };

  const handlePriorityChange = (taskId) => {
    const priorityCycle = { High: 'Medium', Medium: 'Low', Low: 'High' };

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newPriority = priorityCycle[task.priority];
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, priority: newPriority } : t
    );

    setTasks(updatedTasks);
    addActivity(`${task.assignedTo} changed priority of "${task.title}" to ${newPriority}`);
  };

  const handleTitleChange = (taskId, newTitle) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      )
    );
  };

  const handleAssignedChange = (taskId, newUser) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, assignedTo: newUser } : t
    );

    setTasks(updatedTasks);
    addActivity(`Reassigned "${task.title}" to ${newUser}`);
  };

  return (
    <div className="board-wrapper">
      <header className="board-header">
        <h2>Collab-ToDo Board</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="board-main">
        <div className="board-columns">
          {['Todo', 'In Progress', 'Done'].map((status) => (
            <div
              key={status}
              className="board-column"
              onDragOver={allowDrop}
              onDrop={() => handleDrop(status)}
            >
              <h3>{status}</h3>
              {getTasksByStatus(status).map((task) => (
                <div
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                >
                  <div className="task-header">
                    <button
                      className={`priority-btn ${task.priority.toLowerCase()}`}
                      onClick={() => handlePriorityChange(task.id)}
                      type="button"
                    >
                      {task.priority}
                    </button>
                  </div>

                  <div className="task-title">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleTitleChange(task.id, e.target.value)}
                      className="editable-input"
                    />
                  </div>

                  <div className="task-footer">
                    <label>Assigned to:&nbsp;</label>
                    <select
                      value={task.assignedTo}
                      onChange={(e) => handleAssignedChange(task.id, e.target.value)}
                      className="editable-select"
                    >
                      <option value="Alice">Alice</option>
                      <option value="Bob">Bob</option>
                      <option value="Charlie">Charlie</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="activity-log">
          <h3>Activity Log</h3>
          <ul>
            {activityLog.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

