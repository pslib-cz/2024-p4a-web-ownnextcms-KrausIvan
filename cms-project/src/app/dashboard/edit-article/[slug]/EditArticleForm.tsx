"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./EditArticlePage.module.scss";

interface EditArticleFormProps {
    initialArticle: {
        title: string;
        content: string;
        slug: string;
        categories: { id: string }[];
    };
    allCategories: { id: string; name: string }[];
}

export default function EditArticleForm({ initialArticle, allCategories }: EditArticleFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialArticle.title);
    const [content, setContent] = useState(initialArticle.content);
    const [selectedCategories, setSelectedCategories] = useState(
        initialArticle.categories.map((cat) => cat.id)
    );
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        selectedCategories.forEach((id) => formData.append("categoryIds", id));

        try {
            const res = await fetch(`/api/articles/${initialArticle.slug}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                setMessage("Článek byl úspěšně aktualizován!");
                setIsSuccess(true);

            } else {
                const errorData = await res.json();
                setMessage("Chyba: " + (errorData.error || "Neznámá chyba"));
            }
        } catch (error) {
            setMessage("Chyba při odesílání formuláře.");
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedCategories(values);
    };

    return (
        <form className={styles.editForm} onSubmit={handleSubmit} encType="multipart/form-data">
            <div className={styles.formGroup}>
                <label htmlFor="title">Název:</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="content">Obsah:</label>
                <textarea
                    name="content"
                    id="content"
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="categoryIds">Kategorie:</label>
                <select
                    name="categoryIds"
                    id="categoryIds"
                    multiple
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                >
                    {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton}>
                    Uložit změny
                </button>
                <Link href="/dashboard/my-articles" className={styles.cancelButton}>
                    Zrušit
                </Link>
            </div>

            {message && (
                <p className={isSuccess ? styles.successMessage : styles.errorMessage}>{message}</p>
            )}
        </form>
    );
}
