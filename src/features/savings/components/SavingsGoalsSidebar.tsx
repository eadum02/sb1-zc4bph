import React from 'react';
import { Target, TrendingUp, PiggyBank, ChevronRight } from 'lucide-react';
import { SavingsGoal } from '../../../types';

interface SavingsGoalsSidebarProps {
  goals: SavingsGoal[];
  selectedGoalId: string | null;
  onSelectGoal: (goalId: string) => void;
}

export const SavingsGoalsSidebar: React.FC<SavingsGoalsSidebarProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal,
}) => {
  return (
    <div className="w-64 bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="text-blue-600" size={20} />
        <h3 className="font-semibold">Your Goals</h3>
      </div>
      
      <div className="space-y-2">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          
          return (
            <button
              key={goal.id}
              onClick={() => onSelectGoal(goal.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedGoalId === goal.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{goal.name}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target size={14} />
                <span>${goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};