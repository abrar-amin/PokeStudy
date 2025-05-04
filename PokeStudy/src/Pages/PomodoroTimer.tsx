// src/components/PomodoroTimer.tsx
import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const PomodoroTimer: React.FC = () => {
  // Timer settings
  const [workDuration, setWorkDuration] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(workDuration * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWorkMode, setIsWorkMode] = useState<boolean>(true);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  
  // To-do list
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  
  // Effect for timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play();
      
      if (isWorkMode) {
        // Completed a work session
        setCompletedPomodoros(prev => prev + 1);
        setIsWorkMode(false);
        setTimeLeft(breakDuration * 60);
      } else {
        // Completed a break session
        setIsWorkMode(true);
        setTimeLeft(workDuration * 60);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWorkMode, workDuration, breakDuration]);
  
  // Timer control functions
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsWorkMode(true);
    setTimeLeft(workDuration * 60);
  };
  
  const skipSession = () => {
    setIsActive(false);
    if (isWorkMode) {
      setIsWorkMode(false);
      setTimeLeft(breakDuration * 60);
    } else {
      setIsWorkMode(true);
      setTimeLeft(workDuration * 60);
    }
  };
  
  // To-do list functions
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      const newTaskItem: Task = {
        id: Date.now(),
        text: newTask,
        completed: false
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };
  
  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="pomodoro-container">
      <div className="pomodoro-timer">
        <div className={`timer-display ${isWorkMode ? 'work-mode' : 'break-mode'}`}>
          <h2>{isWorkMode ? 'Work Time' : 'Break Time'}</h2>
          <div className="time">{formatTime(timeLeft)}</div>
          <div className="pomodoro-count">Completed Pomodoros: {completedPomodoros}</div>
        </div>
        
        <div className="timer-controls">
          <button 
            className="timer-button"
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            className="timer-button"
            onClick={resetTimer}
          >
            Reset
          </button>
          <button 
            className="timer-button"
            onClick={skipSession}
          >
            Skip
          </button>
        </div>
        
        <div className="timer-settings">
          <div className="setting">
            <label>Work Duration (minutes)</label>
            <input 
              type="number" 
              min="1" 
              max="60" 
              value={workDuration}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setWorkDuration(value);
                if (isWorkMode && !isActive) {
                  setTimeLeft(value * 60);
                }
              }}
            />
          </div>
          <div className="setting">
            <label>Break Duration (minutes)</label>
            <input 
              type="number" 
              min="1" 
              max="30" 
              value={breakDuration}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setBreakDuration(value);
                if (!isWorkMode && !isActive) {
                  setTimeLeft(value * 60);
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="task-list">
        <h2>Tasks</h2>
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
          />
          <button type="submit" className="add-task-button">Add</button>
        </form>
        
        <ul className="tasks">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="task-checkbox"
                  />
                  <span className="task-text">{task.text}</span>
                </div>
                <button 
                  className="delete-task-button"
                  onClick={() => deleteTask(task.id)}
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default PomodoroTimer;