import React, { useState } from 'react';
import { Trophy, Star, Crown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AchievementSystem = ({ currentUser }) => {
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Fleißige Biene',
      description: 'Schließe 5 Quests an einem Tag ab',
      progress: 3,
      target: 5,
      reward: '2 Stunden Extra-Spielzeit',
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Früher Vogel',
      description: 'Erledige 3 Quests vor 10 Uhr',
      progress: 2,
      target: 3,
      reward: 'Lieblings-Frühstück',
      icon: <Crown className="w-8 h-8 text-blue-500" />,
      status: 'in-progress'
    }
  ]);

  const [streaks, setStreaks] = useState({
    current: 5,
    best: 12,
    multiplier: 1.5
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Aktuelle Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{streaks.current} Tage</p>
              <p className="text-sm text-gray-600">Beste Streak: {streaks.best} Tage</p>
            </div>
            <div>
              <p className="text-lg">EXP Bonus: x{streaks.multiplier}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {achievements.map(achievement => (
          <Card key={achievement.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {achievement.icon}
                <div className="flex-grow">
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">
                    {achievement.progress} / {achievement.target}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementSystem;
