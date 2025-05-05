// src/components/Leaderboard.tsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface UserData {
  id: string;
  name: string;
  pomodoros: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const auth = getAuth();
  
  useEffect(() => {
    fetchLeaderboardData();
  }, []);
  
  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("Login required");
        setIsLoading(false);
        return;
      }
      
      const idToken = await currentUser.getIdToken(true);
      const response = await fetch('http://127.0.0.1:8080/api/leaderboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const userArray: UserData[] = [];
      
      if (data && data.message === "SUCCESS" && data.data) {
        // Define expected response structure
        interface UserDataResponse {
          Pomodoros?: number;
          Name?: string;
          [key: string]: unknown; 
        }

        // Type safe way to handle the entries
        Object.entries(data.data).forEach(([userId, userData]) => {
          // Type guard to ensure userData has the expected structure
          if (userData && typeof userData === 'object') {
            const typedUserData = userData as UserDataResponse;
            const pomodoros = 'Pomodoros' in typedUserData ? typedUserData.Pomodoros || 0 : 0;
            const name = 'Name' in typedUserData ? typedUserData.Name || 'Anonymous' : 'Anonymous';
            
            userArray.push({
              id: userId,
              name: name,
              pomodoros: pomodoros
            });
          }
        });
      }
      
      setUsers(userArray.sort((a, b) => b.pomodoros - a.pomodoros));
    } catch (error) {
      console.error('Leaderboard error:', error);
      setError(`${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="leaderboard">
      <h2 className="text-2xl font-bold mb-4">Pomodoro Leaderboard</h2>
      
      {isLoading && <div className="text-center my-4">Loading...</div>}
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      
      {!isLoading && !error && users.length === 0 && (
        <div className="bg-yellow-50 text-yellow-600 p-3 rounded mb-4">
          No pomodoros completed yet.
        </div>
      )}
      
      {!isLoading && !error && users.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pomodoros
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id} className={auth.currentUser?.uid === user.id ? "bg-purple-50" : ""}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                    {auth.currentUser?.uid === user.id && (
                      <span className="ml-2 px-2 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                         (You)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.pomodoros}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button
        onClick={fetchLeaderboardData}
        className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Refresh
      </button>
    </div>
  );
};

export default Leaderboard;