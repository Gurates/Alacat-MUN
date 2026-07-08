import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './IntroAnimation.module.css';

const IntroAnimation: React.FC = () => {
  const [hasPlayed, setHasPlayed] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check if animation has already played in this session
    const played = sessionStorage.getItem('mun_intro_played');
    if (!played) {
      setHasPlayed(false);
      // Prevent scrolling on the body while the intro plays
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (hasPlayed || !overlayRef.current) return;

    // Create a GSAP matchMedia context to respect reduced motion
    const ctx = gsap.matchMedia();

    ctx.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('mun_intro_played', 'true');
          document.body.style.overflow = '';
          setHasPlayed(true);
        },
      });

      // 1. Initial State
      gsap.set(lightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.9, y: 30 });
      gsap.set(overlayRef.current, { backgroundColor: '#02142A' });

      // Create bubbles dynamically
      const bubbles: HTMLDivElement[] = [];
      if (particlesRef.current) {
        for (let i = 0; i < 250; i++) {
          const bubble = document.createElement('div');
          bubble.className = styles.particle;
          const size = Math.random() * 20 + 4; // sizes from 4px to 24px
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${Math.random() * 100}%`;
          particlesRef.current.appendChild(bubble);
          bubbles.push(bubble);
        }
      }

      // Initial bubble setup
      gsap.set(bubbles, {
        y: window.innerHeight + 100, // Start below screen
        x: 0,
        opacity: 0,
        scale: 0.2,
      });

      // --- Timeline Sequence ---
      const totalSpawnTime = 2.5;

      // Step 1: Bubbles emerge and fill the screen with escalating speed
      tl.to(bubbles, {
        opacity: () => Math.random() * 0.7 + 0.3,
        y: () => Math.random() * window.innerHeight * 0.95, // Fill almost entire screen
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.3, // Drift horizontally
        scale: () => Math.random() * 1.8 + 0.5,
        duration: 2.5,
        stagger: {
          each: totalSpawnTime / 250,
          from: 'start',
          ease: 'power3.in', // Starts slow, escalates rapidly
        },
        ease: 'power1.out',
      }, 0);

      tl.to(lightRef.current, {
        opacity: 0.8,
        scale: 1.2,
        duration: 3,
        ease: 'power2.inOut',
      }, 0);

      // Transition background
      tl.to(overlayRef.current, {
        backgroundColor: '#0B5FA5',
        duration: 3,
        ease: 'power2.inOut',
      }, 0);

      // Peak time when screen is full
      const peakTime = totalSpawnTime + 1.0; 

      // Step 2: Cinematic pressure wave explosion
      tl.to(bubbles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 3, // Burst extremely far horizontally
        y: () => (Math.random() - 0.5) * window.innerHeight * 3, // Burst extremely far vertically
        scale: () => (Math.random() > 0.5 ? 0 : Math.random() * 3), // Half pop to 0, half scale up and fly
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out', // Cinematic pressure wave snap
      }, peakTime);

      // Step 3: Title reveal right after the center clears
      tl.set(titleRef.current, { opacity: 0, scale: 0.95 }, 0);
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 2,
        ease: 'power2.out',
      }, peakTime + 0.2); // Fades in as bubbles clear out
      
      // Step 4: The wave sweep. The entire overlay translates UP.
      tl.to(overlayRef.current, {
        yPercent: -120,
        duration: 1.5,
        ease: 'power3.inOut',
      }, peakTime + 2.5); // Give title 2.3 seconds to be seen

    });

    // Reduced motion alternative (instant or very quick fade)
    ctx.add('(prefers-reduced-motion: reduce)', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('mun_intro_played', 'true');
          document.body.style.overflow = '';
          setHasPlayed(true);
        },
      });

      gsap.set(titleRef.current, { opacity: 1 });
      
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, [hasPlayed]);

  if (hasPlayed) return null;

  return (
    <div ref={overlayRef} className={styles.introOverlay}>
      <div ref={lightRef} className={styles.lightRays} />
      <div ref={particlesRef} className={styles.particlesContainer} />
      
      <div className={styles.titleContainer}>
        <h1 ref={titleRef} className={styles.title}>AlaçatıMUN</h1>
      </div>

      <div className={styles.wipeWaveContainer}>
        <svg 
          className={styles.wipeWaveSvg}
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#0B5FA5" 
            d="M0,0L48,21.3C96,43,192,85,288,117.3C384,149,480,171,576,160C672,149,768,107,864,85.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default IntroAnimation;
