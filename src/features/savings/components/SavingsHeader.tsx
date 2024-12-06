import React from 'react';
import { Plus, PiggyBank } from 'lucide-react';

interface SavingsHeaderProps {
  onAddGoal: () => void;
}

export const SavingsHeader: React.FC<SavingsHeaderProps> = ({ onAddGoal }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <PiggyBank className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold">Savings Goals</h2>
      </div>
      <button
        onClick={onAddGoal}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <Plus size={16} />
        New Goal
      </button>
    </div>
  );
};