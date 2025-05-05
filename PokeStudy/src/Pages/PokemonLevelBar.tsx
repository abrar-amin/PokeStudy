import React from 'react';

interface PokemonLevelBarProps {
  totalPomodoros: number;
}

const PokemonLevelBar: React.FC<PokemonLevelBarProps> = ({ totalPomodoros }) => {
  // Calculate level and progress
  const pomodorosPerLevel = 10;
  const currentLevel = Math.floor(totalPomodoros / pomodorosPerLevel);
  const progressToNextLevel = totalPomodoros % pomodorosPerLevel;
  const progressPercentage = (progressToNextLevel / pomodorosPerLevel) * 100;
  
  const getExpBarColor = (level: number) => {
    // Different colors based on level ranges
    if (level < 5) return '#78C850'; // Green for beginner levels
    if (level < 15) return '#F08030'; // Orange for mid levels
    if (level < 30) return '#6890F0'; // Blue for advanced levels
    return '#F85888'; // Pink for master levels
  };
  
  const barColor = getExpBarColor(currentLevel);
  
  const shinePosition = `${Math.min(progressPercentage, 100)}%`;
  
  return (
    <div className="pokemon-level-container" style={{ 
      marginTop: '10px', 
      marginBottom: '15px',
      fontFamily: "'Segoe UI', 'Helvetica', sans-serif",
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '6px',
        color: '#333'
      }}>
        <span style={{ 
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#2a2a2a'
        }}>
          Level {currentLevel}
        </span>
        <span style={{ fontSize: '14px' }}>
          {progressToNextLevel}/{pomodorosPerLevel} to Level {currentLevel + 1}
        </span>
      </div>
      
      {/* Level Bar Background */}
      <div style={{ 
        width: '100%', 
        height: '16px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '8px',
        border: '1px solid #ccc',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
      }}>
        <div style={{ 
          width: `${progressPercentage}%`, 
          height: '100%', 
          backgroundColor: barColor, 
          borderRadius: '6px',
          transition: 'width 0.5s ease-in-out',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '-15%',
            width: '20%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
            transform: `translateX(${shinePosition})`,
            transition: 'transform 0.5s ease-in-out'
          }}></div>
        </div>
      </div>
      
      {/* Total Pomodoros Display */}
      <div style={{ 
        fontSize: '12px', 
        textAlign: 'right', 
        marginTop: '4px',
        color: '#666' 
      }}>
        Total Pomodoros: {totalPomodoros}
      </div>
    </div>
  );
};

export default PokemonLevelBar;