import { MONTHLY_RATE, TOTAL_INSTALLMENTS } from "@/data/users";

export interface Payment {
  installmentNumber: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface PaymentHistory {
  date: string;
  amount: number;
}

/**
 * Calculate fixed monthly payment using French amortization system
 * Formula: C = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  principal: number,
  rate: number = MONTHLY_RATE,
  periods: number = TOTAL_INSTALLMENTS
): number {
  const numerator = rate * Math.pow(1 + rate, periods);
  const denominator = Math.pow(1 + rate, periods) - 1;
  return principal * (numerator / denominator);
}

/**
 * Generate amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  fixedPayment: number,
  capitalPayments: PaymentHistory[] = [],
  rate: number = MONTHLY_RATE
): Payment[] {
  const schedule: Payment[] = [];
  let balance = principal;
  let installmentNumber = 1;

  // Sort capital payments by date (assuming format is sortable)
  const sortedCapitalPayments = [...capitalPayments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  while (balance > 0.01 && installmentNumber <= 100) {
    // Safety limit
    // Check if there's a capital payment for this installment
    const capitalPayment = sortedCapitalPayments.find(
      (cp) => parseInt(cp.date.split("-")[1]) === installmentNumber
    );

    const interest = balance * rate;
    let principalPayment = fixedPayment - interest;

    // Adjust if final payment
    if (principalPayment > balance) {
      principalPayment = balance;
    }

    balance -= principalPayment;

    schedule.push({
      installmentNumber,
      payment: principalPayment + interest,
      interest,
      principal: principalPayment,
      balance,
    });

    // Apply capital payment after regular payment
    if (capitalPayment) {
      balance -= capitalPayment.amount;
      if (balance < 0) balance = 0;
    }

    installmentNumber++;
  }

  return schedule;
}

/**
 * Calculate remaining balance after capital payments
 */
export function calculateRemainingBalance(
  principal: number,
  fixedPayment: number,
  capitalPayments: PaymentHistory[] = [],
  currentInstallment: number = 0,
  rate: number = MONTHLY_RATE
): number {
  const schedule = generateAmortizationSchedule(
    principal,
    fixedPayment,
    capitalPayments,
    rate
  );

  if (currentInstallment >= schedule.length) {
    return 0;
  }

  if (currentInstallment === 0) {
    return principal;
  }

  return schedule[currentInstallment - 1].balance;
}

/**
 * Format currency in COP
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(rate: number): string {
  return (rate * 100).toFixed(3) + "%";
}
