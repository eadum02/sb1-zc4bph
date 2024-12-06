// 2024 Tax Brackets for demonstration purposes
export const stateTaxRates = {
  'Alabama': 0.05,
  'Alaska': 0,
  'Arizona': 0.045,
  'Arkansas': 0.055,
  'California': 0.133,
  'Colorado': 0.0463,
  'Connecticut': 0.0699,
  'Delaware': 0.066,
  'Florida': 0,
  'Georgia': 0.0575,
  'Hawaii': 0.11,
  'Idaho': 0.058,
  'Illinois': 0.0495,
  'Indiana': 0.0323,
  'Iowa': 0.0575,
  'Kansas': 0.057,
  'Kentucky': 0.05,
  'Louisiana': 0.0425,
  'Maine': 0.0715,
  'Maryland': 0.0575,
  'Massachusetts': 0.05,
  'Michigan': 0.0425,
  'Minnesota': 0.0985,
  'Mississippi': 0.05,
  'Missouri': 0.054,
  'Montana': 0.068,
  'Nebraska': 0.0684,
  'Nevada': 0,
  'New Hampshire': 0.05,
  'New Jersey': 0.1075,
  'New Mexico': 0.059,
  'New York': 0.109,
  'North Carolina': 0.0499,
  'North Dakota': 0.029,
  'Ohio': 0.0399,
  'Oklahoma': 0.0475,
  'Oregon': 0.099,
  'Pennsylvania': 0.0307,
  'Rhode Island': 0.0599,
  'South Carolina': 0.07,
  'South Dakota': 0,
  'Tennessee': 0,
  'Texas': 0,
  'Utah': 0.0485,
  'Vermont': 0.0875,
  'Virginia': 0.0575,
  'Washington': 0,
  'West Virginia': 0.065,
  'Wisconsin': 0.0765,
  'Wyoming': 0,
} as const;

export type State = keyof typeof stateTaxRates;

export const calculateTaxEstimate = (income: number, state: State): number => {
  const stateTax = income * stateTaxRates[state];
  
  // Federal tax brackets (simplified for demonstration)
  let federalTax = 0;
  if (income <= 11600) {
    federalTax = income * 0.10;
  } else if (income <= 47150) {
    federalTax = 1160 + (income - 11600) * 0.12;
  } else if (income <= 100525) {
    federalTax = 5426 + (income - 47150) * 0.22;
  } else if (income <= 191950) {
    federalTax = 17168.50 + (income - 100525) * 0.24;
  } else if (income <= 243725) {
    federalTax = 39110.50 + (income - 191950) * 0.32;
  } else if (income <= 609350) {
    federalTax = 55678.50 + (income - 243725) * 0.35;
  } else {
    federalTax = 183647.25 + (income - 609350) * 0.37;
  }

  return stateTax + federalTax;
};