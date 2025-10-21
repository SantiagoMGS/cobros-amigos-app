import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Obtener todos los pagos de cuotas de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    const payments = await prisma.installmentPayment.findMany({
      where: { userId },
      orderBy: [{ installmentNumber: "asc" }, { paymentDate: "asc" }],
    });

    // Transform to match the format expected by the frontend
    const formattedPayments = payments.map((p) => ({
      installmentNumber: p.installmentNumber,
      amount: p.amount,
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error("Error obteniendo pagos de cuotas:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo pago de cuota
export async function POST(request: NextRequest) {
  try {
    const { userId, installmentNumber, amount } = await request.json();

    if (!userId || !installmentNumber || !amount) {
      return NextResponse.json(
        { error: "userId, installmentNumber y amount son requeridos" },
        { status: 400 }
      );
    }

    const payment = await prisma.installmentPayment.create({
      data: {
        userId,
        installmentNumber,
        amount,
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error creando pago de cuota:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un pago de cuota
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const index = searchParams.get("index");

    if (!userId || index === null) {
      return NextResponse.json(
        { error: "userId e index son requeridos" },
        { status: 400 }
      );
    }

    // Get all payments for this user
    const payments = await prisma.installmentPayment.findMany({
      where: { userId },
      orderBy: [{ installmentNumber: "asc" }, { paymentDate: "asc" }],
    });

    const indexNum = parseInt(index);
    if (indexNum < 0 || indexNum >= payments.length) {
      return NextResponse.json({ error: "Index inválido" }, { status: 400 });
    }

    // Delete the payment at the specified index
    await prisma.installmentPayment.delete({
      where: { id: payments[indexNum].id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando pago de cuota:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
