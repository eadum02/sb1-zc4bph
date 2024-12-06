import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, eachMonthOfInterval, startOfYear, endOfYear, isSameMonth } from 'date-fns';
import { useBudgetStore } from '../store/budgetStore';
import { EditMonthModal } from './EditMonthModal';
import { Pencil, Calculator } from 'lucide-react';
import { calculateFederalTax } from '../utils/taxBrackets';
import { calculateStateTax } from '../utils/stateTaxBrackets';
import { State, stateTaxRates } from '../utils/taxRates';

export const YearlyOverview = () => {
  const transactions = useBudgetStore((state) => state.transactions);
  const addTransaction = useBudgetStore((state) => state.addTransaction);
  const currentYear = new Date().getFullYear();
  const [selectedState, setSelectedState] = useState<State>('California');
  const [editingMonth, setEditingMonth] = useState<{
    month: string;
    income: number;
    expenses: number;
    index: number;
  } | null>(null);
  
  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: startOfYear(new Date(currentYear, 0, 1)),
      end: endOfYear(new Date(currentYear, 0, 1))
    });

    return months.map(month => {
      const monthTransactions = transactions.filter(t => 
        isSameMonth(new Date(t.date), month)
      );

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate taxes for the month
      const annualizedIncome = income * 12; // Annualize monthly income for tax brackets
      const { totalTax: federalTax } = calculateFederalTax(annualizedIncome);
      const { totalTax: stateTax } = calculateStateTax(annualizedIncome, selectedState);
      
      // Convert annual tax to monthly
      const monthlyFederalTax = federalTax / 12;
      const monthlyStateTax = stateTax / 12;

      return {
        month: format(month, 'MMM'),
        income,
        expenses,
        federalTax: monthlyFederalTax,
        stateTax: monthlyStateTax,
        totalTax: monthlyFederalTax + monthlyStateTax,
        net: income - expenses - (monthlyFederalTax + monthlyStateTax),
        date: month
      };
    });
  }, [transactions, currentYear, selectedState]);

  const handleEditMonth = (data: typeof monthlyData[0], index: number) => {
    setEditingMonth({
      month: data.month,
      income: data.income,
      expenses: data.expenses,
      index
    });
  };

  const handleSaveMonth = (income: number, expenses: number) => {
    if (!editingMonth) return;

    const monthDate = monthlyData[editingMonth.index].date;
    
    if (income !== editingMonth.income) {
      addTransaction({
        id: Date.now().toString(),
        type: 'income',
        amount: income,
        category: 'Other',
        date: monthDate,
        description: `Monthly income for ${editingMonth.month}`
      });
    }

    if (expenses !== editingMonth.expenses) {
      addTransaction({
        id: (Date.now() + 1).toString(),
        type: 'expense',
        amount: expenses,
        category: 'Other',
        date: monthDate,
        description: `Monthly expenses for ${editingMonth.month}`
      });
    }

    setEditingMonth(null);
  };

  const chartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // green
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // red
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Total Tax',
        data: monthlyData.map(d => d.totalTax),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Yearly Overview {currentYear}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-blue-600" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as State)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {Object.keys(stateTaxRates).sort().map((state) => (
                <option key={state} value={state}>
                  {state} {stateTaxRates[state as State] === 0 ? '(No State Income Tax)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="h-80 mb-6">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {monthlyData.map((data, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gray-50 group relative"
          >
            <button
              onClick={() => handleEditMonth(data, index)}
              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
            >
              <Pencil size={16} />
            </button>
            
            <div className="text-sm font-medium text-gray-600 mb-2">{data.month}</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Income:</span>
                <span className="text-sm text-green-600">${data.income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expenses:</span>
                <span className="text-sm text-red-600">${data.expenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Federal Tax:</span>
                <span className="text-sm text-blue-600">${data.federalTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">State Tax:</span>
                <span className="text-sm text-blue-600">${data.stateTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t">
                <span className="text-sm font-medium">Net:</span>
                <span className={`text-sm font-medium ${
                  data.net >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${data.net.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMonth && (
        <EditMonthModal
          isOpen={true}
          onClose={() => setEditingMonth(null)}
          month={editingMonth.month}
          currentIncome={editingMonth.income}
          currentExpenses={editingMonth.expenses}
          onSave={handleSaveMonth}
        />
      )}
    </div>
  );
};