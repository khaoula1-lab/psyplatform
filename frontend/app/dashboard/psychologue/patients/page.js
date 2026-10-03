'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologuePatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/psychologues/me/patients');
            setPatients(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Mes patients</h1>

            <div className="grid-2">
                {patients.length > 0 ? patients.map(patient => (
                    <div key={patient.id_patient} className="glass-card">
                        <div className="flex gap-md" style={{ marginBottom: '1rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent), var(--primary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                👤
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.25rem' }}>
                                    {patient.nom} {patient.prenom}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    {patient.age} ans • {patient.sex}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 0 }}>
                                    {patient.email}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                Situation: {patient.situation || 'Non renseigné'}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                                Inscrit le: {patient.date_inscription}
                            </p>
                        </div>

                        <div className="flex gap-sm">
                            <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
                                Voir dossier
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="glass-card text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</p>
                        <h3>Aucun patient</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas encore de patients</p>
                    </div>
                )}
            </div>
        </div>
    );
}
