"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Register() {
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const response = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            setError("Registration failed");
        } else {
            setError(null);
            window.location.href = "/login";
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <h1>Register</h1>
                {error && <p style={{color: "red"}}>{error}</p>}
                <input type="text" name="username" placeholder="Username" required/>
                <input type="email" name="email" placeholder="Email" required/>
                <input type="password" name="password" placeholder="Password" required/>
                <button type="submit">Register</button>
            </form>
            <button
                onClick={() =>
                    signIn("github", {callbackUrl: "/login?isNewUser=true"})
                }
            >
                Register with GitHub
            </button>

        </div>
    );
}
