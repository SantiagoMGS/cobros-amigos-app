import { MONTHLY_RATE, TOTAL_INSTALLMENTS } from "@/data/users";

export interface Payment {
  installmentNumber: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  paidAmount?: number;
  pendingAmount?: number;
}

export interface PaymentHistory {
  amount: number;
}

export interface InstallmentPayment {
  installmentNumber: number;
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
  const raw = principal * (numerator / denominator);
  return Math.ceil(raw);
}

/**
 * Generate amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  fixedPayment: number,
  capitalPayments: PaymentHistory[] = [],
  installmentPayments: InstallmentPayment[] = [],
  rate: number = MONTHLY_RATE
): Payment[] {
  const schedule: Payment[] = [];

  // Apply all capital payments to the principal first
  const totalCapitalPayments = capitalPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  let balance = principal - totalCapitalPayments;

  // If all debt is paid, return empty schedule
  if (balance <= 0) {
    return [];
  }

  let installmentNumber = 1;

  while (balance > 0.01 && installmentNumber <= 100) {
    // Safety limit
    const interest = balance * rate;
    const ceiledFixedPayment = Math.ceil(fixedPayment);
    let principalPayment = ceiledFixedPayment - Math.ceil(interest);

    // Adjust if final payment
    if (principalPayment > balance) {
      principalPayment = balance;
    }

    balance -= principalPayment;

    // Calculate paid amount for this installment
    const paymentsForThisInstallment = installmentPayments.filter(
      (p) => p.installmentNumber === installmentNumber
    );
    const paidAmount = paymentsForThisInstallment.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    const totalPayment = Math.ceil(principalPayment + interest);
    const pendingAmount = Math.max(0, totalPayment - Math.ceil(paidAmount));

    schedule.push({
      installmentNumber,
      payment: totalPayment,
      interest,
      principal: principalPayment,
      balance,
      paidAmount,
      pendingAmount,
    });

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
  installmentPayments: InstallmentPayment[] = [],
  currentInstallment: number = 0,
  rate: number = MONTHLY_RATE
): number {
  const schedule = generateAmortizationSchedule(
    principal,
    fixedPayment,
    capitalPayments,
    installmentPayments,
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
  const ceiled = Math.ceil(amount);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(ceiled);
}

/**
 * Format percentage
 */
export function formatPercentage(rate: number): string {
  return (rate * 100).toFixed(3) + "%";
}
