import React from 'react';
import { Target } from 'lucide-react';
import { SavingsGoalCard } from './SavingsGoalCard';
import { SavingsGoal } from '../../../types';

interface SavingsGoalsListProps {
  goals: SavingsGoal[];
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onInvest: (goalId: string) => void;
  onContribute: (goalId: string, amount: number) => void;
}

export const SavingsGoalsList: React.FC<SavingsGoalsListProps> = ({
  goals,
  onEdit,
  onDelete,
  onInvest,
  onContribute,
}) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Target size={32} className="mx-auto mb-3 opacity-50" />
        <p>No savings goals yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <SavingsGoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onInvest={onInvest}
          onContribute={onContribute}
        />
      ))}
    </div>
  );
};