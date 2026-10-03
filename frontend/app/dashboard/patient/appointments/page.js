'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [psychologues, setPsychologues] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        id_psychologue: '',
        date_rendez_vous: '',
        heure_debut: '',
        heure_fin: '',
        type_rendez_vous: 'Consultation initiale'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appointmentsRes, psychologuesRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/psychologues')
            ]);

            setAppointments(appointmentsRes.data.data);
            setPsychologues(psychologuesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            setShowBooking(false);
            fetchData();
            alert('Rendez-vous créé avec succès!');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la création du rendez-vous');
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Mes rendez-vous</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                        Gérez vos consultations
                    </p>
                </div>
                <button
                    onClick={() => setShowBooking(!showBooking)}
                    className="btn btn-primary"
                >
                    + Nouveau rendez-vous
                </button>
            </div>

            {/* Booking Form */}
            {showBooking && (
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Réserver un rendez-vous</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Psychologue</label>
                            <select
                                className="input"
                                value={formData.id_psychologue}
                                onChange={(e) => setFormData({ ...formData, id_psychologue: e.target.value })}
                                required
                            >
                                <option value="">Sélectionner un psychologue</option>
                                {psychologues.map(psy => (
                                    <option key={psy.id_psy} value={psy.id_psy}>
                                        Dr. {psy.nom} {psy.prenom} - {psy.prix_consultation} DH
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.date_rendez_vous}
                                    onChange={(e) => setFormData({ ...formData, date_rendez_vous: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Heure début</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.heure_debut}
                                    onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Heure fin</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.heure_fin}
                                    onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-md">
                            <button type="submit" className="btn btn-primary">
                                Réserver
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowBooking(false)}
                                className="btn btn-outline"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Appointments List */}
            <div className="glass-card">
                {appointments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {appointments.map((apt) => (
                            <div key={apt.id_rendez_vous} style={{
                                padding: '1.5rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div className="flex-between">
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>
                                            Dr. {apt.psy_nom} {apt.psy_prenom}
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            📅 {apt.date_rendez_vous} • ⏰ {apt.heure_debut} - {apt.heure_fin}
                                        </p>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                                            Type: {apt.type_rendez_vous}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`badge ${apt.statut === 'Confirmé' ? 'badge-success' :
                                                apt.statut === 'Planifié' ? 'badge-info' :
                                                    apt.statut === 'Annulé' ? 'badge-error' : 'badge-warning'
                                            }`}>
                                            {apt.statut}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
                        <h3 style={{ marginBottom: '0.5rem' }}>Aucun rendez-vous</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Commencez par réserver votre premier rendez-vous
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
