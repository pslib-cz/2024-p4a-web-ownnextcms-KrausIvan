"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/login" });
    };

    return (
        <button onClick={handleLogout}>Odhlásit se</button>
    );
};

export default LogoutButton;