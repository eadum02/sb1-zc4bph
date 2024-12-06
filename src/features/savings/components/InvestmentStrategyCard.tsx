import React from 'react';
import { DollarSign } from 'lucide-react';
import { InvestmentStrategy } from '../../../types';

interface InvestmentStrategyCardProps {
  strategy: InvestmentStrategy;
  isRecommended: boolean;
  projectedAmount: number;
  onSelect: () => void;
}

export const InvestmentStrategyCard: React.FC<InvestmentStrategyCardProps> = ({
  strategy,
  isRecommended,
  projectedAmount,
  onSelect,
}) => {
  return (
    <div className={`p-4 rounded-lg ${
      isRecommended ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold capitalize">{strategy.type}</h3>
        {isRecommended && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Recommended
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">{strategy.description}</p>
        <div className="flex gap-3">
          <div className="flex-1 h-2 bg-green-200 rounded" style={{ width: `${strategy.allocation.stocks}%` }} />
          <div className="flex-1 h-2 bg-blue-200 rounded" style={{ width: `${strategy.allocation.bonds}%` }} />
          <div className="flex-1 h-2 bg-gray-200 rounded" style={{ width: `${strategy.allocation.cash}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Stocks: {strategy.allocation.stocks}%</span>
          <span>Bonds: {strategy.allocation.bonds}%</span>
          <span>Cash: {strategy.allocation.cash}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Expected Return:</span>
          <span className="font-medium">{(strategy.expectedReturn * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Projected Value:</span>
          <span className="font-medium">${projectedAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Recommended Investments:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {strategy.recommendations.map((rec, index) => (
            <li key={index} className="flex items-center gap-2">
              <DollarSign size={12} />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSelect}
        className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Select {strategy.type} Strategy
      </button>
    </div>
  );
};