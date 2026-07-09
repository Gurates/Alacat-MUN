import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Teams.module.css';

const teamMembers = [
  { name: 'Yağmur', role: 'Director General', dept: 'Exec', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop', color: 'var(--color-accent)' },
  { name: 'Ege', role: 'Secretary General', dept: 'Exec', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop', color: 'var(--color-accent)' },
  { name: 'Alice Mehmet', role: 'Head of PR', dept: 'Organization', photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop', color: 'var(--color-secondary)' },
  { name: 'AOSNAŞLXC', role: 'Head of IT', dept: 'Organization', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop', color: 'var(--color-secondary)' },
  { name: 'ALŞDJCNLŞ', role: 'Head of Media', dept: 'Organization', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop', color: 'var(--color-secondary)' },
];

const Teams: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        {/* LEFT: Photo frame */}
        <div className={styles.photoCol}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={styles.memberSlide}
            >
              <div className={styles.colorBar} style={{ background: teamMembers[current].color }} />
              <div className={styles.photoBg}>
                <img src={teamMembers[current].photo} alt={teamMembers[current].name} />
              </div>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.igOverlay}>
                <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className={styles.igText}>View on Instagram</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: Info panel */}
        <div className={styles.infoCol}>
          <div className={styles.topInfo}>
            <span className={styles.counter}>{current + 1} / {teamMembers.length}</span>
          </div>

          <div className={styles.middleInfo}>
            <motion.div
              key={`dept-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.infoDept}
              style={{ color: teamMembers[current].color }}
            >
              {teamMembers[current].dept}
            </motion.div>

            <motion.div
              key={`name-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.infoName}
            >
              {teamMembers[current].name}
            </motion.div>

            <motion.div
              key={`role-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.infoRole}
            >
              {teamMembers[current].role}
            </motion.div>
          </div>

          <div className={styles.bottomInfo}>
            <div className={styles.dots}>
              {teamMembers.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
                  style={i === current ? { backgroundColor: teamMembers[current].color } : {}}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`Member ${i + 1}`}
                />
              ))}
            </div>

            <div className={styles.controls}>
              <button onClick={prevSlide} className={styles.controlBtn} aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className={styles.controlBtn} aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
