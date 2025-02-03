import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./ArticlesPage.module.scss";

interface ArticlesPageProps {
    searchParams: {
        query?: string;
        category?: string;
    };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const session = await getServerSession(authOptions);
    const categories = await prisma.category.findMany();

    const where: any = {};

    if (searchParams.query) {
        where.OR = [
            { title: { contains: searchParams.query } },
            { content: { contains: searchParams.query } },
        ];
    }

    if (searchParams.category) {
        where.categories = {
            some: {
                id: searchParams.category,
            },
        };
    }

    const articles = await prisma.article.findMany({
        where,
        include: { categories: true },
    });

    return (
        <div className={styles.articlesContainer}>
            <div className={styles.topBar}>
                {session ? (
                    <Link href="/dashboard" className={styles.userButton}>
                        Přejít na Dashboard
                    </Link>
                ) : (
                    <Link href="/login" className={styles.userButton}>
                        Login
                    </Link>
                )}
            </div>

            <h1 className={styles.articlesTitle}>Seznam veřejně dostupných článků</h1>

            <form className={styles.filterForm} method="GET">
                <input
                    type="text"
                    name="query"
                    placeholder="Vyhledávání..."
                    defaultValue={searchParams.query || ""}
                />
                <select name="category" defaultValue={searchParams.category || ""}>
                    <option value="">Všechny kategorie</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Filtrovat</button>
                <Link href="/articles" className={styles.resetButton}>
                    Reset
                </Link>
            </form>

            <ul className={styles.articlesList}>
                {articles.map((article) => (
                    <li key={article.slug} className={styles.articleCard}>
                        <h2 className={styles.articleTitle}>{article.title}</h2>
                        <p className={styles.articleExcerpt}>
                            {article.content.length > 100
                                ? article.content.slice(0, 100) + "..."
                                : article.content}
                        </p>
                        <p className={styles.articleCategories}>
                            Kategorie:{" "}
                            {article.categories.map((cat) => cat.name).join(", ") || "Žádné"}
                        </p>
                        <Link className={styles.readMoreButton} href={`/articles/${article.slug}`}>
                            Detail
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
