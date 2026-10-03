'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        confirm_password: '',
        num_tel: '',
        CIN: '',
        adresse: '',
        role: 'Patient'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.mot_de_passe !== formData.confirm_password) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);

        try {
            const { confirm_password, ...dataToSend } = formData;
            const response = await api.post('/auth/register', dataToSend);
            const { token, user } = response.data;

            // Store token and user
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            if (user.role === 'Psychologue') {
                router.push('/dashboard/psychologue');
            } else {
                router.push('/dashboard/patient');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        🧠 PsyPlatform
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Créer un nouveau compte</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        color: 'var(--error)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Type de compte</label>
                        <select
                            name="role"
                            className="input"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="Patient">Patient</option>
                            <option value="Psychologue">Psychologue</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                className="input"
                                placeholder="Votre nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                className="input"
                                placeholder="Votre prénom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Téléphone</label>
                            <input
                                type="tel"
                                name="num_tel"
                                className="input"
                                placeholder="0612345678"
                                value={formData.num_tel}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">CIN</label>
                            <input
                                type="text"
                                name="CIN"
                                className="input"
                                placeholder="AB123456"
                                value={formData.CIN}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Adresse</label>
                        <input
                            type="text"
                            name="adresse"
                            className="input"
                            placeholder="Votre adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                name="mot_de_passe"
                                className="input"
                                placeholder="••••••••"
                                value={formData.mot_de_passe}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirmer mot de passe</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="input"
                                placeholder="••••••••"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                        style={{ marginTop: '1rem' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 'S\'inscrire'}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Déjà un compte?{' '}
                        <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                            Se connecter
                        </a>
                    </p>
                </div>

                <div className="text-center" style={{ marginTop: '1rem' }}>
                    <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
}
