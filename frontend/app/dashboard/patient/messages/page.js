'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PatientMessages() {
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
            console.error('Error fetching conversations:', error);
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
            console.error('Error loading messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            await api.post('/messages', {
                id_recepteur: selectedUser,
                contenu: newMessage
            });
            setNewMessage('');
            loadMessages(selectedUser);
        } catch (error) {
            alert('Erreur lors de l\'envoi du message');
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Messagerie</h1>

            <div className="glass-card" style={{ height: '600px', display: 'flex' }}>
                {/* Conversations list */}
                <div style={{
                    width: '300px',
                    borderRight: '1px solid var(--glass-border)',
                    padding: '1rem',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>Conversations</h3>
                    {conversations.length > 0 ? (
                        conversations.map((conv, index) => (
                            <div
                                key={index}
                                onClick={() => loadMessages(conv.user_id)}
                                style={{
                                    padding: '1rem',
                                    background: selectedUser === conv.user_id ? 'var(--primary)' : 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <h4 style={{ marginBottom: '0.25rem' }}>
                                    {conv.nom} {conv.prenom}
                                </h4>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {conv.dernier_message}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            Pas encore de conversations
                        </p>
                    )}
                </div>

                {/* Messages */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {selectedUser ? (
                        <>
                            {/* Messages area */}
                            <div style={{
                                flex: 1,
                                padding: '1rem',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                {messages.map((msg, index) => {
                                    const isMe = msg.id_expediteur !== selectedUser;
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%'
                                            }}
                                        >
                                            <div style={{
                                                padding: '0.75rem 1rem',
                                                background: isMe ? 'var(--primary)' : 'var(--bg-secondary)',
                                                borderRadius: 'var(--radius-md)',
                                                wordWrap: 'break-word'
                                            }}>
                                                <p style={{ marginBottom: 0 }}>{msg.contenu}</p>
                                            </div>
                                            <p style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                marginTop: '0.25rem',
                                                textAlign: isMe ? 'right' : 'left'
                                            }}>
                                                {new Date(msg.date_envoi).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input area */}
                            <form onSubmit={sendMessage} style={{
                                padding: '1rem',
                                borderTop: '1px solid var(--glass-border)',
                                display: 'flex',
                                gap: '0.75rem'
                            }}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Tapez votre message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary">
                                    Envoyer
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-center" style={{ height: '100%' }}>
                            <div className="text-center">
                                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</p>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Sélectionnez une conversation pour commencer
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
