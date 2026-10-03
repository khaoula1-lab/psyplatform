'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologueExercises() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await api.get('/exercises');
            setExercises(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Exercices thérapeutiques</h1>

            <div className="grid-2">
                {exercises.map(ex => (
                    <div key={ex.id_exercice} className="glass-card">
                        <h3 style={{ color: 'var(--primary-light)' }}>{ex.titre}</h3>
                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{ex.descriptions}</p>
                        <div className="flex-between">
                            <span className="badge badge-info">{ex.type_exercice}</span>
                            <span className="badge badge-warning">{ex.difficulte}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
