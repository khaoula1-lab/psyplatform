'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologuesList() {
    const [psychologues, setPsychologues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPsychologues();
    }, []);

    const fetchPsychologues = async () => {
        try {
            const response = await api.get('/psychologues');
            setPsychologues(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Nos psychologues</h1>

            <div className="grid-2">
                {psychologues.map(psy => (
                    <div key={psy.id_psy} className="glass-card">
                        <div className="flex gap-md" style={{ marginBottom: '1rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                👨‍⚕️
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.25rem' }}>
                                    Dr. {psy.nom} {psy.prenom}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    Licence: {psy.num_licence}
                                </p>
                                <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: 0 }}>
                                    {psy.prix_consultation} DH/séance
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            {psy.biographie}
                        </p>

                        <div style={{ marginBottom: '1rem' }}>
                            <span className="badge badge-info">{psy.experience}</span>
                        </div>

                        <a href="/dashboard/patient/appointments" className="btn btn-primary w-full">
                            Prendre rendez-vous
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
