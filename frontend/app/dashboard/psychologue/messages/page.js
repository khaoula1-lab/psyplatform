'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PsychologueMessages() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/messages/conversations');
            setConversations(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (userId) => {
        try {
            const response = await api.get(`/messages/${userId}`);
            setMessages(response.data.data || []);
            setSelectedUser(userId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post('/messages', {
                id_recepteur: selectedUser,
                contenu: newMessage
            });
            setNewMessage('');
            loadMessages(selectedUser);
        } catch (error) {
            alert('Erreur');
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Messages</h1>

            <div className="glass-card" style={{ height: '600px', display: 'flex' }}>
                <div style={{ width: '300px', borderRight: '1px solid var(--glass-border)', padding: '1rem', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Conversations</h3>
                    {conversations.map((conv, i) => (
                        <div
                            key={i}
                            onClick={() => loadMessages(conv.user_id)}
                            style={{
                                padding: '1rem',
                                background: selectedUser === conv.user_id ? 'var(--primary)' : 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            <h4>{conv.nom} {conv.prenom}</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                                {conv.dernier_message}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {selectedUser ? (
                        <>
                            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                                {messages.map((msg, i) => {
                                    const isMe = msg.id_expediteur !== selectedUser;
                                    return (
                                        <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
                                            <div style={{
                                                padding: '0.75rem 1rem',
                                                background: isMe ? 'var(--primary)' : 'var(--bg-secondary)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <p style={{ marginBottom: 0 }}>{msg.contenu}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary">Envoyer</button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-center" style={{ height: '100%' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Sélectionnez une conversation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
