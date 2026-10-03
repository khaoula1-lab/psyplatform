'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologueAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, statut) => {
        try {
            await api.put(`/appointments/${id}`, { statut });
            fetchAppointments();
            alert('Statut mis à jour');
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Rendez-vous</h1>

            <div className="glass-card">
                {appointments.map(apt => (
                    <div key={apt.id_rendez_vous} style={{
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                    }}>
                        <div className="flex-between">
                            <div>
                                <h3>{apt.patient_nom} {apt.patient_prenom}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    📅 {apt.date_rendez_vous} • ⏰ {apt.heure_debut} - {apt.heure_fin}
                                </p>
                                <p style={{ color: 'var(--text-secondary)' }}>{apt.type_rendez_vous}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span className={`badge ${apt.statut === 'Confirmé' ? 'badge-success' :
                                        apt.statut === 'Planifié' ? 'badge-info' : 'badge-warning'
                                    }`}>
                                    {apt.statut}
                                </span>
                                <select
                                    className="input"
                                    value={apt.statut}
                                    onChange={(e) => updateStatus(apt.id_rendez_vous, e.target.value)}
                                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                >
                                    <option value="Planifié">Planifié</option>
                                    <option value="Confirmé">Confirmé</option>
                                    <option value="Terminé">Terminé</option>
                                    <option value="Annulé">Annulé</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
