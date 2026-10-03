'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalPsychologues: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Tableau de bord administrateur</h1>

            <div className="grid-4" style={{ marginBottom: '2rem' }}>
                <div className="glass-card text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
                    <h2 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem' }}>{stats.totalPatients}</h2>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Patients</p>
                </div>
                <div className="glass-card text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👨‍⚕️</div>
                    <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{stats.totalPsychologues}</h2>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Psychologues</p>
                </div>
                <div className="glass-card text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📅</div>
                    <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>{stats.totalAppointments}</h2>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Rendez-vous</p>
                </div>
                <div className="glass-card text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                    <h2 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>{stats.totalRevenue}DH</h2>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Revenus</p>
                </div>
            </div>

            <div className="grid-2">
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1rem' }}>Actions rapides</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <a href="/dashboard/admin/users" className="btn btn-primary w-full">Gérer les utilisateurs</a>
                        <a href="/dashboard/admin/complaints" className="btn btn-secondary w-full">Voir les réclamations</a>
                        <a href="/dashboard/admin/reports" className="btn btn-success w-full">Générer un rapport</a>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '1rem' }}>Statistiques de la plateforme</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                        <div className="flex-between" style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                            <span>Taux de satisfaction</span>
                            <strong style={{ color: 'var(--success)' }}>95%</strong>
                        </div>
                        <div className="flex-between" style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                            <span>Rendez-vous ce mois</span>
                            <strong style={{ color: 'var(--primary)' }}>{stats.totalAppointments}</strong>
                        </div>
                        <div className="flex-between" style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                            <span>Nouveaux utilisateurs</span>
                            <strong style={{ color: 'var(--accent)' }}>+{stats.totalPatients}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
