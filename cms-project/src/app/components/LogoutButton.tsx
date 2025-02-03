"use client";
import { signOut } from "next-auth/react";
import styles from "./LogoutButton.module.scss";

const LogoutButton = () => {
    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/login" });
    };

    return (
        <button onClick={handleLogout} className={styles.logoutButton}>
            Odhlásit se
        </button>
    );
};

export default LogoutButton;
