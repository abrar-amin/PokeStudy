// src/Pages/Home.tsx
import { useState } from 'react';
import  PomodoroTimer from "./PomodoroTimer";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Study' | 'Leaderboard' | 'features'>('Study');

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
     
      
      <section className="relative pt-16 pb-32 flex content-center items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">
                Study Better with <span className="text-purple-600">StudyPet</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The fun way to boost your productivity. Take care of your virtual pet by attending lectures and studying!
              </p>
            </div>
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto">
              <div className="relative">

              </div>
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
              Discover how StudyPet can transform your study habits
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
                <PomodoroTimer />
              </div>
            )}
            
            {activeTab === 'Leaderboard' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How StudyPet Works</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-purple-600 text-xl font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">Create your pet</h4>
                      <p className="text-gray-600">Choose a pet type, customize its appearance, and give it a name that motivates you.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-purple-600 text-xl font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">Use the Pomodoro timer</h4>
                      <p className="text-gray-600">Start focused study sessions with our built-in Pomodoro timer. Each completed session feeds your pet and increases its intelligence.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-purple-600 text-xl font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">Watch your pet grow</h4>
                      <p className="text-gray-600">As you study regularly, your pet will gain experience, level up, and unlock new accessories and abilities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <span className="text-purple-600 text-xl font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">Connect with friends</h4>
                      <p className="text-gray-600">Add friends to see their study progress, schedule study sessions together, and have virtual pet playdates.</p>
                    </div>
                  </div>
                </div>
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