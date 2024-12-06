import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Cloud, Sun, CloudRain, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useReminderStore } from '../store/reminderStore';
import { getCurrentWeather } from '../utils/weather';
import type { WeatherInfo } from '../types';

export const CalendarWidget = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const { reminders, addReminder } = useReminderStore();
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ date: '', text: '' });

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
    // Update weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'cloudy':
        return <Cloud className="text-gray-400" />;
      case 'rainy':
        return <CloudRain className="text-blue-400" />;
      default:
        return <Sun className="text-yellow-400" />;
    }
  };

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

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Calendar</h2>
          {weather && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              {getWeatherIcon(weather.condition)}
              <span className="text-sm font-medium">{weather.temperature}°F</span>
              <span className="text-sm text-gray-500 capitalize">
                {weather.condition}
              </span>
            </div>
          )}
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