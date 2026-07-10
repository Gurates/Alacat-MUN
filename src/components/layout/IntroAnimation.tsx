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
  // Track whether we have user-gesture activation for vibration
  const canVibrateRef = useRef(false);

  useEffect(() => {
    const played = sessionStorage.getItem('mun_intro_played');
    if (!played) {
      setHasPlayed(false);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (hasPlayed || !overlayRef.current) return;

    // --- Vibration setup ---
    // navigator.vibrate() requires a user gesture (touchstart/click) on most
    // mobile browsers. We attach a listener so any touch during the intro
    // gives us activation context, then we vibrate at the key moments.
    const pendingVibrations: Array<{ pattern: number | number[]; timer: ReturnType<typeof setTimeout> | null }> = [];

    const doVibrate = (pattern: number | number[]) => {
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate(pattern);
        }
      } catch { /* unsupported */ }
    };

    const handleTouch = () => {
      canVibrateRef.current = true;
      // Fire any pending vibrations that were scheduled before the user touched
      pendingVibrations.forEach((v) => {
        if (v.timer !== null) {
          // Already scheduled — vibrate now since we just got activation
        }
      });
      // Give immediate haptic feedback so the user knows touch is recognized
      doVibrate(10);
    };

    const scheduleVibrate = (pattern: number | number[]) => {
      if (canVibrateRef.current) {
        doVibrate(pattern);
      }
      // Store in case user touches later
      pendingVibrations.push({ pattern, timer: null });
    };

    document.addEventListener('touchstart', handleTouch, { once: true, passive: true });

    const ctx = gsap.matchMedia();

    // ===== DESKTOP (total ~3.5s) =====
    ctx.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const finish = () => {
        sessionStorage.setItem('mun_intro_played', 'true');
        document.body.style.overflow = '';
        setHasPlayed(true);
      };

      const tl = gsap.timeline({ onComplete: finish });

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

      // Bubbles — 200 for desktop
      const bubbles: HTMLDivElement[] = [];
      const COUNT = 200;
      if (particlesRef.current) {
        for (let i = 0; i < COUNT; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particle;
          const size = Math.random() * 30 + 8;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          // Spawn from all edges: bottom (60%), left (15%), right (15%), top (10%)
          const edge = Math.random();
          if (edge < 0.6) {
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.bottom = '-50px';
          } else if (edge < 0.75) {
            bubble.style.left = '-50px';
            bubble.style.top = `${Math.random() * 100}%`;
          } else if (edge < 0.9) {
            bubble.style.right = '-50px';
            bubble.style.top = `${Math.random() * 100}%`;
          } else {
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.top = '-50px';
          }
          particlesRef.current.appendChild(bubble);
          bubbles.push(bubble);
        }
      }

      // Initial state: all offscreen, invisible
      gsap.set(bubbles, { opacity: 0, scale: 0.2 });
      gsap.set(beams, { opacity: 0 });

      const FILL = 2.0; // Time for bubbles to fill the screen

      // Step 1: Bubbles rise and FILL the screen (they stay visible!)
      tl.to(bubbles, {
        opacity: () => Math.random() * 0.3 + 0.7, // 0.7–1.0 very bright
        // Move to a random position in the central area of the screen
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.8,
        y: () => (Math.random() - 0.5) * window.innerHeight * 0.8,
        scale: () => Math.random() * 1.4 + 0.5,
        duration: FILL,
        stagger: {
          each: FILL / COUNT,
          from: 'start',
          ease: 'power2.in', // Slow start → accelerating fill
        },
        ease: 'power1.out',
      }, 0);

      // Light rays build during fill
      tl.to(lightRef.current, { opacity: 0.8, scale: 1.1, duration: FILL, ease: 'power2.inOut' }, 0.1);
      tl.to(beams, { opacity: () => Math.random() * 0.4 + 0.3, duration: FILL * 0.7, stagger: 0.15, ease: 'power2.inOut' }, 0.3);
      tl.to(overlayRef.current, { backgroundColor: '#0A4A8A', duration: FILL, ease: 'power2.inOut' }, 0);

      // Step 2: EXPLOSION — all bubbles scatter at once
      const PEAK = FILL + 0.15; // Tiny pause so screen feels "full"

      tl.to(bubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 4,
        y: () => (Math.random() - 0.5) * window.innerHeight * 4,
        scale: () => (Math.random() > 0.5 ? 0 : Math.random() * 2),
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      }, PEAK);

      tl.to(beams, { opacity: 0, duration: 0.5, ease: 'power2.out' }, PEAK);

      // Step 3: Title reveal
      tl.to(titleRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' }, PEAK + 0.2);
      tl.to(subtitleRef.current, { opacity: 0.7, y: 0, duration: 0.7, ease: 'power2.out' }, PEAK + 0.35);

      // Step 4: Sweep away
      tl.to(overlayRef.current, { yPercent: -120, duration: 1.0, ease: 'power3.inOut' }, PEAK + 1.3);
    });

    // ===== MOBILE (total ~3s, with vibration) =====
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

      // 60 mobile bubbles
      const mobileBubbles: HTMLDivElement[] = [];
      const M_COUNT = 60;
      if (particlesRef.current) {
        for (let i = 0; i < M_COUNT; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particleMobile;
          const size = Math.random() * 22 + 6;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          // Spawn from all edges
          const edge = Math.random();
          if (edge < 0.55) {
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.bottom = '-40px';
          } else if (edge < 0.7) {
            bubble.style.left = '-40px';
            bubble.style.top = `${Math.random() * 100}%`;
          } else if (edge < 0.85) {
            bubble.style.right = '-40px';
            bubble.style.top = `${Math.random() * 100}%`;
          } else {
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.top = '-40px';
          }
          particlesRef.current.appendChild(bubble);
          mobileBubbles.push(bubble);
        }
      }

      gsap.set(mobileBubbles, { opacity: 0, scale: 0.3 });

      const FILL = 1.6;

      // Step 1: Bubbles FILL the screen
      tl.to(mobileBubbles, {
        opacity: () => Math.random() * 0.2 + 0.8, // 0.8–1.0 very bright
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.7,
        y: () => (Math.random() - 0.5) * window.innerHeight * 0.7,
        scale: () => Math.random() * 1.3 + 0.5,
        duration: FILL,
        stagger: {
          each: FILL / M_COUNT,
          from: 'start',
          ease: 'power2.in',
        },
        ease: 'power1.out',
      }, 0);

      tl.to(lightRef.current, { opacity: 0.8, scale: 1.1, duration: FILL, ease: 'power2.inOut' }, 0.1);
      tl.to(overlayRef.current, { backgroundColor: '#0A4A8A', duration: FILL, ease: 'power2.inOut' }, 0);

      const PEAK = FILL + 0.15;

      // Step 2: EXPLOSION + vibration
      tl.add(() => {
        scheduleVibrate([40, 30, 60]); // strong burst
      }, PEAK);

      tl.to(mobileBubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 3,
        y: () => (Math.random() - 0.5) * window.innerHeight * 3,
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.out',
      }, PEAK);

      // Step 3: Title
      tl.to(titleRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' }, PEAK + 0.15);
      tl.to(subtitleRef.current, { opacity: 0.7, y: 0, duration: 0.6, ease: 'power2.out' }, PEAK + 0.25);

      // Step 4: Sweep + light vibration
      tl.add(() => {
        scheduleVibrate(20);
      }, PEAK + 1.0);

      tl.to(overlayRef.current, { yPercent: -120, duration: 0.8, ease: 'power3.inOut' }, PEAK + 1.0);
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

    return () => {
      ctx.revert();
      document.removeEventListener('touchstart', handleTouch);
    };
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
