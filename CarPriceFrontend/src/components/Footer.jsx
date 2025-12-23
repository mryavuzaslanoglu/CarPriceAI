import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© {currentYear} CarPrice AI - Yapay Zeka Destekli Araç Fiyat Tahmini</p>
            </div>
        </footer>
    );
};

export default Footer;
