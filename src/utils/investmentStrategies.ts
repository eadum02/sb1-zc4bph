export const investmentStrategies = {
  conservative: {
    type: 'conservative',
    allocation: {
      stocks: 30,
      bonds: 50,
      cash: 20,
    },
    expectedReturn: 0.05,
    description: 'Lower risk, stable returns. Ideal for short-term goals or risk-averse investors.',
    recommendations: [
      'High-yield savings accounts (2-3% APY)',
      'Government bonds (Treasury Bills)',
      'Short-term corporate bonds',
      'Blue-chip dividend stocks'
    ],
    riskLevel: 'low',
    minimumTimeframe: '1-3 years',
    fees: 'Low (0.1-0.3% expense ratio)',
    rebalancingFrequency: 'Quarterly'
  },
  moderate: {
    type: 'moderate',
    allocation: {
      stocks: 60,
      bonds: 30,
      cash: 10,
    },
    expectedReturn: 0.08,
    description: 'Balanced approach with moderate growth potential and risk.',
    recommendations: [
      'Total market index funds',
      'Investment-grade corporate bonds',
      'Real Estate Investment Trusts (REITs)',
      'International developed markets'
    ],
    riskLevel: 'medium',
    minimumTimeframe: '3-7 years',
    fees: 'Moderate (0.2-0.5% expense ratio)',
    rebalancingFrequency: 'Semi-annually'
  },
  aggressive: {
    type: 'aggressive',
    allocation: {
      stocks: 80,
      bonds: 15,
      cash: 5,
    },
    expectedReturn: 0.10,
    description: 'Higher risk with potential for greater returns. Suitable for long-term goals.',
    recommendations: [
      'Growth stocks and small-cap funds',
      'Emerging markets ETFs',
      'High-yield corporate bonds',
      'Sector-specific investments'
    ],
    riskLevel: 'high',
    minimumTimeframe: '7+ years',
    fees: 'Higher (0.5-0.8% expense ratio)',
    rebalancingFrequency: 'Annually'
  }
} as const;

export const calculateProjectedGrowth = (
  currentAmount: number,
  monthlyContribution: number,
  years: number,
  expectedReturn: number,
  fees: number = 0.003 // Default to 0.3% annual fee
): number => {
  const monthlyRate = (expectedReturn - fees) / 12;
  const months = years * 12;
  let futureValue = currentAmount;

  for (let i = 0; i < months; i++) {
    futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
  }

  return futureValue;
};

export const getRecommendedStrategy = (
  timeHorizon: number,
  riskTolerance: 'low' | 'medium' | 'high',
  currentAmount: number,
  targetAmount: number
): keyof typeof investmentStrategies => {
  // Consider both time horizon and amount when recommending strategy
  const amountFactor = currentAmount / targetAmount;
  
  if (timeHorizon < 3 || riskTolerance === 'low' || amountFactor > 0.8) {
    return 'conservative';
  } else if (timeHorizon < 7 || riskTolerance === 'medium' || amountFactor > 0.5) {
    return 'moderate';
  }
  return 'aggressive';
};

export const getInvestmentTips = (
  strategy: keyof typeof investmentStrategies,
  currentAmount: number,
  targetAmount: number,
  timeHorizon: number
): string[] => {
  const tips: string[] = [];
  const amountNeeded = targetAmount - currentAmount;
  const monthlyNeeded = amountNeeded / (timeHorizon * 12);

  tips.push(`Consider setting up automatic monthly investments of $${monthlyNeeded.toFixed(2)}`);
  
  if (strategy === 'conservative') {
    tips.push('Focus on preserving capital while earning steady returns');
    tips.push('Look for high-yield savings accounts and short-term bonds');
  } else if (strategy === 'moderate') {
    tips.push('Maintain a balanced portfolio between growth and stability');
    tips.push('Consider dollar-cost averaging into index funds');
  } else {
    tips.push('Be prepared for market volatility and stay invested long-term');
    tips.push('Consider increasing contributions during market downturns');
  }

  return tips;
};

export const calculateRebalancingNeeds = (
  currentAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
  },
  targetStrategy: keyof typeof investmentStrategies
): {
  needsRebalancing: boolean;
  recommendations: string[];
} => {
  const target = investmentStrategies[targetStrategy].allocation;
  const threshold = 5; // 5% deviation threshold
  
  const stocksDiff = Math.abs(currentAllocation.stocks - target.stocks);
  const bondsDiff = Math.abs(currentAllocation.bonds - target.bonds);
  const cashDiff = Math.abs(currentAllocation.cash - target.cash);
  
  const needsRebalancing = stocksDiff > threshold || bondsDiff > threshold || cashDiff > threshold;
  
  const recommendations = [];
  if (needsRebalancing) {
    if (currentAllocation.stocks > target.stocks) {
      recommendations.push(`Reduce stocks by ${(currentAllocation.stocks - target.stocks).toFixed(1)}%`);
    } else if (currentAllocation.stocks < target.stocks) {
      recommendations.push(`Increase stocks by ${(target.stocks - currentAllocation.stocks).toFixed(1)}%`);
    }
    
    if (currentAllocation.bonds > target.bonds) {
      recommendations.push(`Reduce bonds by ${(currentAllocation.bonds - target.bonds).toFixed(1)}%`);
    } else if (currentAllocation.bonds < target.bonds) {
      recommendations.push(`Increase bonds by ${(target.bonds - currentAllocation.bonds).toFixed(1)}%`);
    }
  }
  
  return { needsRebalancing, recommendations };
};