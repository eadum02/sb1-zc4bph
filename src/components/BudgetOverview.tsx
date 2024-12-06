import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useBudgetStore } from '../store/budgetStore';
import { categories } from '../utils/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BudgetOverview = () => {
  const transactions = useBudgetStore((state) => state.transactions);

  const categoryTotals = categories.reduce((acc, category) => {
    const total = transactions
      .filter((t) => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...acc, [category]: total };
  }, {} as Record<string, number>);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Spending by Category',
        data: categories.map((cat) => categoryTotals[cat] || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',   // blue
          'rgba(16, 185, 129, 0.7)',   // green
          'rgba(245, 158, 11, 0.7)',   // yellow
          'rgba(239, 68, 68, 0.7)',    // red
          'rgba(139, 92, 246, 0.7)',   // purple
          'rgba(236, 72, 153, 0.7)',   // pink
          'rgba(14, 165, 233, 0.7)',   // light blue
          'rgba(168, 85, 247, 0.7)',   // violet
          'rgba(251, 146, 60, 0.7)',   // orange
          'rgba(34, 197, 94, 0.7)',    // emerald
          'rgba(99, 102, 241, 0.7)',   // indigo
          'rgba(244, 63, 94, 0.7)',    // rose
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(14, 165, 233)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)',
          'rgb(34, 197, 94)',
          'rgb(99, 102, 241)',
          'rgb(244, 63, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `$${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value}`,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Budget Overview</h2>
      <div className="h-64 mb-6">
        <Bar data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <div
            key={category}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              />
              <span className="text-gray-600">{category}</span>
            </div>
            <span className="font-semibold">
              ${(categoryTotals[category] || 0).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};