import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, TrendingUp, PieChart, DollarSign, AlertTriangle } from 'lucide-react';
import { investmentStrategies, calculateProjectedGrowth, getRecommendedStrategy } from '../utils/investmentStrategies';
import { differenceInYears } from 'date-fns';

interface InvestmentStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAmount: number;
  targetAmount: number;
  deadline: Date;
  onStrategySelect: (strategy: keyof typeof investmentStrategies) => void;
}

export const InvestmentStrategyModal: React.FC<InvestmentStrategyModalProps> = ({
  isOpen,
  onClose,
  currentAmount,
  targetAmount,
  deadline,
  onStrategySelect,
}) => {
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const timeHorizon = differenceInYears(deadline, new Date());
  const recommendedStrategy = getRecommendedStrategy(timeHorizon, riskTolerance, currentAmount, targetAmount);
  const monthlyContribution = (targetAmount - currentAmount) / (timeHorizon * 12);

  const renderProjection = (strategyType: keyof typeof investmentStrategies) => {
    const strategy = investmentStrategies[strategyType];
    const projectedAmount = calculateProjectedGrowth(
      currentAmount,
      monthlyContribution,
      timeHorizon,
      strategy.expectedReturn
    );

    const projectedShortfall = targetAmount - projectedAmount;
    const isProjectedShortfall = projectedShortfall > 0;

    return (
      <div key={strategyType} className={`p-6 rounded-xl ${
        strategyType === recommendedStrategy 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200' 
          : 'bg-white border border-gray-200'
      } hover:shadow-lg transition-all duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
            {strategyType}
            {strategyType === recommendedStrategy && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Recommended
              </span>
            )}
          </h3>
          <div className={`text-sm ${
            strategy.riskLevel === 'low' 
              ? 'text-green-600' 
              : strategy.riskLevel === 'medium'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Asset Allocation</span>
              <span>Expected Return: {(strategy.expectedReturn * 100).toFixed(1)}%</span>
            </div>
            <div className="flex h-4 rounded-lg overflow-hidden">
              <div 
                className="bg-green-400"
                style={{ width: `${strategy.allocation.stocks}%` }}
                title={`Stocks: ${strategy.allocation.stocks}%`}
              />
              <div 
                className="bg-blue-400"
                style={{ width: `${strategy.allocation.bonds}%` }}
                title={`Bonds: ${strategy.allocation.bonds}%`}
              />
              <div 
                className="bg-gray-400"
                style={{ width: `${strategy.allocation.cash}%` }}
                title={`Cash: ${strategy.allocation.cash}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Stocks {strategy.allocation.stocks}%</span>
              <span>Bonds {strategy.allocation.bonds}%</span>
              <span>Cash {strategy.allocation.cash}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Projected Value:</span>
              <span className="font-semibold">${projectedAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
            {isProjectedShortfall && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangle size={16} />
                <span>Projected shortfall: ${projectedShortfall.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Recommended Investments:</h4>
          <ul className="grid grid-cols-2 gap-2">
            {strategy.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <DollarSign size={14} className="text-blue-500" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <div className="flex justify-between">
            <span>Minimum Timeframe:</span>
            <span>{strategy.minimumTimeframe}</span>
          </div>
          <div className="flex justify-between">
            <span>Management Fees:</span>
            <span>{strategy.fees}</span>
          </div>
          <div className="flex justify-between">
            <span>Rebalancing:</span>
            <span>{strategy.rebalancingFrequency}</span>
          </div>
        </div>

        <button
          onClick={() => {
            onStrategySelect(strategyType);
            onClose();
          }}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
            strategyType === recommendedStrategy
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          Select {strategyType} Strategy
        </button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={24} />
              <Dialog.Title className="text-xl font-semibold">
                Investment Strategy Planner
              </Dialog.Title>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">What's your risk tolerance?</h3>
            <div className="flex gap-4">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskTolerance(level)}
                  className={`flex-1 py-3 px-4 rounded-xl capitalize transition-all ${
                    riskTolerance === level
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level} Risk Tolerance
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {(Object.keys(investmentStrategies) as Array<keyof typeof investmentStrategies>).map((strategy) => 
              renderProjection(strategy)
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};