import React, { useState } from 'react';
import { Calculator, ChevronDown, ArrowRight } from 'lucide-react';
import { stateTaxRates, type State } from '../utils/taxRates';
import { calculateFederalTax } from '../utils/taxBrackets';
import { calculateStateTax } from '../utils/stateTaxBrackets';
import { TaxBreakdown } from './TaxBreakdown';

export const TaxEstimator = () => {
  const [income, setIncome] = useState('');
  const [selectedState, setSelectedState] = useState<State>('California');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [calculations, setCalculations] = useState<{
    federalTax: number;
    stateTax: number;
    federalBrackets: Array<{ amount: number; rate: number; tax: number; }>;
    stateBrackets: Array<{ amount: number; rate: number; tax: number; }>;
  } | null>(null);

  const handleCalculate = () => {
    if (income) {
      const incomeNum = Number(income);
      const { totalTax: federalTax, brackets: federalBrackets } = calculateFederalTax(incomeNum);
      const { totalTax: stateTax, brackets: stateBrackets } = calculateStateTax(incomeNum, selectedState);

      setCalculations({
        federalTax,
        stateTax,
        federalBrackets,
        stateBrackets,
      });
    }
  };

  const totalTax = calculations ? calculations.federalTax + calculations.stateTax : null;
  const effectiveTaxRate = totalTax && income ? ((totalTax / Number(income)) * 100).toFixed(1) : null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold">Tax Estimator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Income
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your annual income"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as State)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.keys(stateTaxRates).sort().map((state) => (
              <option key={state} value={state}>
                {state} {stateTaxRates[state as State] === 0 ? '(No State Income Tax)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate Tax Estimate
        </button>

        {calculations && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Federal Tax:</span>
                  <span className="font-semibold">${calculations.federalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State Tax ({selectedState}):</span>
                  <span className="font-semibold">${calculations.stateTax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tax:</span>
                    <span className="font-semibold">${totalTax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective Tax Rate:</span>
                    <span className="font-semibold">{effectiveTaxRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Take-Home Amount:</span>
                    <span className="font-semibold">
                      ${(Number(income) - (totalTax || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  showBreakdown ? 'rotate-180' : ''
                }`}
              />
              {showBreakdown ? 'Hide' : 'Show'} Tax Breakdown
            </button>

            {showBreakdown && (
              <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
                <TaxBreakdown
                  title="Federal Tax Breakdown"
                  brackets={calculations.federalBrackets}
                />
                <TaxBreakdown
                  title={`State Tax Breakdown (${selectedState})`}
                  brackets={calculations.stateBrackets}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};