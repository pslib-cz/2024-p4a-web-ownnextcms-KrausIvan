import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name } = await req.json();

    if (!name) {
        return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const category = await prisma.category.create({
        data: { name },
    });

    return NextResponse.json(category);
}

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    await prisma.category.delete({
        where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully." });
}