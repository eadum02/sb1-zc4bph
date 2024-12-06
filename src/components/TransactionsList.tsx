import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import { EditTransactionModal } from './EditTransactionModal';
import { Transaction } from '../types';

export const TransactionsList = () => {
  const { transactions, updateTransaction, deleteTransaction } = useBudgetStore();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button className="text-blue-600 text-sm">View All</button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </p>
              <button
                onClick={() => handleEdit(transaction)}
                className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions yet. Add one to get started!
          </div>
        )}
      </div>

      {editingTransaction && (
        <EditTransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={updateTransaction}
          onDelete={deleteTransaction}
        />
      )}
    </div>
  );
};