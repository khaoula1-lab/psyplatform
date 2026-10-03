'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function AdminReports() {
    const [formData, setFormData] = useState({
        type_rapport: 'Rapport mensuel consultations',
        date_debut_periode: '',
        date_fin_periode: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/admin/reports', formData);
            alert('Rapport généré avec succès!');
            setFormData({
                type_rapport: 'Rapport mensuel consultations',
                date_debut_periode: '',
                date_fin_periode: ''
            });
        } catch (error) {
            alert('Erreur lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Rapports et Statistiques</h1>

            <div className="grid-2">
                {/* Generate Report Form */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Générer un rapport</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Type de rapport</label>
                            <select
                                className="input"
                                value={formData.type_rapport}
                                onChange={(e) => setFormData({ ...formData, type_rapport: e.target.value })}
                                required
                            >
                                <option value="Rapport mensuel consultations">Rapport mensuel consultations</option>
                                <option value="Statistiques patients par psychologue">Statistiques patients par psychologue</option>
                                <option value="Rapport revenus mensuels">Rapport revenus mensuels</option>
                                <option value="Analyse satisfaction patients">Analyse satisfaction patients</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date début période</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date_debut_periode}
                                onChange={(e) => setFormData({ ...formData, date_debut_periode: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date fin période</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date_fin_periode}
                                onChange={(e) => setFormData({ ...formData, date_fin_periode: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Génération...' : 'Générer le rapport'}
                        </button>
                    </form>
                </div>

                {/* Quick Stats */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Statistiques rapides</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    Total consultations
                                </p>
                                <h3 style={{ marginBottom: 0, color: 'var(--primary-light)' }}>Ce mois</h3>
                            </div>
                            <div style={{ fontSize: '2rem' }}>📊</div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    Revenus totaux
                                </p>
                                <h3 style={{ marginBottom: 0, color: 'var(--success)' }}>Ce mois</h3>
                            </div>
                            <div style={{ fontSize: '2rem' }}>💰</div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    Taux de satisfaction
                                </p>
                                <h3 style={{ marginBottom: 0, color: 'var(--accent)' }}>95%</h3>
                            </div>
                            <div style={{ fontSize: '2rem' }}>⭐</div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    Nouveaux patients
                                </p>
                                <h3 style={{ marginBottom: 0, color: 'var(--secondary)' }}>Cette semaine</h3>
                            </div>
                            <div style={{ fontSize: '2rem' }}>👥</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
