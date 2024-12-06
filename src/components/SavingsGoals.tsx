import React, { useState } from 'react';
import { Target, Plus, Pencil, Trash2, PiggyBank, TrendingUp } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import { AddSavingsGoalModal } from './AddSavingsGoalModal';
import { EditSavingsGoalModal } from './EditSavingsGoalModal';
import { InvestmentStrategyModal } from './InvestmentStrategyModal';
import { format, differenceInDays } from 'date-fns';
import { investmentStrategies } from '../utils/investmentStrategies';

export const SavingsGoals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [investingGoal, setInvestingGoal] = useState<string | null>(null);
  const { savingsGoals, updateSavingsGoal, deleteSavingsGoal } = useBudgetStore();

  const handleContribute = (goalId: string, amount: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      updateSavingsGoal(goalId, {
        ...goal,
        currentAmount: goal.currentAmount + amount
      });
    }
  };

  const handleSelectStrategy = (goalId: string, strategyType: keyof typeof investmentStrategies) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      updateSavingsGoal(goalId, {
        ...goal,
        investmentStrategy: investmentStrategies[strategyType]
      });
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <PiggyBank className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold">Savings Goals</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>

      <div className="space-y-4">
        {savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
          const dailyNeeded = remaining / Math.max(daysLeft, 1);
          
          return (
            <div key={goal.id} className="border rounded-lg p-4 group">
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
                    onClick={() => setInvestingGoal(goal.id)}
                    className="p-1.5 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition"
                    title="Investment Strategy"
                  >
                    <TrendingUp size={16} />
                  </button>
                  <button
                    onClick={() => setEditingGoal(goal.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
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

              {goal.investmentStrategy && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Investment Strategy:</span>
                    <span className="text-sm capitalize">{goal.investmentStrategy.type}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <div className="flex-1 bg-green-100 rounded px-2 py-1">
                      Stocks: {goal.investmentStrategy.allocation.stocks}%
                    </div>
                    <div className="flex-1 bg-blue-100 rounded px-2 py-1">
                      Bonds: {goal.investmentStrategy.allocation.bonds}%
                    </div>
                    <div className="flex-1 bg-gray-100 rounded px-2 py-1">
                      Cash: {goal.investmentStrategy.allocation.cash}%
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContribute(goal.id, 10)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    +$10
                  </button>
                  <button
                    onClick={() => handleContribute(goal.id, 100)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    +$100
                  </button>
                  <button
                    onClick={() => handleContribute(goal.id, 1000)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    +$1000
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {savingsGoals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target size={32} className="mx-auto mb-3 opacity-50" />
            <p>No savings goals yet. Create one to get started!</p>
          </div>
        )}
      </div>

      <AddSavingsGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editingGoal && (
        <EditSavingsGoalModal
          isOpen={true}
          onClose={() => setEditingGoal(null)}
          goalId={editingGoal}
        />
      )}

      {investingGoal && (
        <InvestmentStrategyModal
          isOpen={true}
          onClose={() => setInvestingGoal(null)}
          currentAmount={savingsGoals.find(g => g.id === investingGoal)?.currentAmount || 0}
          targetAmount={savingsGoals.find(g => g.id === investingGoal)?.targetAmount || 0}
          deadline={savingsGoals.find(g => g.id === investingGoal)?.deadline || new Date()}
          onStrategySelect={(strategy) => handleSelectStrategy(investingGoal, strategy)}
        />
      )}
    </div>
  );
};