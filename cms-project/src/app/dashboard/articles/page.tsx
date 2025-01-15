"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
    slug: string;
    title: string;
    content: string;
    categories: { id: string; name: string }[];
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);

    const fetchArticles = async () => {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(data);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div>
            <h1>Seznam článků</h1>
            <ul>
                {articles.map((article) => (
                    <li key={article.slug}>
                        <h2>{article.title}</h2>
                        <p>{article.content}</p>
                        <p>
                            Kategorie:{" "}
                            {article.categories.map((cat) => cat.name).join(", ") || "Žádné"}
                        </p>
                        <Link href={`/dashboard/articles/${article.slug}`}>Detail</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}