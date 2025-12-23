import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.6 1 12.8 1 14v2c0 .6.4 1 1 1h2" />
                            <circle cx="7" cy="17" r="2" />
                            <circle cx="17" cy="17" r="2" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">CarPrice</span>
                        <span className="logo-subtitle">AI</span>
                    </div>
                </div>

                <nav className="nav">
                    <a href="#" className="nav-link active">Fiyat Tahmin</a>
                </nav>

                <div className="header-badge">
                    <span className="badge-dot"></span>
                    <span>Model Aktif</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
