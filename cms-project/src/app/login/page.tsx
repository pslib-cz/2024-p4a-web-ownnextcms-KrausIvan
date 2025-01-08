"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
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
        <div>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <button
                onClick={() =>
                    signIn("github", {callbackUrl: "/dashboard"})
                }
            >
                Login with GitHub
            </button>
        </div>
    );
}
