"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: "", password: "", email: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to register user");
            }

            const data = await response.json();
            setSuccess("User registered successfully! You can now log in.");
            setFormData({ username: "", password: "", email: "" });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h1>Register</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" style={{ padding: "10px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "5px" }}>
                    Register
                </button>
            </form>
        </div>
    );
}