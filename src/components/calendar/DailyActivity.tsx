import React from 'react';
import { Clock, Tag } from 'lucide-react';

interface DailyActivityProps {
  time: string;
  title: string;
  category: string;
  completed: boolean;
  onToggle: () => void;
}

export const DailyActivity: React.FC<DailyActivityProps> = ({
  time,
  title,
  category,
  completed,
  onToggle,
}) => {
  return (
    <div className={`p-4 rounded-lg transition-all ${
      completed ? 'bg-green-50' : 'bg-white'
    } hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <h3 className={`font-medium ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>{time}</span>
              <Tag size={14} className="ml-2" />
              <span>{category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
</boltArtifact>

<boltArtifact id="weather-widget" title="Weather Widget Component">
<boltAction type="file" filePath="src/components/calendar/WeatherWidget.tsx">
import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { WeatherInfo } from '../../types';

interface WeatherWidgetProps {
  weather: WeatherInfo;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      default:
        return <Sun className="w-12 h-12 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Today's Weather</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getWeatherIcon()}
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="text-gray-500" size={18} />
              <span className="text-2xl font-bold">{weather.temperature}°F</span>
            </div>
            <p className="text-gray-600 capitalize">{weather.condition}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Wind size={18} />
          <span>12 mph</span>
        </div>
      </div>
    </div>
  );
};
</boltArtifact>

<boltArtifact id="activities-list" title="Activities List Component">
<boltAction type="file" filePath="src/components/calendar/ActivitiesList.tsx">
import React from 'react';
import { DailyActivity } from './DailyActivity';
import { Activity } from '../../types';

interface ActivitiesListProps {
  activities: Activity[];
  onToggleActivity: (id: string) => void;
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
  onToggleActivity,
}) => {
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <DailyActivity
          key={activity.id}
          time={activity.time}
          title={activity.title}
          category={activity.category}
          completed={activity.completed}
          onToggle={() => onToggleActivity(activity.id)}
        />
      ))}
    </div>
  );
};
</boltArtifact>

<boltArtifact id="updated-calendar-widget" title="Updated Calendar Widget">
<boltAction type="file" filePath="src/components/CalendarWidget.tsx">
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Cloud, Sun, CloudRain, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useReminderStore } from '../store/reminderStore';
import { getCurrentWeather } from '../utils/weather';
import { WeatherWidget } from './calendar/WeatherWidget';
import { ActivitiesList } from './calendar/ActivitiesList';
import type { WeatherInfo, Activity } from '../types';

export const CalendarWidget = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const { reminders, addReminder } = useReminderStore();
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ date: '', text: '' });
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      time: '09:00 AM',
      title: 'Review Monthly Budget',
      category: 'Finance',
      completed: false,
    },
    {
      id: '2',
      time: '11:00 AM',
      title: 'Pay Utility Bills',
      category: 'Bills',
      completed: false,
    },
    {
      id: '3',
      time: '02:00 PM',
      title: 'Update Savings Goals',
      category: 'Savings',
      completed: false,
    },
    {
      id: '4',
      time: '04:00 PM',
      title: 'Check Investment Portfolio',
      category: 'Investments',
      completed: false,
    },
  ]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherData = await getCurrentWeather();
        setWeather(weatherData);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminder.date && newReminder.text) {
      addReminder({
        id: Date.now().toString(),
        date: new Date(newReminder.date),
        text: newReminder.text,
      });
      setNewReminder({ date: '', text: '' });
      setShowAddReminder(false);
    }
  };

  const handleToggleActivity = (id: string) => {
    setActivities(activities.map(activity =>
      activity.id === id
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Calendar</h2>
          </div>
          <button
            onClick={() => setShowAddReminder(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Reminder
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => {
              const dayReminders = reminders.filter((r) => isSameDay(r.date, day));
              const isToday = isSameDay(day, today);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`relative p-2 text-sm ${
                    isSameMonth(day, currentDate)
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  } ${dayReminders.length > 0 ? 'bg-blue-50' : ''} ${
                    isToday ? 'bg-blue-100 rounded-lg' : ''
                  }`}
                >
                  <div className={`font-medium mb-1 ${
                    isToday ? 'text-blue-600' : ''
                  }`}>
                    {format(day, 'd')}
                    {isToday && (
                      <span className="ml-1 text-xs text-blue-600">
                        (Today)
                      </span>
                    )}
                  </div>
                  {dayReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded truncate"
                      title={reminder.text}
                    >
                      {reminder.text}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {weather && <WeatherWidget weather={weather} />}
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Today's Activities</h2>
          <ActivitiesList
            activities={activities}
            onToggleActivity={handleToggleActivity}
          />
        </div>
      </div>

      {showAddReminder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Reminder</h3>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder
                </label>
                <input
                  type="text"
                  required
                  value={newReminder.text}
                  onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reminder text"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
</boltArtifact>

<boltArtifact id="update-types" title="Update Types">
<boltAction type="file" filePath="src/types/index.ts">
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  description: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  monthlyProgress: Record<string, number>;
  investmentStrategy?: InvestmentStrategy;
  currentAllocation?: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  lastRebalanced?: Date;
}

export interface InvestmentStrategy {
  type: 'conservative' | 'moderate' | 'aggressive';
  allocation: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  expectedReturn: number;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  minimumTimeframe: string;
  fees: string;
  rebalancingFrequency: string;
}

export interface TaxInfo {
  state: string;
  income: number;
  taxRate: number;
  estimatedTax: number;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  category: string;
  completed: boolean;
}
</boltArtifact>

<boltAction type="start">
<command>npm run dev</command>