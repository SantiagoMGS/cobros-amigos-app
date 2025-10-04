import { NextRequest, NextResponse } from "next/server";
import { users } from "@/data/users";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
