export default function HomePage() {
    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <nav className="container" style={{ padding: '2rem' }}>
                <div className="flex-between">
                    <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        🧠 PsyPlatform
                    </h2>
                    <div className="flex gap-md">
                        <a href="/login" className="btn btn-outline">Connexion</a>
                        <a href="/register" className="btn btn-primary">S'inscrire</a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div className="fade-in">
                    <h1 style={{
                        fontSize: '3.5rem',
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #6366f1, #ec4899, #14b8a6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Votre bien-être mental, notre priorité
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
                        Plateforme moderne de consultation psychologique. Connectez-vous avec des professionnels qualifiés et commencez votre parcours vers un mieux-être.
                    </p>
                    <div className="flex-center gap-md">
                        <a href="/register" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                            Commencer maintenant
                        </a>
                        <a href="#features" className="btn btn-outline" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                            En savoir plus
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="container" style={{ padding: '4rem 2rem' }}>
                <h2 className="text-center" style={{ marginBottom: '3rem' }}>Fonctionnalités principales</h2>
                <div className="grid-3">
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                        <h3 style={{ color: 'var(--primary-light)' }}>Prise de rendez-vous</h3>
                        <p>Réservez vos consultations en ligne facilement. Visualisez les disponibilités en temps réel.</p>
                    </div>
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                        <h3 style={{ color: 'var(--secondary)' }}>Messagerie sécurisée</h3>
                        <p>Communiquez avec votre psychologue de manière confidentielle et sécurisée.</p>
                    </div>
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ color: 'var(--accent)' }}>Suivi personnalisé</h3>
                        <p>Suivez votre progression avec des exercices adaptés et des rapports détaillés.</p>
                    </div>
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h3 style={{ color: 'var(--success)' }}>Confidentialité totale</h3>
                        <p>Vos données sont protégées avec les plus hauts standards de sécurité.</p>
                    </div>
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
                        <h3 style={{ color: 'var(--warning)' }}>Professionnels qualifiés</h3>
                        <p>Accédez à des psychologues certifiés et expérimentés.</p>
                    </div>
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                        <h3 style={{ color: 'var(--info)' }}>Paiement simple</h3>
                        <p>Plusieurs moyens de paiement sécurisés pour votre confort.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Prêt à commencer votre parcours?</h2>
                    <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
                        Rejoignez des centaines de personnes qui ont déjà fait confiance à PsyPlatform pour leur bien-être mental.
                    </p>
                    <a href="/register" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                        Créer un compte gratuitement
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                    © 2026 PsyPlatform. Tous droits réservés.
                </p>
            </footer>
        </div>
    );
}
