'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PatientProfile() {
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        num_tel: '',
        adresse: '',
        situation: '',
        age: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);

            // Get patient details - for now using id 1, should get real patient ID
            const response = await api.get('/patients/1');
            setPatient(response.data.data);
            setFormData({
                nom: response.data.data.nom || '',
                prenom: response.data.data.prenom || '',
                num_tel: response.data.data.num_tel || '',
                adresse: response.data.data.adresse || '',
                situation: response.data.data.situation || '',
                age: response.data.data.age || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/patients/1', formData);
            alert('Profil mis à jour avec succès!');
            setEditing(false);
            fetchProfile();
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1>Mon profil</h1>
                <button
                    onClick={() => setEditing(!editing)}
                    className="btn btn-primary"
                >
                    {editing ? 'Annuler' : 'Modifier'}
                </button>
            </div>

            <div className="grid-2">
                {/* Profile card */}
                <div className="glass-card">
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        margin: '0 auto 1.5rem'
                    }}>
                        👤
                    </div>

                    <div className="text-center">
                        <h2 style={{ marginBottom: '0.5rem' }}>
                            {user?.prenom} {user?.nom}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            {user?.email}
                        </p>
                        <span className="badge badge-info">Patient</span>
                    </div>
                </div>

                {/* Profile details */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Informations personnelles</h3>

                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nom</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Prénom</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Téléphone</label>
                                <input
                                    type="tel"
                                    className="input"
                                    value={formData.num_tel}
                                    onChange={(e) => setFormData({ ...formData, num_tel: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Adresse</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Situation</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.situation}
                                    onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Âge</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full">
                                Enregistrer
                            </button>
                        </form>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    Nom complet
                                </p>
                                <p style={{ fontWeight: 600, marginBottom: 0 }}>
                                    {patient?.nom} {patient?.prenom}
                                </p>
                            </div>

                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    Téléphone
                                </p>
                                <p style={{ fontWeight: 600, marginBottom: 0 }}>
                                    {patient?.num_tel || 'Non renseigné'}
                                </p>
                            </div>

                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    Adresse
                                </p>
                                <p style={{ fontWeight: 600, marginBottom: 0 }}>
                                    {patient?.adresse || 'Non renseigné'}
                                </p>
                            </div>

                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    Situation
                                </p>
                                <p style={{ fontWeight: 600, marginBottom: 0 }}>
                                    {patient?.situation || 'Non renseigné'}
                                </p>
                            </div>

                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                    Âge
                                </p>
                                <p style={{ fontWeight: 600, marginBottom: 0 }}>
                                    {patient?.age ? `${patient.age} ans` : 'Non renseigné'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
