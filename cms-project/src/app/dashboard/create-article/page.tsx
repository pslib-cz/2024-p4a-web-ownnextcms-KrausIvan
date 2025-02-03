"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

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
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Chyba při načítání kategorií:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    categoryIds: selectedCategories,
                }),
            });

            if (response.ok) {
                setMessage("Článek úspěšně vytvořen!");
                setTitle("");
                setContent("");
                setSelectedCategories([]);
            } else {
                setMessage("Chyba při vytváření článku.");
            }
        } catch (error) {
            console.error("Chyba při odesílání:", error);
            setMessage("Chyba při vytváření článku.");
        }
    };

    return (
        <Container style={{ maxWidth: "600px", marginTop: "50px" }}>
            <Row>
                <Col>
                    <h1 className="text-center mb-4">Vytvořit nový článek</h1>

                    {message && <Alert variant="info">{message}</Alert>}

                    <Card className="shadow-sm">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="title" className="mb-3">
                                    <Form.Label>Název</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Např. Můj skvělý článek"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="content" className="mb-3">
                                    <Form.Label>Obsah</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Sem napište text článku..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="categories" className="mb-3">
                                    <Form.Label>Kategorie</Form.Label>
                                    <Form.Select
                                        multiple
                                        value={selectedCategories}
                                        onChange={(e) => {
                                            const selected = Array.from(
                                                e.target.selectedOptions,
                                                (opt) => opt.value
                                            );
                                            setSelectedCategories(selected);
                                        }}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Držte Ctrl (Windows) nebo Cmd (Mac) pro výběr více kategorií
                                    </Form.Text>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Vytvořit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
