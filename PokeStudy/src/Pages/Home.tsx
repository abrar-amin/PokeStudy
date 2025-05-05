// src/Pages/Home.tsx
import { useState, useEffect } from 'react';
import PomodoroTimer from "./PomodoroTimer";
import Leaderboard from "./Leaderboard";
import { signInWithGoogle, signOut, auth } from '../firebase';
import { User } from 'firebase/auth';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Study' | 'Leaderboard' | 'features'>('Study');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      {/* Navigation Bar with Auth */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-purple-600">PokeStudy</div>
          <div>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="block text-gray-700">Hello, {user.displayName || 'User'}</span>
                </div>
                <img 
                  src={user.photoURL || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="h-10 w-10 rounded-full"
                />
                <button 
                  onClick={handleSignOut}
                  className="bg-purple-100 text-purple-600 px-4 py-2 rounded hover:bg-purple-200 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                disabled={isLoading}
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <section className="relative pt-16 pb-32 flex content-center items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">
                Study Better with <span className="text-purple-600">PokeStudy</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The fun way to boost your productivity. Take care of your virtual pet by attending lectures and studying!
              </p>
              
              {!user && !isLoading && (
                <button 
                  onClick={handleSignIn}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Get Started
                </button>
              )}
            </div>
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto">
              
            </div>
          </div>
        </div>
      </section>
      

      {/* Info Tabs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Your Study Companion
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Discover how PokeStudy can transform your study habits
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center border-b mb-8">
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === 'Study' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab('Study')}
            >
              Study
            </button>
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === 'Leaderboard' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab('Leaderboard')}
            >
              Leaderboard
            </button>
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === 'features' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'Study' && (
              <div>
                {user ? (
                  <PomodoroTimer />
                ) : (
                  <div className="text-center py-10 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>                    
                    <h3 className="text-xl font-semibold mb-2">Sign In to Study</h3>
                    <p className="text-gray-600 mb-6">Please sign in to access the Pomodoro timer and start tracking your study sessions.</p>
                    <button 
                      onClick={handleSignIn}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      Sign In with Google
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Leaderboard' && (
              <div>
                {user ? (
                  <Leaderboard />
                ) : (
                  <div className="text-center py-10 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>                    
                    <h3 className="text-xl font-semibold mb-2">Sign In to View Leaderboard</h3>
                    <p className="text-gray-600 mb-6">Please sign in to see how you rank among other users.</p>
                    <button 
                      onClick={handleSignIn}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      Sign In with Google
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Pomodoro Timer</h4>
                    <p className="text-gray-600">Customize work and break intervals to fit your study style. Track your focus time and productivity trends.</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Virtual Pet</h4>
                    <p className="text-gray-600">Your pet has attributes like health, happiness, and intelligence that grow as you study. Customize its appearance as you level up.</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h4>
                    <p className="text-gray-600">Visualize your study habits with detailed statistics, streaks, and achievements to stay motivated.</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Social Study</h4>
                    <p className="text-gray-600">Connect with classmates, schedule study sessions, and compare progress in a friendly, motivating way.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;