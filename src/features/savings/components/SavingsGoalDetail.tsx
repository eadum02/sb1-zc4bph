import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import { SavingsGoal } from '../../../types';
import { MonthlySavingsTracker } from './MonthlySavingsTracker';
import { calculateSavingsProgress } from '../utils/savingsCalculations';

interface SavingsGoalDetailProps {
  goal: SavingsGoal;
  onUpdateMonthly: (month: string, amount: number) => void;
  onInvest: () => void;
}

export const SavingsGoalDetail: React.FC<SavingsGoalDetailProps> = ({
  goal,
  onUpdateMonthly,
  onInvest,
}) => {
  const { progress, remaining, daysLeft, dailyNeeded } = calculateSavingsProgress(goal);

  return (
    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{goal.name}</h2>
        <button
          onClick={onInvest}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
        >
          <TrendingUp size={18} />
          Investment Strategy
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Target size={20} />
            <span className="font-medium">Target Amount</span>
          </div>
          <p className="text-2xl font-bold">${goal.targetAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">
            ${remaining.toLocaleString()} remaining
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign size={20} />
            <span className="font-medium">Current Savings</span>
          </div>
          <p className="text-2xl font-bold">${goal.currentAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">
            {progress.toFixed(1)}% of goal
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Calendar size={20} />
            <span className="font-medium">Timeline</span>
          </div>
          <p className="text-2xl font-bold">{daysLeft} days</p>
          <p className="text-sm text-gray-600 mt-1">
            ${dailyNeeded.toFixed(2)} needed per day
          </p>
        </div>
      </div>

      {goal.investmentStrategy && (
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Investment Strategy</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Asset Allocation</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stocks</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${goal.investmentStrategy.allocation.stocks}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {goal.investmentStrategy.allocation.stocks}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bonds</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${goal.investmentStrategy.allocation.bonds}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {goal.investmentStrategy.allocation.bonds}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cash</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-500"
                        style={{ width: `${goal.investmentStrategy.allocation.cash}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {goal.investmentStrategy.allocation.cash}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Strategy Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <span className="font-medium capitalize">{goal.investmentStrategy.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return:</span>
                  <span className="font-medium">
                    {(goal.investmentStrategy.expectedReturn * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rebalancing:</span>
                  <span className="font-medium">{goal.investmentStrategy.rebalancingFrequency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MonthlySavingsTracker
        goalId={goal.id}
        targetAmount={goal.targetAmount}
        currentAmount={goal.currentAmount}
        deadline={goal.deadline}
        onUpdateMonthly={onUpdateMonthly}
        monthlyProgress={goal.monthlyProgress || {}}
      />
    </div>
  );
};