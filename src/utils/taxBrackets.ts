// 2024 Federal Tax Brackets
export const federalTaxBrackets = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 }
] as const;

export const calculateFederalTax = (income: number): {
  totalTax: number;
  brackets: Array<{
    amount: number;
    rate: number;
    tax: number;
  }>;
} => {
  let totalTax = 0;
  const brackets = [];

  for (let i = 0; i < federalTaxBrackets.length; i++) {
    const { min, max, rate } = federalTaxBrackets[i];
    const prevMax = i > 0 ? federalTaxBrackets[i - 1].max : 0;
    
    if (income > min) {
      const taxableAmount = Math.min(income - prevMax, max - prevMax);
      const bracketTax = taxableAmount * rate;
      
      totalTax += bracketTax;
      brackets.push({
        amount: taxableAmount,
        rate: rate * 100,
        tax: bracketTax
      });
    }
  }

  return { totalTax, brackets };
};