import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Obtener todos los abonos a capital de un usuario
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

    const payments = await prisma.capitalPayment.findMany({
      where: { userId },
      orderBy: { paymentDate: "asc" },
    });

    // Transform to match the format expected by the frontend
    const formattedPayments = payments.map((p) => ({
      amount: p.amount,
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error("Error obteniendo pagos de capital:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo abono a capital
export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "userId y amount son requeridos" },
        { status: 400 }
      );
    }

    const payment = await prisma.capitalPayment.create({
      data: {
        userId,
        amount,
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error creando pago de capital:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un abono a capital
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
    const payments = await prisma.capitalPayment.findMany({
      where: { userId },
      orderBy: { paymentDate: "asc" },
    });

    const indexNum = parseInt(index);
    if (indexNum < 0 || indexNum >= payments.length) {
      return NextResponse.json({ error: "Index inválido" }, { status: 400 });
    }

    // Delete the payment at the specified index
    await prisma.capitalPayment.delete({
      where: { id: payments[indexNum].id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando pago de capital:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
