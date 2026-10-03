'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/admin/complaints');
            setComplaints(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, statut) => {
        try {
            await api.put(`/admin/complaints/${id}`, { statut });
            fetchComplaints();
            alert('Statut mis à jour');
        } catch (error) {
            alert('Erreur');
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Réclamations</h1>

            <div className="glass-card">
                {complaints.length > 0 ? complaints.map(complaint => (
                    <div key={complaint.id_reclamation} style={{
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                    }}>
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <div>
                                <h3>{complaint.titre_reclamation}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    Par: {complaint.patient_nom} {complaint.patient_prenom} • {new Date(complaint.date_creation).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span className={`badge ${complaint.priorite === 'Urgente' ? 'badge-error' :
                                        complaint.priorite === 'Haute' ? 'badge-warning' :
                                            complaint.priorite === 'Moyenne' ? 'badge-info' : 'badge-success'
                                    }`}>
                                    {complaint.priorite}
                                </span>
                                <span className={`badge ${complaint.statut === 'Ouverte' ? 'badge-warning' :
                                        complaint.statut === 'En cours' ? 'badge-info' :
                                            complaint.statut === 'Résolue' ? 'badge-success' : 'badge-error'
                                    }`}>
                                    {complaint.statut}
                                </span>
                            </div>
                        </div>

                        <p style={{ marginBottom: '1rem' }}>{complaint.description_reclamation}</p>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => updateStatus(complaint.id_reclamation, 'En cours')}
                                className="btn btn-primary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            >
                                En cours
                            </button>
                            <button
                                onClick={() => updateStatus(complaint.id_reclamation, 'Résolue')}
                                className="btn btn-success"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            >
                                Résoudre
                            </button>
                            <button
                                onClick={() => updateStatus(complaint.id_reclamation, 'Fermée')}
                                className="btn btn-outline"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</p>
                        <h3>Aucune réclamation</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Tout va bien!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
