'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologueCalendar() {
    const [calendar, setCalendar] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        date_disponible: '',
        heure_debut: '',
        heure_fin: ''
    });

    useEffect(() => {
        fetchCalendar();
    }, []);

    const fetchCalendar = async () => {
        try {
            const response = await api.get('/psychologues/me/calendar');
            setCalendar(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/psychologues/me/calendar', formData);
            setShowAddForm(false);
            setFormData({ date_disponible: '', heure_debut: '', heure_fin: '' });
            fetchCalendar();
            alert('Disponibilité ajoutée');
        } catch (error) {
            alert('Erreur');
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1>Mon calendrier</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
                    + Ajouter disponibilité
                </button>
            </div>

            {showAddForm && (
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Nouvelle disponibilité</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.date_disponible}
                                    onChange={(e) => setFormData({ ...formData, date_disponible: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Début</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.heure_debut}
                                    onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fin</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.heure_fin}
                                    onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Ajouter</button>
                    </form>
                </div>
            )}

            <div className="glass-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Horaire</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Patient</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calendar.map((slot, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{slot.date_disponible}</td>
                                <td style={{ padding: '1rem' }}>{slot.heure_debut} - {slot.heure_fin}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge ${slot.statut === 'Disponible' ? 'badge-success' :
                                            slot.statut === 'Réservé' ? 'badge-warning' : 'badge-error'
                                        }`}>
                                        {slot.statut}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {slot.patient_nom ? `${slot.patient_nom} ${slot.patient_prenom}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
