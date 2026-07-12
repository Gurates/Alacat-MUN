import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Waves } from 'lucide-react';
import Button from '../common/Button';
import styles from './Navbar.module.css';
import { TransitionLink } from './TransitionContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Committees', path: '/committees' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Teams', path: '/teams' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <TransitionLink to="/" className={styles.logo}>
          <Waves className={styles.logoIcon} />
          <span className={styles.logoText}>AlaçatıMUN</span>
        </TransitionLink>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <TransitionLink
                  to={link.path}
                  className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                >
                  {link.name}
                </TransitionLink>
              </li>
            ))}
          </ul>
          <TransitionLink to="/register">
            <Button variant="primary" size="sm">APPLY</Button>
          </TransitionLink>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${isOpen ? styles.mobileOpen : ''}`}>
        <ul className={styles.mobileNavList}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <TransitionLink
                to={link.path}
                className={`${styles.mobileNavLink} ${location.pathname === link.path ? styles.active : ''}`}
              >
                {link.name}
              </TransitionLink>
            </li>
          ))}
          <li>
            <TransitionLink to="/register" className={styles.mobileRegButton}>
              <Button variant="primary" fullWidth>APPLY</Button>
            </TransitionLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
