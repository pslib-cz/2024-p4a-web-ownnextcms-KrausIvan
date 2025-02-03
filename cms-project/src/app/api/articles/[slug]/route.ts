import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import slugify from "slugify";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
        include: { categories: true, author: true },
    });
    if (!article) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    return NextResponse.json(article);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized (not logged in)." }, { status: 401 });
    }
    const article = await prisma.article.findUnique({ where: { slug: params.slug } });
    if (!article) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    if (article.authorId !== session.user?.id) {
        return NextResponse.json(
            { error: "You are not authorized to delete this article." },
            { status: 403 }
        );
    }
    await prisma.article.delete({ where: { slug: params.slug } });
    return NextResponse.json({ message: "Article deleted successfully." });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized (not logged in)." }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (
        !contentType.includes("multipart/form-data") &&
        !contentType.includes("application/x-www-form-urlencoded")
    ) {
        return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const categoryIds = formData.getAll("categoryIds") as string[];

    if (!title || !content) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const article = await prisma.article.findUnique({ where: { slug: params.slug } });
    if (!article) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    if (article.authorId !== session.user?.id) {
        return NextResponse.json(
            { error: "You are not authorized to update this article." },
            { status: 403 }
        );
    }

    const newSlug = slugify(title, { lower: true, strict: true });

    await prisma.article.update({
        where: { slug: params.slug },
        data: {
            title,
            content,
            categories: {
                set: categoryIds.map((catId) => ({ id: catId })),
            },
        },
    });

    return NextResponse.json({ message: "Article updated successfully." });
}
