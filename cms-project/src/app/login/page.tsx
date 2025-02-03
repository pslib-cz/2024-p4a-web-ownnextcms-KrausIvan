"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!result?.ok) {
            setError("Invalid email or password");
        } else {
            setError(null);
            window.location.href = "/dashboard";
        }
    };

    return (
        <Container style={{ maxWidth: "400px", marginTop: "50px" }}>
            <Row>
                <Col>
                    <h1 className="text-center mb-4">Login</h1>

                    {error && (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    )}

                    <Card className="shadow-sm">
                        <Card.Body>
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        required
                                    />
                                </Form.Group>

                                <Button type="submit" variant="primary" className="w-100">
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <div className="mt-3 text-center">
                        <hr />
                        <Button
                            variant="dark"
                            className="w-100"
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        >
                            Login with GitHub
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
