'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'Admin') {
            router.push('/login');
            return;
        }

        setUser(parsedUser);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) {
        return <div className="flex-center" style={{ minHeight: '100vh' }}><div className="spinner"></div></div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{
                width: '280px',
                background: 'var(--bg-secondary)',
                padding: '2rem 1rem',
                borderRight: '1px solid var(--glass-border)',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h2 style={{
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        🧠 PsyPlatform
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Administration</p>
                </div>

                <nav style={{ marginBottom: '2rem' }}>
                    <a href="/dashboard/admin" style={navLinkStyle}>📊 Tableau de bord</a>
                    <a href="/dashboard/admin/users" style={navLinkStyle}>👥 Utilisateurs</a>
                    <a href="/dashboard/admin/complaints" style={navLinkStyle}>⚠️ Réclamations</a>
                    <a href="/dashboard/admin/reports" style={navLinkStyle}>📈 Rapports</a>
                </nav>

                <div style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Administrateur</p>
                    <p style={{ fontWeight: 600, marginBottom: 0 }}>{user.prenom} {user.nom}</p>
                </div>

                <button onClick={handleLogout} className="btn btn-outline w-full">🚪 Déconnexion</button>
            </aside>

            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
        </div>
    );
}

const navLinkStyle = {
    display: 'block',
    padding: '0.875rem 1rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
    marginBottom: '0.5rem',
    fontWeight: 500
};
