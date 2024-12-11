import React, { useState, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Home, Trophy, Settings, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';

import HouseholdQuestlog from './components/HouseholdQuestlog';
import AdminDashboard from './components/AdminDashboard';
import AchievementSystem from './components/AchievementSystem';
import LoginComponent from './components/LoginComponent';

const MainApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginComponent onLogin={setCurrentUser} />;
  }

  const views = [
    { id: 'home', title: 'Questlog', icon: <Home className="w-6 h-6" />, component: HouseholdQuestlog },
    { id: 'achievements', title: 'Erfolge', icon: <Trophy className="w-6 h-6" />, component: AchievementSystem },
    { id: 'admin', title: 'Admin', icon: <Settings className="w-6 h-6" />, component: AdminDashboard }
  ];

  const currentIndex = views.findIndex(v => v.id === currentView);

  const navigateNext = () => {
    const nextIndex = (currentIndex + 1) % views.length;
    setCurrentView(views[nextIndex].id);
  };

  const navigatePrev = () => {
    const prevIndex = (currentIndex - 1 + views.length) % views.length;
    setCurrentView(views[prevIndex].id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Haushalts-Questlog</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{currentUser.username}</span>
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    currentView === view.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {view.icon}
                  <span className="ml-2">{view.title}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="relative">
          <button
            onClick={navigatePrev}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={navigateNext}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="py-4">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
              </div>
            }>
              {views.map((view) => (
                <div key={view.id} style={{ display: currentView === view.id ? 'block' : 'none' }}>
                  <view.component currentUser={currentUser} />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 Haushalts-Questlog
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('admin')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Einstellungen
              </button>
              <button
                onClick={() => setCurrentView('achievements')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Erfolge
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainApp;
