import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import './PomodoroTimer.css';
import PokemonLevelBar from './PokemonLevelBar';

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
  
  // GIF Player
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [pokemonName, setPokemonName] = useState<string | null>(null);
  const [isLoadingGif, setIsLoadingGif] = useState<boolean>(false);
  const [gifError, setGifError] = useState<string | null>(null);

  const [totalPomodoros, setTotalPomodoros] = useState<number>(0);

  // Firebase Auth
  const auth = getAuth();

  useEffect(() => {
    fetchRandomGif();
  }, []); 

  useEffect(() => {
    setTotalPomodoros(prev => prev + 1);
  }, [completedPomodoros]);

  // Effect for timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      
      
      if (isWorkMode) {
        // Completed a work session
        if(workDuration > 0) {
          setCompletedPomodoros(prev => prev + 1);
          trackCompletedPomodoro(completedPomodoros + 1);
        }
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
  
  const resetProgress = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in to reset progress");
        return;
      }
      
      // Get the Firebase ID token
      const idToken = await currentUser.getIdToken(true);
      
      // API endpoint for resetting pomodoro progress
      const API_ENDPOINT = 'http://127.0.0.1:8080/api/user/pomodoros';
      
      // Send DELETE request to reset progress
      const response = await fetch(API_ENDPOINT, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reset progress: ${response.status}`);
      }
      
      // Reset the local state
      setCompletedPomodoros(0);
      // Also reset the totalPomodoros when progress is reset
      setTotalPomodoros(0);
      alert("Progress has been reset successfully!");
      
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert(`Failed to reset progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

  // Function to track completed pomodoros to API
  const trackCompletedPomodoro = async (count: number) => {
    // Get the current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }
    
    // Get the Firebase ID token
    const idToken = await currentUser.getIdToken(true);
    
    // Replace with your actual API endpoint
    const API_ENDPOINT = 'http://127.0.0.1:8080/api/user/pomodoros';
    
    // Send the request
    await fetch(API_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        count: count,
        timestamp: new Date().toISOString(),
        duration: workDuration
      })
    });
  };
  
  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (text: string) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }
  
  // Function to fetch a random GIF with Firebase Auth token
  const fetchRandomGif = async () => {
    setIsLoadingGif(true);
    setGifError(null);
    
    try {
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to fetch GIFs');
      }
      
      // Get the Firebase ID token
      const idToken = await currentUser.getIdToken(true);
      const API_ENDPOINT = 'http://127.0.0.1:8080/api/user/pokemon';
      
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        mode: 'cors', 
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.Image) {
        setGifUrl(data.Image);
        setPokemonName(toTitleCase(data.Pokemon));
        setTotalPomodoros(data.Pomodoros);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching GIF:', error);
      setGifError(`Failed to fetch GIF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingGif(false);
    }
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
        
        <button 
            className="reset-button"
            onClick={resetProgress}
          >
            Reset Progress
          </button>

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
                  if(Number.isNaN(value)) {
                    setTimeLeft(0);
                  } else {
                    setTimeLeft(value*60);
                  }
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
      
      <div className="gif-player" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        {gifError && (
          <p style={{ color: 'red', marginTop: '10px' }}>{gifError}</p>
        )}
        
        {gifUrl && !isLoadingGif && (
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <img 
              src={gifUrl} 
              alt="Random GIF" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px',
                borderRadius: '4px'
              }} 
            />
            <h2 style={{ 
              color: '#333', 
              marginBottom: '0px',
              fontWeight: 'bold',
              fontSize: '24px'
            }}>{pokemonName}</h2>
            <PokemonLevelBar totalPomodoros={totalPomodoros} />
          </div>
        )}
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