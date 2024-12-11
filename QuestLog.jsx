import React, { useState } from 'react';
import { Shield, Sword, Wand2, Heart, Star, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const QuestLog = ({ currentUser }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [quests, setQuests] = useState([
    { id: 1, name: 'Wäsche waschen', exp: 20, reward: '30 min Extra-Spielzeit', status: 'available' },
    { id: 2, name: 'Müll rausbringen', exp: 10, reward: '1 Extra-Snack', status: 'available' },
    { id: 3, name: 'Spülmaschine ausräumen', exp: 15, reward: '15 min später ins Bett', status: 'available' }
  ]);
  
  const characters = [
    { id: 1, name: 'Ritter', icon: <Shield className="w-12 h-12 text-blue-600" /> },
    { id: 2, name: 'Magier', icon: <Wand2 className="w-12 h-12 text-purple-600" /> },
    { id: 3, name: 'Krieger', icon: <Sword className="w-12 h-12 text-red-600" /> },
    { id: 4, name: 'Heiler', icon: <Heart className="w-12 h-12 text-pink-600" /> }
  ];

  const [playerStats, setPlayerStats] = useState({
    level: currentUser?.level || 1,
    exp: currentUser?.exp || 0,
    completedQuests: currentUser?.completedQuests || 0
  });

  const acceptQuest = (questId) => {
    setQuests(quests.map(quest => 
      quest.id === questId ? {...quest, status: 'in-progress'} : quest
    ));
  };

  const completeQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    setQuests(quests.map(q => 
      q.id === questId ? {...q, status: 'completed'} : q
    ));
    setPlayerStats(prev => ({
      ...prev,
      exp: prev.exp + quest.exp,
      completedQuests: prev.completedQuests + 1,
      level: Math.floor((prev.exp + quest.exp) / 100) + 1
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Haushalts-Questlog</h1>
        {selectedCharacter ? (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Level {playerStats.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span>{playerStats.exp} EXP</span>
            </div>
          </div>
        ) : (
          <p className="text-lg">Wähle deinen Charakter:</p>
        )}
      </div>

      {!selectedCharacter ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {characters.map(char => (
            <Card 
              key={char.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCharacter(char)}
            >
              <CardContent className="flex flex-col items-center p-4">
                {char.icon}
                <p className="mt-2 font-semibold">{char.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {quests.map(quest => (
              <Card key={quest.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between">
                    <span>{quest.name}</span>
                    <span className="text-sm text-gray-600">{quest.exp} EXP</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Belohnung: {quest.reward}</p>
                  {quest.status === 'available' && (
                    <button
                      onClick={() => acceptQuest(quest.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Quest annehmen
                    </button>
                  )}
                  {quest.status === 'in-progress' && (
                    <button
                      onClick={() => completeQuest(quest.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Quest abschließen
                    </button>
                  )}
                  {quest.status === 'completed' && (
                    <span className="text-green-600 font-semibold">Abgeschlossen ✓</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestLog;
