"use client";
import { useState, useEffect } from "react";

interface Category {
    id: string;
    name: string;
}

export default function CreateArticlePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/articles", {
            method: "POST",
            body: JSON.stringify({
                title,
                content,
                categoryIds: selectedCategories,
            }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            setMessage("Článek úspěšně vytvořen!");
            setTitle("");
            setContent("");
            setSelectedCategories([]);
        } else {
            setMessage("Chyba při vytváření článku.");
        }
    };

    return (
        <div>
            <h1>Vytvořit nový článek</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Název:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Obsah:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="categories">Kategorie:</label>
                    <select
                        multiple
                        id="categories"
                        value={selectedCategories}
                        onChange={(e) =>
                            setSelectedCategories(
                                Array.from(e.target.selectedOptions, (option) => option.value)
                            )
                        }
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Vytvořit</button>
            </form>
        </div>
    );
}