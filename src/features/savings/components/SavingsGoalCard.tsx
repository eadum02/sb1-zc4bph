import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { SavingsGoal } from '../../../types';
import { getProgressColor } from '../utils/progressUtils';
import { QuickContributeButtons } from './QuickContributeButtons';
import { InvestmentInfo } from './InvestmentInfo';
import { MonthlySavingsTracker } from './MonthlySavingsTracker';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onInvest: (goalId: string) => void;
  onContribute: (goalId: string, amount: number) => void;
  onUpdateMonthly: (goalId: string, month: string, amount: number) => void;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onInvest,
  onContribute,
  onUpdateMonthly,
}) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
  const dailyNeeded = remaining / Math.max(daysLeft, 1);

  return (
    <div className="border rounded-lg p-4 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          <p className="text-sm text-gray-500">
            Target date: {format(goal.deadline, 'MMM d, yyyy')}
            {daysLeft > 0 && ` (${daysLeft} days left)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onInvest(goal.id)}
            className="p-1.5 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition"
            title="Investment Strategy"
          >
            <TrendingUp size={16} />
          </button>
          <button
            onClick={() => onEdit(goal.id)}
            className="p-1.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>${goal.currentAmount.toFixed(2)} saved</span>
          <span>${goal.targetAmount.toFixed(2)} goal</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(progress)} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {goal.investmentStrategy && <InvestmentInfo strategy={goal.investmentStrategy} />}

      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            ${remaining.toFixed(2)} to go
          </p>
          {daysLeft > 0 && (
            <p className="text-xs text-gray-500">
              Need to save ${dailyNeeded.toFixed(2)} per day
            </p>
          )}
        </div>
        <QuickContributeButtons onContribute={(amount) => onContribute(goal.id, amount)} />
      </div>

      <MonthlySavingsTracker
        goalId={goal.id}
        targetAmount={goal.targetAmount}
        currentAmount={goal.currentAmount}
        deadline={goal.deadline}
        onUpdateMonthly={(month, amount) => onUpdateMonthly(goal.id, month, amount)}
        monthlyProgress={goal.monthlyProgress || {}}
      />
    </div>
  );
};