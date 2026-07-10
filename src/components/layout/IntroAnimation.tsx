import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './IntroAnimation.module.css';

/** Trigger haptic vibration on supported devices */
const vibrate = (pattern: number | number[]) => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail on unsupported devices
  }
};

const IntroAnimation: React.FC = () => {
  const [hasPlayed, setHasPlayed] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const played = sessionStorage.getItem('mun_intro_played');
    if (!played) {
      setHasPlayed(false);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (hasPlayed || !overlayRef.current) return;

    const ctx = gsap.matchMedia();

    // ===== DESKTOP =====
    ctx.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const finish = () => {
        sessionStorage.setItem('mun_intro_played', 'true');
        document.body.style.overflow = '';
        setHasPlayed(true);
      };

      const tl = gsap.timeline({ onComplete: finish });

      // Initial state
      gsap.set(lightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.88, y: 30 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 15 });
      gsap.set(overlayRef.current, { backgroundColor: '#02142A' });

      // Light beams
      const beams: HTMLDivElement[] = [];
      if (overlayRef.current) {
        [15, 35, 55, 75].forEach((pos, i) => {
          const beam = document.createElement('div');
          beam.className = styles.lightBeam;
          beam.style.left = `${pos}%`;
          beam.style.transform = `rotate(${[-12, 4, -6, 10][i]}deg)`;
          beam.style.width = `${90 + Math.random() * 80}px`;
          overlayRef.current!.appendChild(beam);
          beams.push(beam);
        });
      }

      // Bubbles — 200 is plenty for a dense feel without bloat
      const bubbles: HTMLDivElement[] = [];
      const BUBBLE_COUNT = 200;
      if (particlesRef.current) {
        for (let i = 0; i < BUBBLE_COUNT; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particle;
          const size = Math.random() * 30 + 8; // 8–38px
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${Math.random() * 100}%`;
          particlesRef.current.appendChild(bubble);
          bubbles.push(bubble);
        }
      }

      gsap.set(bubbles, { y: window.innerHeight + 80, x: 0, opacity: 0, scale: 0.3 });
      gsap.set(beams, { opacity: 0 });

      // --- TIMELINE (total ≈ 3.2s) ---
      const RISE = 1.6;

      // Bubbles rise fast
      tl.to(bubbles, {
        opacity: () => Math.random() * 0.4 + 0.6, // 0.6–1.0 (much brighter!)
        y: () => Math.random() * window.innerHeight * 0.95,
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.35,
        scale: () => Math.random() * 1.6 + 0.5,
        duration: RISE,
        stagger: { each: RISE / BUBBLE_COUNT, from: 'start', ease: 'power3.in' },
        ease: 'power1.out',
      }, 0);

      // Light
      tl.to(lightRef.current, { opacity: 1, scale: 1.15, duration: RISE, ease: 'power2.inOut' }, 0.1);
      tl.to(beams, { opacity: () => Math.random() * 0.4 + 0.3, duration: RISE * 0.8, stagger: 0.15, ease: 'power2.inOut' }, 0.2);
      tl.to(overlayRef.current, { backgroundColor: '#0A4A8A', duration: RISE, ease: 'power2.inOut' }, 0);

      // EXPLOSION at RISE + 0.3
      const PEAK = RISE + 0.3;

      tl.to(bubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 3,
        y: () => (Math.random() - 0.5) * window.innerHeight * 3,
        scale: () => (Math.random() > 0.5 ? 0 : Math.random() * 2),
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
      }, PEAK);

      tl.to(beams, { opacity: 0, duration: 0.6, ease: 'power2.out' }, PEAK);

      // Title reveal (overlaps explosion)
      tl.to(titleRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' }, PEAK + 0.15);
      tl.to(subtitleRef.current, { opacity: 0.7, y: 0, duration: 0.7, ease: 'power2.out' }, PEAK + 0.3);

      // Sweep away
      tl.to(overlayRef.current, { yPercent: -120, duration: 1.0, ease: 'power3.inOut' }, PEAK + 1.2);
    });

    // ===== MOBILE (optimized & with vibration) =====
    ctx.add('(prefers-reduced-motion: no-preference) and (max-width: 768px)', () => {
      const finish = () => {
        sessionStorage.setItem('mun_intro_played', 'true');
        document.body.style.overflow = '';
        setHasPlayed(true);
      };

      const tl = gsap.timeline({ onComplete: finish });

      gsap.set(lightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.9, y: 20 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(overlayRef.current, { backgroundColor: '#02142A' });

      // 60 bubbles — visible and performant
      const mobileBubbles: HTMLDivElement[] = [];
      const M_COUNT = 60;
      if (particlesRef.current) {
        for (let i = 0; i < M_COUNT; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particleMobile;
          const size = Math.random() * 22 + 6; // 6–28px
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${Math.random() * 100}%`;
          particlesRef.current.appendChild(bubble);
          mobileBubbles.push(bubble);
        }
      }

      gsap.set(mobileBubbles, { y: window.innerHeight + 40, x: 0, opacity: 0, scale: 0.4 });

      const RISE = 1.2;

      // Bubbles rise — brighter opacity
      tl.to(mobileBubbles, {
        opacity: () => Math.random() * 0.3 + 0.7, // 0.7–1.0 (very visible)
        y: () => Math.random() * window.innerHeight * 0.9,
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.4,
        scale: () => Math.random() * 1.3 + 0.5,
        duration: RISE,
        stagger: { each: RISE / M_COUNT, from: 'start', ease: 'power3.in' },
        ease: 'power1.out',
      }, 0);

      // Light & background
      tl.to(lightRef.current, { opacity: 0.8, scale: 1.1, duration: RISE, ease: 'power2.inOut' }, 0.1);
      tl.to(overlayRef.current, { backgroundColor: '#0A4A8A', duration: RISE, ease: 'power2.inOut' }, 0);

      const PEAK = RISE + 0.2;

      // EXPLOSION + HAPTIC VIBRATION
      tl.add(() => {
        // Short burst vibration at the explosion moment
        vibrate([30, 20, 50]);
      }, PEAK);

      tl.to(mobileBubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 2.5,
        y: () => (Math.random() - 0.5) * window.innerHeight * 2.5,
        scale: 0,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      }, PEAK);

      // Title
      tl.to(titleRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' }, PEAK + 0.1);
      tl.to(subtitleRef.current, { opacity: 0.7, y: 0, duration: 0.6, ease: 'power2.out' }, PEAK + 0.2);

      // Sweep + second vibration
      tl.add(() => {
        vibrate(15);
      }, PEAK + 0.9);

      tl.to(overlayRef.current, { yPercent: -120, duration: 0.8, ease: 'power3.inOut' }, PEAK + 0.9);
    });

    // Reduced motion
    ctx.add('(prefers-reduced-motion: reduce)', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('mun_intro_played', 'true');
          document.body.style.overflow = '';
          setHasPlayed(true);
        },
      });
      gsap.set(titleRef.current, { opacity: 1 });
      tl.to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.5 });
    });

    return () => ctx.revert();
  }, [hasPlayed]);

  if (hasPlayed) return null;

  return (
    <div ref={overlayRef} className={styles.introOverlay}>
      <div ref={lightRef} className={styles.lightRays} />
      <div ref={particlesRef} className={styles.particlesContainer} />

      <div className={styles.titleContainer}>
        <h1 ref={titleRef} className={styles.title}>Alaçatı MUN</h1>
        <p ref={subtitleRef} className={styles.subtitle}>#diveintodiplomacy</p>
      </div>

      <div className={styles.wipeWaveContainer}>
        <svg
          className={styles.wipeWaveSvg}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#0A4A8A"
            d="M0,0L48,21.3C96,43,192,85,288,117.3C384,149,480,171,576,160C672,149,768,107,864,85.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default IntroAnimation;
