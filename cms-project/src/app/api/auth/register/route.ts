import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const { username, password, email } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: { username, password: hashedPassword, email },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
}