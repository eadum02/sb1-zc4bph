import { create } from 'zustand';
import { Transaction, SavingsGoal } from '../types';

interface BudgetStore {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: SavingsGoal) => void;
  updateSavingsGoal: (id: string, updatedGoal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  calculateBalance: () => number;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  transactions: [],
  savingsGoals: [],
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),

  updateTransaction: (id, updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map(t =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter(t => t.id !== id),
    })),
    
  addSavingsGoal: (goal) =>
    set((state) => ({
      savingsGoals: [...state.savingsGoals, goal],
    })),
    
  updateSavingsGoal: (id, updatedGoal) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.map((goal) =>
        goal.id === id
          ? { ...goal, ...updatedGoal }
          : goal
      ),
    })),

  deleteSavingsGoal: (id) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.filter(goal => goal.id !== id),
    })),

  calculateBalance: () => {
    const state = get();
    return state.transactions.reduce((balance, transaction) => 
      balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 
      0
    );
  },
}));