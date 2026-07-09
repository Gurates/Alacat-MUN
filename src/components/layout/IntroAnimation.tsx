import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './IntroAnimation.module.css';

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

    ctx.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('mun_intro_played', 'true');
          document.body.style.overflow = '';
          setHasPlayed(true);
        },
      });

      // Initial state
      gsap.set(lightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.92, y: 30 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 15 });
      gsap.set(overlayRef.current, { backgroundColor: '#02142A' });

      // Create light beams
      const beams: HTMLDivElement[] = [];
      if (overlayRef.current) {
        const beamPositions = [15, 30, 50, 65, 80];
        const beamAngles = [-15, -5, 3, -8, 10];
        beamPositions.forEach((pos, i) => {
          const beam = document.createElement('div');
          beam.className = styles.lightBeam;
          beam.style.left = `${pos}%`;
          beam.style.transform = `rotate(${beamAngles[i]}deg)`;
          beam.style.width = `${80 + Math.random() * 100}px`;
          overlayRef.current!.appendChild(beam);
          beams.push(beam);
        });
      }

      // Create bubbles
      const bubbles: HTMLDivElement[] = [];
      if (particlesRef.current) {
        for (let i = 0; i < 350; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particle;
          const size = Math.random() * 28 + 6; // 6px to 34px
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${Math.random() * 100}%`;
          particlesRef.current.appendChild(bubble);
          bubbles.push(bubble);
        }
      }

      // Initial positions
      gsap.set(bubbles, {
        y: window.innerHeight + 100,
        x: 0,
        opacity: 0,
        scale: 0.3,
      });
      gsap.set(beams, { opacity: 0 });

      // --- TIMELINE ---

      const spawnDuration = 2.8;

      // Step 1: Bubbles rise with escalating density
      tl.to(bubbles, {
        opacity: () => Math.random() * 0.6 + 0.4,
        y: () => Math.random() * window.innerHeight * 0.95,
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.4,
        scale: () => Math.random() * 1.5 + 0.6,
        duration: spawnDuration,
        stagger: {
          each: spawnDuration / 350,
          from: 'start',
          ease: 'power3.in', // Slow start → rapid escalation
        },
        ease: 'power1.out',
      }, 0);

      // Light rays fade in
      tl.to(lightRef.current, {
        opacity: 1,
        scale: 1.15,
        duration: 3,
        ease: 'power2.inOut',
      }, 0.3);

      // Light beams appear
      tl.to(beams, {
        opacity: () => Math.random() * 0.5 + 0.3,
        duration: 2.5,
        stagger: 0.2,
        ease: 'power2.inOut',
      }, 0.5);

      // Background deepens
      tl.to(overlayRef.current, {
        backgroundColor: '#0A4A8A',
        duration: 3,
        ease: 'power2.inOut',
      }, 0);

      // Peak → Explosion
      const peakTime = spawnDuration + 0.8;

      // Step 2: Cinematic pressure wave
      tl.to(bubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 3.5,
        y: () => (Math.random() - 0.5) * window.innerHeight * 3.5,
        scale: () => (Math.random() > 0.4 ? 0 : Math.random() * 2.5),
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
      }, peakTime);

      // Beams soften during explosion
      tl.to(beams, {
        opacity: 0.1,
        duration: 1,
        ease: 'power2.out',
      }, peakTime);

      // Step 3: Title reveal
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.8,
        ease: 'power2.out',
      }, peakTime + 0.3);

      tl.to(subtitleRef.current, {
        opacity: 0.6,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      }, peakTime + 0.6);

      // Step 4: Sweep away
      tl.to(overlayRef.current, {
        yPercent: -120,
        duration: 1.5,
        ease: 'power3.inOut',
      }, peakTime + 2.5);
    });

    // ===== MOBILE VERSION (optimized) =====
    ctx.add('(prefers-reduced-motion: no-preference) and (max-width: 768px)', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('mun_intro_played', 'true');
          document.body.style.overflow = '';
          setHasPlayed(true);
        },
      });

      gsap.set(lightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.92, y: 20 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(overlayRef.current, { backgroundColor: '#02142A' });

      // Fewer bubbles for mobile performance (35 instead of 120)
      const mobileBubbles: HTMLDivElement[] = [];
      if (particlesRef.current) {
        for (let i = 0; i < 35; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particleMobile;
          const size = Math.random() * 18 + 4; // 4px to 22px
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${Math.random() * 100}%`;
          particlesRef.current.appendChild(bubble);
          mobileBubbles.push(bubble);
        }
      }

      gsap.set(mobileBubbles, {
        y: window.innerHeight + 50,
        x: 0,
        opacity: 0,
        scale: 0.4,
      });

      const spawnDuration = 1.5;

      // Step 1: Bubbles rise
      tl.to(mobileBubbles, {
        opacity: () => Math.random() * 0.5 + 0.3,
        y: () => Math.random() * window.innerHeight * 0.9,
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.5,
        scale: () => Math.random() * 1.2 + 0.4,
        duration: spawnDuration,
        stagger: {
          each: spawnDuration / 35,
          from: 'start',
          ease: 'power3.in',
        },
        ease: 'power1.out',
      }, 0);

      // Light
      tl.to(lightRef.current, {
        opacity: 0.7,
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.inOut',
      }, 0.2);

      // Background
      tl.to(overlayRef.current, {
        backgroundColor: '#0A4A8A',
        duration: 1.5,
        ease: 'power2.inOut',
      }, 0);

      const peakTime = spawnDuration + 0.4;

      // Explosion
      tl.to(mobileBubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 2.5,
        y: () => (Math.random() - 0.5) * window.innerHeight * 2.5,
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
      }, peakTime);

      // Title
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, peakTime + 0.1);

      tl.to(subtitleRef.current, {
        opacity: 0.6,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
      }, peakTime + 0.3);

      // Sweep
      tl.to(overlayRef.current, {
        yPercent: -120,
        duration: 1.0,
        ease: 'power3.inOut',
      }, peakTime + 1.2);
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
