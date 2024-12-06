import { Transaction, SavingsGoal } from '../types';
import { categories } from './constants';

interface FinancialData {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  balance: number;
}

export const analyzeFinances = ({
  transactions,
  savingsGoals,
  balance,
}: FinancialData) => {
  const insights: { type: 'success' | 'warning' | 'info'; message: string }[] = [];

  // Analyze spending patterns
  const recentTransactions = transactions
    .filter((t) => {
      const date = new Date(t.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate category spending
  const categorySpending = categories.reduce((acc, category) => {
    const total = recentTransactions
      .filter((t) => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...acc, [category]: total };
  }, {} as Record<string, number>);

  // Identify highest spending category
  const highestCategory = Object.entries(categorySpending).reduce(
    (max, [category, amount]) =>
      amount > (max.amount || 0) ? { category, amount } : max,
    { category: '', amount: 0 }
  );

  if (highestCategory.amount > 0) {
    insights.push({
      type: 'info',
      message: `Your highest spending category is ${
        highestCategory.category
      } at $${highestCategory.amount.toFixed(2)} in the last 30 days.`,
    });
  }

  // Analyze savings goals progress
  savingsGoals.forEach((goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const daysLeft = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (progress < 25 && daysLeft < 60) {
      insights.push({
        type: 'warning',
        message: `You're behind on your "${
          goal.name
        }" savings goal. Consider increasing your monthly contribution to reach $${goal.targetAmount.toFixed(
          2
        )} by ${deadline.toLocaleDateString()}.`,
      });
    } else if (progress >= 90) {
      insights.push({
        type: 'success',
        message: `Great job! You're almost at your "${goal.name}" savings goal!`,
      });
    }
  });

  // Emergency fund check
  const monthlyExpenses =
    recentTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / 3;

  if (balance < monthlyExpenses * 3) {
    insights.push({
      type: 'warning',
      message: `Your current balance is less than 3 months of expenses. Consider building an emergency fund of at least $${(
        monthlyExpenses * 3
      ).toFixed(2)}.`,
    });
  } else if (balance >= monthlyExpenses * 6) {
    insights.push({
      type: 'success',
      message: `You have a healthy emergency fund! Consider investing any excess funds for long-term growth.`,
    });
  }

  // Income vs Expenses analysis
  const monthlyIncome = recentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpensesTotal = recentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (monthlyExpensesTotal > monthlyIncome * 0.9) {
    insights.push({
      type: 'warning',
      message: `Your expenses are ${Math.round(
        (monthlyExpensesTotal / monthlyIncome) * 100
      )}% of your income. Try to keep this below 90% for better financial health.`,
    });
  } else if (monthlyExpensesTotal < monthlyIncome * 0.6) {
    insights.push({
      type: 'success',
      message: `Great job keeping your expenses low! You're saving ${Math.round(
        ((monthlyIncome - monthlyExpensesTotal) / monthlyIncome) * 100
      )}% of your income.`,
    });
  }

  return insights;
};