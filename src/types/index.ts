export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  description: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  monthlyProgress: Record<string, number>;
  investmentStrategy?: InvestmentStrategy;
  currentAllocation?: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  lastRebalanced?: Date;
}

export interface InvestmentStrategy {
  type: 'conservative' | 'moderate' | 'aggressive';
  allocation: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  expectedReturn: number;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  minimumTimeframe: string;
  fees: string;
  rebalancingFrequency: string;
}

export interface TaxInfo {
  state: string;
  income: number;
  taxRate: number;
  estimatedTax: number;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
}