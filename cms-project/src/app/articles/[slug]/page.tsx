import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./ArticleDetail.module.scss";

interface ArticleDetailProps {
    params: { slug: string };
}

export default async function ArticleDetail({ params }: ArticleDetailProps) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
        include: {
            categories: true,
            author: true,
        },
    });

    if (!article) {
        notFound();
    }

    return (
        <div className={styles.detailContainer}>
            <Link href="/articles">
                <button className={styles.backButton}>Zpět</button>
            </Link>
            <h1 className={styles.detailTitle}>{article.title}</h1>
            <div className={styles.metaInfo}>
                <span className={styles.author}>Autor: {article.author.name}</span>
                <span className={styles.date}>
                    Datum: {new Date(article.createdAt).toLocaleDateString("cs-CZ")}
                </span>
            </div>
            <div className={styles.detailContent}>{article.content}</div>
            <div className={styles.categoriesSection}>
                <h3>Kategorie:</h3>
                <ul>
                    {article.categories.map((category) => (
                        <li key={category.id} className={styles.categoryItem}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
