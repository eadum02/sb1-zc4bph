import React from 'react';

interface QuickContributeButtonsProps {
  onContribute: (amount: number) => void;
}

export const QuickContributeButtons: React.FC<QuickContributeButtonsProps> = ({ onContribute }) => {
  const amounts = [10, 100, 1000];

  return (
    <div className="flex gap-2">
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onContribute(amount)}
          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          +${amount}
        </button>
      ))}
    </div>
  );
};