import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  targetDate: string; // e.g., "2026-07-27T10:00:00"
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target: string) {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) {
      return { days: '0', hours: '00', minutes: '00', seconds: '00', isOver: true };
    }
    return {
      days: String(Math.floor(diff / 86400000)),
      hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
      minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
      seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      isOver: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft(targetDate);
      setTimeLeft(newTime);
      if (newTime.isOver) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isOver) {
    return null; // Or a message saying it started
  }

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.timeBlock}>
        <span className={styles.number}>{timeLeft.days}</span>
        <span className={styles.label}>Days</span>
      </div>
      <div className={styles.timeBlock}>
        <span className={styles.number}>{timeLeft.hours}</span>
        <span className={styles.label}>Hours</span>
      </div>
      <div className={styles.timeBlock}>
        <span className={styles.number}>{timeLeft.minutes}</span>
        <span className={styles.label}>Min</span>
      </div>
      <div className={styles.timeBlock}>
        <span className={styles.number}>{timeLeft.seconds}</span>
        <span className={styles.label}>Sec</span>
      </div>
    </div>
  );
};

export default Countdown;
