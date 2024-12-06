import React, { useEffect, useState } from 'react';
import { MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import { analyzeFinances } from '../utils/financialAnalysis';

export const FinancialAssistant = () => {
  const { transactions, savingsGoals, balance } = useBudgetStore();
  const [insights, setInsights] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }[]>([]);

  useEffect(() => {
    const analysis = analyzeFinances({ transactions, savingsGoals, balance });
    setInsights(analysis);
  }, [transactions, savingsGoals, balance]);

  const getIcon = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={20} />;
      default:
        return <MessageSquare className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold">Financial Assistant</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-lg ${
              insight.type === 'success'
                ? 'bg-green-50'
                : insight.type === 'warning'
                ? 'bg-amber-50'
                : 'bg-blue-50'
            }`}
          >
            {getIcon(insight.type)}
            <p className="text-gray-700">{insight.message}</p>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
            <p>Start adding transactions to get personalized financial insights!</p>
          </div>
        )}
      </div>
    </div>
  );
};