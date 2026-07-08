import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link, type LinkProps } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PageTransition.module.css';

type TransitionState = 'idle' | 'exiting' | 'entering';

interface TransitionContextProps {
  transitionState: TransitionState;
  startTransition: (to: string) => void;
}

const TransitionContext = createContext<TransitionContextProps | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const navigate = useRef<((to: string) => void) | null>(null);
  const reactNavigator = useNavigate();

  // Keep navigate ref stable
  useEffect(() => {
    navigate.current = reactNavigator;
  }, [reactNavigator]);

  const startTransition = (to: string) => {
    if (transitionState !== 'idle') return;
    setTargetPath(to);
    setTransitionState('exiting');
  };

  const handleExitComplete = () => {
    if (targetPath && navigate.current) {
      navigate.current(targetPath);
      setTargetPath(null);
    }
    // Switch to entering phase immediately after route change
    setTransitionState('entering');
  };

  const handleEnterComplete = () => {
    setTransitionState('idle');
  };

  return (
    <TransitionContext.Provider value={{ transitionState, startTransition }}>
      {children}
      
      {/* Interaction blocker and transition overlay */}
      <AnimatePresence>
        {transitionState !== 'idle' && (
          <div className={styles.globalBlocker}>
            <motion.div
              className={styles.waveOverlay}
              initial={
                transitionState === 'exiting' 
                  ? { top: '100vh' } 
                  : { top: '-10vh' }
              }
              animate={
                transitionState === 'exiting'
                  ? { top: '-10vh' }
                  : { top: '-150vh' }
              }
              transition={{ 
                duration: 0.8, 
                ease: [0.45, 0, 0.55, 1] 
              }}
              onAnimationComplete={() => {
                if (transitionState === 'exiting') {
                  handleExitComplete();
                } else if (transitionState === 'entering') {
                  handleEnterComplete();
                }
              }}
            >
              {/* Top Wave (Leading Edge) */}
              <svg 
                className={styles.topWave}
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fill="rgba(11, 95, 165, 0.98)" 
                  d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,176C672,171,768,117,864,101.3C960,85,1056,107,1152,117.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>

              {/* Water Body */}
              <div className={styles.waterBody} />

              {/* Bottom Wave (Trailing Edge) */}
              <svg 
                className={styles.bottomWave}
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fill="rgba(11, 95, 165, 0.98)" 
                  d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,144C672,149,768,203,864,218.7C960,235,1056,213,1152,202.7C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                />
              </svg>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) throw new Error('useTransition must be used within TransitionProvider');
  return context;
};

export const TransitionLink: React.FC<LinkProps> = ({ to, onClick, children, ...props }) => {
  const { startTransition, transitionState } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (transitionState !== 'idle') return;
    
    if (onClick) {
      onClick(e);
    }
    
    startTransition(to.toString());
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};
