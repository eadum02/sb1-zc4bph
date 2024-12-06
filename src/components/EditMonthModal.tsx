import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';

interface EditMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  currentIncome: number;
  currentExpenses: number;
  onSave: (income: number, expenses: number) => void;
}

export const EditMonthModal: React.FC<EditMonthModalProps> = ({
  isOpen,
  onClose,
  month,
  currentIncome,
  currentExpenses,
  onSave,
}) => {
  const [income, setIncome] = useState(currentIncome.toString());
  const [expenses, setExpenses] = useState(currentExpenses.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(parseFloat(income), parseFloat(expenses));
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Edit {month} Data
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Income
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Expenses
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};