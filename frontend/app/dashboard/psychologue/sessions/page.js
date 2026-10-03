'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologueSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            // Mock data for demonstration
            setSessions([
                {
                    id_seance: 1,
                    patient_nom: 'El Mansouri',
                    patient_prenom: 'Fatima',
                    date_seance: '2024-12-16',
                    numero_seance: 1,
                    type_seance: 'TCC',
                    statut: 'Terminée'
                }
            ]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Séances de thérapie</h1>

            <div className="glass-card">
                {sessions.map(session => (
                    <div key={session.id_seance} style={{
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                    }}>
                        <div className="flex-between">
                            <div>
                                <h3>Séance #{session.numero_seance} - {session.patient_nom} {session.patient_prenom}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    📅 {session.date_seance} • Type: {session.type_seance}
                                </p>
                            </div>
                            <span className={`badge ${session.statut === 'Terminée' ? 'badge-success' : 'badge-info'
                                }`}>
                                {session.statut}
                            </span>
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Ajouter notes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
