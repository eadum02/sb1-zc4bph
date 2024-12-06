import React from 'react';
import { InvestmentStrategy } from '../../../types';

interface InvestmentInfoProps {
  strategy: InvestmentStrategy;
}

export const InvestmentInfo: React.FC<InvestmentInfoProps> = ({ strategy }) => {
  return (
    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Investment Strategy:</span>
        <span className="text-sm capitalize">{strategy.type}</span>
      </div>
      <div className="flex gap-2 text-xs">
        <div className="flex-1 bg-green-100 rounded px-2 py-1">
          Stocks: {strategy.allocation.stocks}%
        </div>
        <div className="flex-1 bg-blue-100 rounded px-2 py-1">
          Bonds: {strategy.allocation.bonds}%
        </div>
        <div className="flex-1 bg-gray-100 rounded px-2 py-1">
          Cash: {strategy.allocation.cash}%
        </div>
      </div>
    </div>
  );
};