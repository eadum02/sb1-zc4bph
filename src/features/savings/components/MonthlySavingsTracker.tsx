import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MonthlySavingsTrackerProps {
  goalId: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  onUpdateMonthly: (month: string, amount: number) => void;
  monthlyProgress: Record<string, number>;
}

export const MonthlySavingsTracker: React.FC<MonthlySavingsTrackerProps> = ({
  goalId,
  targetAmount,
  currentAmount,
  deadline,
  onUpdateMonthly,
  monthlyProgress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const startDate = new Date();
  const months: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= deadline) {
    months.push(format(currentDate, 'MMM yyyy'));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const monthlyTarget = targetAmount / months.length;
  
  const handleSaveAmount = (month: string) => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount)) {
      onUpdateMonthly(month, amount);
    }
    setEditingMonth(null);
    setEditAmount('');
  };

  const getProgressColor = (amount: number) => {
    const progress = (amount / monthlyTarget) * 100;
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="font-medium">Monthly Progress</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-gray-600 mb-2">
            Monthly target: ${monthlyTarget.toFixed(2)}
          </div>
          
          {months.map((month) => (
            <div key={month} className="flex items-center gap-4">
              {editingMonth === month ? (
                <div className="flex-1 flex items-center gap-2">
                  <span className="w-24 text-sm">{month}</span>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={() => handleSaveAmount(month)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingMonth(null)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <span className="w-24 text-sm">{month}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(monthlyProgress[month] || 0)} transition-all`}
                      style={{
                        width: `${Math.min(
                          ((monthlyProgress[month] || 0) / monthlyTarget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 text-right text-sm">
                    ${(monthlyProgress[month] || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingMonth(month);
                      setEditAmount((monthlyProgress[month] || 0).toString());
                    }}
                    className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};