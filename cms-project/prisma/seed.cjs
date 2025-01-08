const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin", 10);

    const user = await prisma.user.create({
        data: {
            username: "admin",
            password: hashedPassword,
            email: "admin@admin.com",
        },
    });

    console.log("Seeded user:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
