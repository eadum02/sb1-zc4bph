import React from 'react';
import { useBudgetStore } from '../store/budgetStore';

export const AccountCard = () => {
  const calculateBalance = useBudgetStore((state) => state.calculateBalance);
  const balance = calculateBalance();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg transform hover:scale-105 transition-all">
      <div className="relative z-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">ACCOUNT</h2>
          <p className="text-blue-100 mb-1">Current Balance</p>
          <h1 className="text-4xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 400 200">
          <path d="M 0 50 C 150 150 250 0 400 100" fill="none" stroke="white" strokeWidth="2">
            <animate attributeName="d" dur="5s" repeatCount="indefinite"
              values="M 0 50 C 150 150 250 0 400 100;
                      M 0 50 C 150 0 250 150 400 100;
                      M 0 50 C 150 150 250 0 400 100"/>
          </path>
          <path d="M 0 100 C 150 200 250 50 400 150" fill="none" stroke="white" strokeWidth="2">
            <animate attributeName="d" dur="7s" repeatCount="indefinite"
              values="M 0 100 C 150 200 250 50 400 150;
                      M 0 100 C 150 50 250 200 400 150;
                      M 0 100 C 150 200 250 50 400 150"/>
          </path>
        </svg>
      </div>
    </div>
  );
};