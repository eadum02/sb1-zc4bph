import { differenceInDays } from 'date-fns';
import { SavingsGoal } from '../../../types';

export const calculateSavingsProgress = (goal: SavingsGoal) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
  const dailyNeeded = remaining / Math.max(daysLeft, 1);

  return {
    progress,
    remaining,
    daysLeft,
    dailyNeeded,
  };
};

export const calculateProjectedValue = (
  currentAmount: number,
  monthlyContribution: number,
  years: number,
  expectedReturn: number
): number => {
  const monthlyRate = expectedReturn / 12;
  const months = years * 12;
  let futureValue = currentAmount;

  for (let i = 0; i < months; i++) {
    futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
  }

  return futureValue;
};