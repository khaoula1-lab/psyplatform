'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appointmentsRes, exercisesRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/patients/1/exercises') // TODO: Get real patient ID
            ]);

            setAppointments(appointmentsRes.data.data.slice(0, 3));
            setExercises(exercisesRes.data.data.slice(0, 3));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Tableau de bord</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenue sur votre espace personnel</p>
            </div>

            {/* Stats */}
            <div className="grid-3" style={{ marginBottom: '2rem' }}>
                <div className="glass-card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                    <h3 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem' }}>
                        {appointments.length}
                    </h3>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>
                        Rendez-vous à venir
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                        {exercises.length}
                    </h3>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>
                        Exercices en cours
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💯</div>
                    <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
                        85%
                    </h3>
                    <p style={{ marginBottom: 0, color: 'var(--text-muted)' }}>
                        Taux de complétion
                    </p>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ marginBottom: 0 }}>Prochains rendez-vous</h2>
                    <a href="/dashboard/patient/appointments" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Voir tout
                    </a>
                </div>

                {appointments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {appointments.map((apt, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div className="flex-between">
                                    <div>
                                        <h4 style={{ marginBottom: '0.5rem' }}>
                                            Dr. {apt.psy_nom} {apt.psy_prenom}
                                        </h4>
                                        <p style={{ marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            {apt.date_rendez_vous} à {apt.heure_debut}
                                        </p>
                                    </div>
                                    <span className={`badge ${apt.statut === 'Confirmé' ? 'badge-success' : 'badge-info'}`}>
                                        {apt.statut}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        Aucun rendez-vous à venir
                    </p>
                )}
            </div>

            {/* Exercises */}
            <div className="glass-card">
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ marginBottom: 0 }}>Exercices récents</h2>
                    <a href="/dashboard/patient/exercises" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Voir tout
                    </a>
                </div>

                {exercises.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {exercises.map((ex, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div className="flex-between">
                                    <div>
                                        <h4 style={{ marginBottom: '0.5rem' }}>{ex.titre}</h4>
                                        <p style={{ marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            {ex.type_exercice} - {ex.date_realisation}
                                        </p>
                                    </div>
                                    <span className={`badge ${ex.etat_validation === 'Validé' ? 'badge-success' : 'badge-warning'}`}>
                                        {ex.etat_validation}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        Aucun exercice pour le moment
                    </p>
                )}
            </div>
        </div>
    );
}
