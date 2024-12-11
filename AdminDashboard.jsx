import React, { useState } from 'react';
import { Users, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('family');
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Max', age: 10, character: 'Ritter', restrictions: ['Keine Quests nach 20 Uhr'] },
    { id: 2, name: 'Anna', age: 8, character: 'Magierin', restrictions: ['Max. 3 Quests pro Tag'] }
  ]);

  const [settings, setSettings] = useState({
    dailyQuestLimit: 5,
    questTimeStart: '08:00',
    questTimeEnd: '20:00',
    notifications: {
      questReminders: true,
      achievements: true,
      levelUp: true
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'family' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('family')}
        >
          <Users className="w-5 h-5" />
          Familie
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-5 h-5" />
          Einstellungen
        </button>
      </div>

      {activeTab === 'family' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Familienmitglieder</CardTitle>
          </CardHeader>
          <CardContent>
            {familyMembers.map(member => (
              <div key={member.id} className="mb-4 p-4 border rounded">
                <h3 className="font-bold">{member.name}</h3>
                <p>Alter: {member.age}</p>
                <p>Character: {member.character}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Einstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Tägliches Quest-Limit</label>
                <input 
                  type="number" 
                  value={settings.dailyQuestLimit}
                  onChange={(e) => setSettings({...settings, dailyQuestLimit: e.target.value})}
                  className="border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-2">Quest-Zeitraum</label>
                <div className="flex gap-4">
                  <input 
                    type="time" 
                    value={settings.questTimeStart}
                    onChange={(e) => setSettings({...settings, questTimeStart: e.target.value})}
                    className="border rounded p-2"
                  />
                  <input 
                    type="time" 
                    value={settings.questTimeEnd}
                    onChange={(e) => setSettings({...settings, questTimeEnd: e.target.value})}
                    className="border rounded p-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
