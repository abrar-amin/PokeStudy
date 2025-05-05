import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface UserData {
  id: string;
  name: string;
  pomodoros: number;
  pokemon: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (text: string) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

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
      const response = await fetch('http://34.42.8.134:8080/api/leaderboard', {
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
        interface UserDataResponse {
          Pomodoros?: number;
          Name?: string;
          [key: string]: unknown; 
          Pokemon?: string;
        }

        Object.entries(data.data).forEach(([userId, userData]) => {
          // Type guard to ensure userData has the expected structure
          if (userData && typeof userData === 'object') {
            const typedUserData = userData as UserDataResponse;
            const pomodoros = 'Pomodoros' in typedUserData ? typedUserData.Pomodoros || 0 : 0;
            const name = 'Name' in typedUserData ? typedUserData.Name || 'Anonymous' : 'Anonymous';
            const pokemon = toTitleCase('Pokemon' in typedUserData ? typedUserData.Pokemon || 'Pikachu' : "Pikachu");
            userArray.push({
              id: userId,
              name: name,
              pomodoros: pomodoros,
              pokemon: pokemon
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
    <div className="flex justify-center items-center w-full px-4 py-8">
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Pomodoro Leaderboard</h2>
        
        {isLoading && <div className="text-center my-6">Loading...</div>}
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">{error}</div>}
        
        {!isLoading && !error && users.length === 0 && (
          <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg mb-6 text-center">
            No pomodoros completed yet.
          </div>
        )}
        
        {!isLoading && !error && users.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '10%' }}>
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '40%' }}>
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '15%' }}>
                    Level
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '35%' }}>
                    Pokemon
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className={auth.currentUser?.uid === user.id ? "bg-purple-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ width: '10%' }}>
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ width: '40%' }}>
                      {user.name}
                      {auth.currentUser?.uid === user.id && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ width: '15%' }}>
                      {user.pomodoros/10}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ width: '35%' }}>
                      {user.pokemon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={fetchLeaderboardData}
            className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;