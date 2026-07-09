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
          <p className={styles.dates}>20th, 21st and 22nd of February 2026</p>
          <p className={styles.hashtag}>#diveintodiplomacy</p>
          <Countdown targetDate="2026-02-20T09:00:00" />
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
              <div className={styles.avatar}></div>
              <h3 className={styles.authorName}>JANE DOE</h3>
            </div>
            <div className={styles.letterBody}>
              <p>Dear Attendees,</p>
              <p>It is an honor to welcome you all to the annual session of Alaçatı MUN Conference. I am Jane Doe, your Secretary-General. If you are reading this letter, you probably already know why you should be here, but let us remind you once more.</p>
              <p>AlaçatıMUN is a legacy preserved by generations, now bestowed upon us by our upperclassmen. Being entrusted with this conference was not an easy feat; so you can be sure that we are no amateurs when it comes to MUN, and that it isn't a coincidence you are attending the best.</p>
              <p>Sincerely,<br />Jane Doe</p>
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
              <div className={styles.avatar}></div>
              <h3 className={styles.authorName}>JOHN SMITH</h3>
            </div>
            <div className={styles.letterBody}>
              <p>Distinguished Delegates, Advisors, Staff, and Partners,</p>
              <p>It is a great honor to welcome you to Alaçatı MUN'26. I am John Smith, and I proudly serve as your Director-General.</p>
              <p>Together with our esteemed Secretary-General, we sacrificed years working both for our titles and for the legacy of AlaçatıMUN. And every single time, our experienced academic and organization teams have worked meticulously to both preserve and elevate this heritage to new heights.</p>
              <p>Yours Sincerely,<br />John Smith</p>
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

