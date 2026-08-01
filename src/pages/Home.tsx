import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TransitionLink } from '../components/layout/TransitionContext';
import { ArrowRight } from 'lucide-react';
import Countdown from '../components/common/Countdown';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [depthPercent, setDepthPercent] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Track full-page scroll for the depth gradient
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      setDepthPercent(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic ocean depth colors
  const depthGradient = `linear-gradient(
    180deg,
    hsl(${200 + depthPercent * 10}, ${60 + depthPercent * 15}%, ${Math.max(5, 35 - depthPercent * 30)}%) 0%,
    hsl(${210 + depthPercent * 5}, ${70 + depthPercent * 10}%, ${Math.max(3, 20 - depthPercent * 17)}%) 50%,
    hsl(${215 + depthPercent * 3}, ${80 + depthPercent * 5}%, ${Math.max(2, 8 - depthPercent * 6)}%) 100%
  )`;

  // Parallax effects for waves
  const wave1Y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const wave2Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const wave3Y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // Text parallax
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={pageRef} className={styles.homeContainer} style={{ background: depthGradient }}>
      {/* Ambient floating particles - rendered via portal to avoid stacking context issues */}
      {ReactDOM.createPortal(
        <div className={styles.ambientParticles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.ambientBubble}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 12}s`,
                width: `${3 + Math.random() * 8}px`,
                height: `${3 + Math.random() * 8}px`,
                opacity: 0.15 + Math.random() * 0.2,
              }}
            />
          ))}
        </div>,
        document.body
      )}

      {/* Depth indicator - rendered via portal so it's never trapped in a stacking context */}
      {ReactDOM.createPortal(
        <div className={styles.depthIndicator}>
          <div className={styles.depthLine} />
          <span className={styles.depthText}>
            {Math.round(depthPercent * 200)}m
          </span>
        </div>,
        document.body
      )}

      {/* Hero Section with Parallax Waves */}
      <section ref={containerRef} className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          style={{ y: textY, opacity: textOpacity }}
        >
          <h1 className={styles.title}>AlaçatıMUN</h1>
          <p className={styles.dates}>2, 3 & 4 October 2026</p>
          <p className={styles.hashtag}>#diveintodiplomacy</p>
          <Countdown targetDate="2026-10-02T09:00:00" />
        </motion.div>

        {/* Parallax Wave Layers */}
        <motion.div className={`${styles.wave} ${styles.wave3}`} style={{ y: wave3Y }} />
        <motion.div className={`${styles.wave} ${styles.wave2}`} style={{ y: wave2Y }} />
        <motion.div className={`${styles.wave} ${styles.wave1}`} style={{ y: wave1Y }} />

        {/* Gradient Overlay to blend into next section */}
        <div className={styles.waveOverlay} />
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>

          {/* Secretary-General Letter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={styles.letterBlock}
          >
            <div className={styles.letterHeader}>
              <h2 className={styles.sectionTitle}>Letter from our esteemed Secretary-General</h2>
            </div>
            <div className={styles.authorInfo}>
              <img src="/images/mira.png" alt="Mira Belinda Baskıcı" className={styles.avatar} />
              <h3 className={styles.authorName}>Mira Belinda Baskıcı</h3>
            </div>
            <div className={styles.letterBody}>
              <p>Dear attendees,</p>
              <p>Welcome to ALACATIMUN’26.</p>
              <p>If you’re reading this you’re probably just as excited as we are. First of all thank you for choosing to be a part of our conference. It truly means a lot to us.</p>
              <p>Model United Nations is much more than debates and resolutions. It is about meeting inspiring people stepping outside your comfort zone sharing your ideas and creating memories that stay with you long after the conference ends. As Secretary General my biggest hope is that every participant leaves alacatimun with something valuable whether it’s a new friendship a new perspective or simply the confidence to speak up and make a difference.</p>
              <p>Finally I would like to thank my executive team and everyone who has been a part of this journey behind this conference are months of hard work endless discussions and countless hours of dedication I cannot wait to meet each and every one of you in beautiful Alacati. Until then enjoy the preparation believe in yourself and get ready for an unforgettable conference.</p>
              <p>See you soon,<br />With my warmest regards~</p>
            </div>
          </motion.div>

          {/* Director-General Letter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.letterBlock}
          >
            <div className={styles.letterHeader}>
              <h2 className={styles.sectionTitle}>Letter from our esteemed Director-General</h2>
            </div>
            <div className={styles.authorInfo}>
              <img src="/images/mehmet.png" alt="Mehmet Tekin" className={styles.avatar} />
              <h3 className={styles.authorName}>Mehmet Tekin</h3>
            </div>
            <div className={styles.letterBody}>
              <p>Dear attendees,</p>
              <p>Welcome to ALACATIMUN’26.</p>
              <p>If you’re reading this you’re probably just as excited as we are. First of all thank you for choosing to be a part of our conference. It truly means a lot to us.</p>
              <p>Model United Nations is much more than debates and resolutions. It is about meeting inspiring people stepping outside your comfort zone sharing your ideas and creating memories that stay with you long after the conference ends. As Director General my biggest hope is that every participant leaves alacatimun with something valuable whether it’s a new friendship a new perspective or simply the confidence to speak up and make a difference.</p>
              <p>Finally I would like to thank my executive team and everyone who has been a part of this journey behind this conference are months of hard work endless discussions and countless hours of dedication I cannot wait to meet each and every one of you in beautiful Alacati. Until then enjoy the preparation believe in yourself and get ready for an unforgettable conference.</p>
              <p>See you soon,<br />With my warmest regards~</p>
            </div>
          </motion.div>

          <div className={styles.actionSection}>
            <TransitionLink to="/committees" className={styles.actionButton}>
              <span>Meet Our Committees</span>
              <ArrowRight size={20} />
            </TransitionLink>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;

