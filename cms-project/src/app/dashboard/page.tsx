// Odeberte "use client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";

export default async function Dashboard() {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <h1>Vítejte, {session.user?.name || "Uživatel"}!</h1>
            <p>Toto je vaše dashboard.</p>
            <div>
                <h2>Informace o uživateli</h2>
                <ul>
                    <li><strong>Jméno:</strong> {session.user?.name}</li>
                    <li><strong>Email:</strong> {session.user?.email}</li>
                </ul>
            </div>
            <LogoutButton />
        </div>
    );
}