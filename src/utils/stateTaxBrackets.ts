import { stateTaxRates } from './taxRates';

// 2024 State Tax Brackets (for states with progressive tax systems)
export const stateTaxBrackets = {
  California: [
    { min: 0, max: 10099, rate: 0.01 },
    { min: 10099, max: 23942, rate: 0.02 },
    { min: 23942, max: 37788, rate: 0.04 },
    { min: 37788, max: 52455, rate: 0.06 },
    { min: 52455, max: 66295, rate: 0.08 },
    { min: 66295, max: 338639, rate: 0.093 },
    { min: 338639, max: 406364, rate: 0.103 },
    { min: 406364, max: 677275, rate: 0.113 },
    { min: 677275, max: Infinity, rate: 0.123 }
  ],
  NewYork: [
    { min: 0, max: 8500, rate: 0.04 },
    { min: 8500, max: 11700, rate: 0.045 },
    { min: 11700, max: 13900, rate: 0.0525 },
    { min: 13900, max: 80650, rate: 0.055 },
    { min: 80650, max: 215400, rate: 0.06 },
    { min: 215400, max: 1077550, rate: 0.0685 },
    { min: 1077550, max: 5000000, rate: 0.0965 },
    { min: 5000000, max: 25000000, rate: 0.103 },
    { min: 25000000, max: Infinity, rate: 0.109 }
  ],
} as const;

export const calculateStateTax = (income: number, state: keyof typeof stateTaxBrackets | string): {
  totalTax: number;
  brackets: Array<{
    amount: number;
    rate: number;
    tax: number;
  }>;
} => {
  // For states with no income tax
  if (stateTaxRates[state] === 0) {
    return {
      totalTax: 0,
      brackets: [{
        amount: income,
        rate: 0,
        tax: 0
      }]
    };
  }

  // For states with progressive tax brackets
  if (state in stateTaxBrackets) {
    const brackets = stateTaxBrackets[state as keyof typeof stateTaxBrackets];
    let totalTax = 0;
    const taxBrackets = [];

    for (let i = 0; i < brackets.length; i++) {
      const { min, max, rate } = brackets[i];
      const prevMax = i > 0 ? brackets[i - 1].max : 0;
      
      if (income > min) {
        const taxableAmount = Math.min(income - prevMax, max - prevMax);
        const bracketTax = taxableAmount * rate;
        
        totalTax += bracketTax;
        taxBrackets.push({
          amount: taxableAmount,
          rate: rate * 100,
          tax: bracketTax
        });
      }
    }

    return { totalTax, brackets: taxBrackets };
  }
  
  // For states with flat tax rates
  const flatRate = stateTaxRates[state] || 0;
  return {
    totalTax: income * flatRate,
    brackets: [{
      amount: income,
      rate: flatRate * 100,
      tax: income * flatRate
    }]
  };
};