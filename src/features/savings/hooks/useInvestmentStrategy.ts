import { useState } from 'react';
import { differenceInYears } from 'date-fns';
import { RiskTolerance } from '../utils/investmentRecommendations';
import { calculateProjectedValue } from '../utils/savingsCalculations';
import { investmentStrategies } from '../../../utils/investmentStrategies';

export const useInvestmentStrategy = (
  currentAmount: number,
  targetAmount: number,
  deadline: Date
) => {
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('medium');
  const timeHorizon = differenceInYears(deadline, new Date());
  const monthlyContribution = (targetAmount - currentAmount) / (timeHorizon * 12);

  const getProjectedAmount = (strategyType: keyof typeof investmentStrategies) => {
    const strategy = investmentStrategies[strategyType];
    return calculateProjectedValue(
      currentAmount,
      monthlyContribution,
      timeHorizon,
      strategy.expectedReturn
    );
  };

  return {
    riskTolerance,
    setRiskTolerance,
    timeHorizon,
    monthlyContribution,
    getProjectedAmount,
  };
};