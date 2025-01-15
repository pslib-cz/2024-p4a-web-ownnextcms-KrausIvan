"use client";
import { useState, useEffect } from "react";

interface Category {
    id: string;
    name: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");

    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const createCategory = async () => {
        await fetch("/api/categories", {
            method: "POST",
            body: JSON.stringify({ name: newCategory }),
            headers: { "Content-Type": "application/json" },
        });
        setNewCategory("");
        fetchCategories();
    };

    const deleteCategory = async (id: string) => {
        await fetch("/api/categories", {
            method: "DELETE",
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" },
        });
        fetchCategories();
    };

    return (
        <div>
            <h1>Správa kategorií</h1>
            <input
                type="text"
                placeholder="Název nové kategorie"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={createCategory}>Vytvořit</button>
            <ul>
                {categories.map((cat) => (
                    <li key={cat.id}>
                        {cat.name} <button onClick={() => deleteCategory(cat.id)}>Smazat</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}