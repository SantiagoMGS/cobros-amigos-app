import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes (opcional)
  await prisma.installmentPayment.deleteMany();
  await prisma.capitalPayment.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const marcos = await prisma.user.create({
    data: {
      username: "marcos",
      password: "megustalaverga",
      name: "Marcos Arango",
      loanAmount: 10465300,
    },
  });

  const jair = await prisma.user.create({
    data: {
      username: "jair",
      password: "jair",
      name: "Jair Viana",
      loanAmount: 14585050,
    },
  });

  const santiago = await prisma.user.create({
    data: {
      username: "santiago",
      password: "SantiagoMartinez123*",
      name: "Santiago",
      loanAmount: 26482221 - 10465300 - 14585050,
    },
  });

  console.log("✅ Usuarios creados:");
  console.log("  - Marcos Arango (marcos)");
  console.log("  - Jair Viana (jair)");
  console.log("  - Santiago (santiago)");
  console.log("\n🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
