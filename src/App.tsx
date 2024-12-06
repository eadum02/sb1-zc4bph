import React, { useState } from 'react';
import { AccountCard } from './components/AccountCard';
import { TransactionsList } from './components/TransactionsList';
import { BudgetOverview } from './components/BudgetOverview';
import { SavingsGoals } from './components/SavingsGoals';
import { TaxEstimator } from './components/TaxEstimator';
import { FinancialAssistant } from './components/FinancialAssistant';
import { CalendarWidget } from './components/CalendarWidget';
import { YearlyOverview } from './components/YearlyOverview';
import { AddTransactionModal } from './components/AddTransactionModal';
import { LayoutGrid, Wallet, Target, Calculator, Calendar, Plus, BarChart } from 'lucide-react';

export default function App() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <AccountCard />
              </div>
              <div className="col-span-2">
                <TransactionsList />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <BudgetOverview />
              <SavingsGoals />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <FinancialAssistant />
              <CalendarWidget />
            </div>
          </>
        );
      case 'yearly':
        return <YearlyOverview />;
      case 'savings':
        return <SavingsGoals />;
      case 'calculator':
        return <TaxEstimator />;
      case 'calendar':
        return <CalendarWidget />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold">Smart Budget</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'yearly'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Yearly Overview
              </button>
              <button
                onClick={() => setActiveTab('savings')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'savings'
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target size={18} />
                  Savings Goals
                </div>
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Tax Calculator
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-white text-teal-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  Calendar
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-20 flex flex-col items-center gap-8 py-8 bg-white rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid size={24} />
            </button>
            <button
              onClick={() => setActiveTab('yearly')}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                activeTab === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart size={24} />
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                activeTab === 'savings'
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target size={24} />
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calculator size={24} />
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar size={24} />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {activeTab === 'dashboard' 
                  ? 'Dashboard' 
                  : activeTab === 'yearly'
                  ? 'Yearly Overview'
                  : activeTab === 'savings'
                  ? 'Savings Goals'
                  : activeTab === 'calendar'
                  ? 'Calendar'
                  : 'Tax Calculator'}
              </h1>
              {activeTab === 'dashboard' && (
                <button
                  onClick={() => setIsAddTransactionOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md"
                >
                  <Plus size={20} />
                  Add Transaction
                </button>
              )}
            </div>

            {renderContent()}
          </div>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />
    </div>
  );
}