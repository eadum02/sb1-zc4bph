import { useBudgetStore } from '../../../store/budgetStore';
import { investmentStrategies } from '../../../utils/investmentStrategies';

export const useSavingsGoals = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
  } = useBudgetStore();

  const handleContribute = (goalId: string, amount: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      updateSavingsGoal(goalId, {
        ...goal,
        currentAmount: goal.currentAmount + amount
      });
    }
  };

  const handleUpdateMonthly = (goalId: string, month: string, amount: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      const newMonthlyProgress = {
        ...goal.monthlyProgress,
        [month]: amount
      };
      
      const totalSaved = Object.values(newMonthlyProgress).reduce((sum, val) => sum + val, 0);
      
      updateSavingsGoal(goalId, {
        ...goal,
        monthlyProgress: newMonthlyProgress,
        currentAmount: totalSaved
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

  return {
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    handleContribute,
    handleUpdateMonthly,
    handleSelectStrategy,
  };
};