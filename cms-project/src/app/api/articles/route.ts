import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
    const { title, content, authorId, categoryIds } = await req.json();

    if (!title || !content || !authorId) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const article = await prisma.article.create({
        data: {
            title,
            content,
            slug,
            authorId,
            categories: {
                connect: categoryIds?.map((id: string) => ({ id })),
            },
        },
    });

    return NextResponse.json(article);
}

export async function GET() {
    const articles = await prisma.article.findMany({
        include: { categories: true, author: true },
    });
    return NextResponse.json(articles);
}