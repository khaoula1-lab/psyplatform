'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologueDashboard() {
    const [stats, setStats] = useState({ patients: 0, appointments: 0, sessions: 0 });
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appointmentsRes, patientsRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/psychologues/1/patients') // TODO: Get real psychologue ID
            ]);

            setAppointments(appointmentsRes.data.data.slice(0, 5));
            setStats({
                patients: patientsRes.data.count,
                appointments: appointmentsRes.data.count,
                sessions: appointmentsRes.data.count
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Tableau de bord</h1>

            <div className="grid-3" style={{ marginBottom: '2rem' }}>
                <div className="glass-card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                    <h3 style={{ color: 'var(--primary-light)' }}>{stats.patients}</h3>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Patients suivis</p>
                </div>
                <div className="glass-card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                    <h3 style={{ color: 'var(--accent)' }}>{stats.appointments}</h3>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Rendez-vous ce mois</p>
                </div>
                <div className="glass-card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                    <h3 style={{ color: 'var(--success)' }}>{stats.sessions}</h3>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>Séances complétées</p>
                </div>
            </div>

            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem' }}>Rendez-vous aujourd'hui</h2>
                {appointments.map(apt => (
                    <div key={apt.id_rendez_vous} style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                    }}>
                        <div className="flex-between">
                            <div>
                                <h4>{apt.patient_nom} {apt.patient_prenom}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {apt.heure_debut} - {apt.heure_fin} • {apt.type_rendez_vous}
                                </p>
                            </div>
                            <span className={`badge badge-${apt.statut === 'Confirmé' ? 'success' : 'info'}`}>
                                {apt.statut}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
