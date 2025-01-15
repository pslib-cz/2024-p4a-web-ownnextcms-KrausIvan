import { prisma } from "@/lib/prisma";

interface ArticleProps {
    params: { slug: string };
}

export default async function ArticleDetail({ params }: ArticleProps) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
        include: { categories: true },
    });

    if (!article) {
        return <div>Článek nebyl nalezen.</div>;
    }

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.content}</p>
            <h3>Kategorie:</h3>
            <ul>
                {article.categories.map((category: { id: string; name: string }) => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
}