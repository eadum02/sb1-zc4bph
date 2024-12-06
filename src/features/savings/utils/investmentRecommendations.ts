import { differenceInYears } from 'date-fns';

export type RiskTolerance = 'low' | 'medium' | 'high';

export const getRecommendedRiskLevel = (
  timeHorizon: number,
  riskTolerance: RiskTolerance
): RiskTolerance => {
  if (timeHorizon < 3 || riskTolerance === 'low') {
    return 'low';
  } else if (timeHorizon < 7 || riskTolerance === 'medium') {
    return 'medium';
  }
  return 'high';
};

export const getInvestmentTips = (
  timeHorizon: number,
  riskTolerance: RiskTolerance
): string[] => {
  const tips: string[] = [
    'Diversify your investments across different asset classes',
    'Consider dollar-cost averaging to reduce timing risk',
  ];

  if (timeHorizon < 3) {
    tips.push('Focus on capital preservation for short-term goals');
    tips.push('Consider high-yield savings accounts or CDs');
  } else if (timeHorizon < 7) {
    tips.push('Balance between growth and stability');
    tips.push('Consider index funds for steady growth');
  } else {
    tips.push('You can afford to take more risk for potentially higher returns');
    tips.push('Consider growth stocks and emerging markets');
  }

  return tips;
};