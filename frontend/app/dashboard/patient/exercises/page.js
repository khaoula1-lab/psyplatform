'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PatientExercises() {
    const [exercises, setExercises] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [response, setResponse] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [myExercises, allExercises] = await Promise.all([
                api.get('/patients/1/exercises'),
                api.get('/exercises')
            ]);

            setExercises(myExercises.data.data);
            setAvailableExercises(allExercises.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/exercises/${selectedExercise.id_exercice}/submit`, {
                contenu_reponse: response,
                duree_exercice: '00:15:00'
            });
            alert('Exercice soumis avec succès!');
            setSelectedExercise(null);
            setResponse('');
            fetchData();
        } catch (error) {
            alert('Erreur lors de la soumission');
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Mes exercices</h1>

            {/* Completed Exercises */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Exercices soumis</h2>
                {exercises.map(ex => (
                    <div key={ex.id_exercice_realise} style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md',
                        marginBottom: '1rem'
                    }}>
                        <div className="flex-between">
                            <div>
                                <h4>{ex.titre}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {ex.date_realisation} • Note: {ex.note_patient || 'En attente'}
                                </p>
                            </div>
                            <span className={`badge ${ex.etat_validation === 'Validé' ? 'badge-success' : 'badge-warning'}`}>
                                {ex.etat_validation}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Available Exercises */}
            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem' }}>Exercices disponibles</h2>
                <div className="grid-2">
                    {availableExercises.map(ex => (
                        <div key={ex.id_exercice} className="glass-card">
                            <h4 style={{ color: 'var(--primary-light)' }}>{ex.titre}</h4>
                            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{ex.descriptions}</p>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <span className="badge badge-info">{ex.type_exercice}</span>
                                <span className="badge badge-warning">{ex.difficulte}</span>
                            </div>
                            <button
                                onClick={() => setSelectedExercise(ex)}
                                className="btn btn-primary w-full"
                            >
                                Commencer
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exercise Modal */}
            {selectedExercise && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    zIndex: 1000
                }}>
                    <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{selectedExercise.titre}</h3>
                        <p style={{ marginBottom: '1rem' }}>{selectedExercise.consignes}</p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="input"
                                rows="8"
                                placeholder="Votre réponse..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                required
                                style={{ marginBottom: '1rem' }}
                            />
                            <div className="flex gap-md">
                                <button type="submit" className="btn btn-primary">Soumettre</button>
                                <button type="button" onClick={() => setSelectedExercise(null)} className="btn btn-outline">Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
