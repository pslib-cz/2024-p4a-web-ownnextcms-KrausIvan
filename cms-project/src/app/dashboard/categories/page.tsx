"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";

interface Category {
    id: string;
    name: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");

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

    const createCategory = async () => {
        if (!newCategory.trim()) return;
        await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCategory }),
        });
        setNewCategory("");
        fetchCategories();
    };

    const deleteCategory = async (id: string) => {
        await fetch("/api/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchCategories();
    };

    return (
        <Container style={{ maxWidth: "600px", marginTop: "50px" }}>
            <Row>
                <Col>
                    <h1 className="text-center mb-4">Správa kategorií</h1>

                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    createCategory();
                                }}
                            >
                                <Form.Group controlId="categoryName" className="mb-3">
                                    <Form.Label>Název nové kategorie</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Např. Technologie"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Vytvořit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header>
                            <strong>Seznam kategorií</strong>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {categories.map((cat) => (
                                <ListGroup.Item
                                    key={cat.id}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    {cat.name}
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => deleteCategory(cat.id)}
                                    >
                                        Smazat
                                    </Button>
                                </ListGroup.Item>
                            ))}
                            {categories.length === 0 && (
                                <ListGroup.Item className="text-muted">
                                    Zatím žádné kategorie.
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
