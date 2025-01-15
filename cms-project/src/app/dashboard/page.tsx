import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <h1>Vítejte, {session.user?.name || "Uživatel"}!</h1>
            <div>
                <h2>Správa obsahu</h2>
                <ul>
                    <li>
                        <Link href="/dashboard/articles">📄 Seznam článků</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/create-article">✏️ Vytvořit nový článek</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/categories">🗂️ Správa kategorií</Link>
                    </li>
                </ul>
            </div>
            <LogoutButton />
        </div>
    );
}