import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: 'black', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>
          For further inquiries:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '0.9rem', color: 'white', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFC700'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            Instagram: @ocean.mun
          </a>
          <a 
            href="mailto:info@oceanmun.org" 
            style={{ fontSize: '0.9rem', color: 'white', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFC700'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            E-Mail Address: info@oceanmun.org
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
