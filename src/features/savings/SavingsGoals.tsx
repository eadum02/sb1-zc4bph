import React, { useState } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import { useSavingsGoals } from './hooks/useSavingsGoals';
import { SavingsGoalsSidebar } from './components/SavingsGoalsSidebar';
import { SavingsGoalDetail } from './components/SavingsGoalDetail';
import { AddSavingsGoalModal } from './components/AddSavingsGoalModal';
import { EditSavingsGoalModal } from './components/EditSavingsGoalModal';
import { InvestmentStrategyModal } from './components/InvestmentStrategyModal';

export const SavingsGoals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [investingGoal, setInvestingGoal] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  const {
    savingsGoals,
    handleContribute,
    handleUpdateMonthly,
    handleSelectStrategy,
    deleteSavingsGoal,
  } = useSavingsGoals();

  const selectedGoal = savingsGoals.find(g => g.id === selectedGoalId);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <PiggyBank className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold">Savings Goals</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {savingsGoals.length === 0 ? (
        <div className="text-center py-12">
          <PiggyBank size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No savings goals yet</h3>
          <p className="text-gray-500 mb-6">Create your first savings goal to start tracking your progress</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          <SavingsGoalsSidebar
            goals={savingsGoals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={setSelectedGoalId}
          />
          
          {selectedGoal ? (
            <SavingsGoalDetail
              goal={selectedGoal}
              onUpdateMonthly={(month, amount) => handleUpdateMonthly(selectedGoal.id, month, amount)}
              onInvest={() => setInvestingGoal(selectedGoal.id)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white rounded-xl p-6">
              <p className="text-gray-500">Select a goal to view details</p>
            </div>
          )}
        </div>
      )}

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