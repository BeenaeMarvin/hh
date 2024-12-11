import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

const LoginComponent = ({ onLogin }) => {
  const [loginMode, setLoginMode] = useState('login'); // 'login' oder 'register'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    age: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hier später die richtige Authentifizierung einbauen
    // Für jetzt simulieren wir einen erfolgreichen Login
    const userData = {
      id: Date.now(),
      username: formData.username,
      age: formData.age || null
    };
    
    // Speichern in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <UserCircle className="w-8 h-8" />
            {loginMode === 'login' ? 'Willkommen zurück!' : 'Neues Konto erstellen'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benutzername
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {loginMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alter
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {loginMode === 'login' ? 'Einloggen' : 'Registrieren'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setLoginMode(loginMode === 'login' ? 'register' : 'login')}
              className="text-blue-500 hover:underline"
            >
              {loginMode === 'login' 
                ? 'Noch kein Konto? Registrieren' 
                : 'Bereits ein Konto? Einloggen'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginComponent;
