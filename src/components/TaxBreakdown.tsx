import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TaxBreakdownProps {
  brackets: Array<{
    amount: number;
    rate: number;
    tax: number;
  }>;
  title: string;
}

export const TaxBreakdown: React.FC<TaxBreakdownProps> = ({ brackets, title }) => {
  // Special handling for no tax states
  if (brackets.length === 1 && brackets[0].rate === 0) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="text-sm text-gray-600">
          No state income tax applies
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {brackets.map((bracket, index) => (
        <div key={index} className="flex items-center gap-3 text-sm">
          <div className="w-24 text-gray-600">
            ${bracket.amount.toFixed(2)}
          </div>
          <ArrowRight size={16} className="text-gray-400" />
          <div className="text-gray-600">
            {bracket.rate}%
          </div>
          <ArrowRight size={16} className="text-gray-400" />
          <div className="font-medium">
            ${bracket.tax.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};