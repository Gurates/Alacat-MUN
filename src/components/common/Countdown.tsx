import React, { useState, useEffect, useRef } from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  targetDate: string; // e.g., "2027-01-02T09:00:00"
}

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isOver: boolean;
}

function calculateTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', isOver: true };
  }
  return {
    days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
    hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
    minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
    seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
    isOver: false,
  };
}

const FlipDigit: React.FC<{ digit: string; delay?: number }> = ({ digit, delay = 0 }) => {
  const [flip, setFlip] = useState(false);
  const prevDigit = useRef(digit);

  useEffect(() => {
    if (prevDigit.current !== digit) {
      setFlip(true);
      const timeout = setTimeout(() => {
        setFlip(false);
        prevDigit.current = digit;
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [digit]);

  return (
    <span
      className={`${styles.digit} ${flip ? styles.digitFlip : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {digit}
    </span>
  );
};

const TimeUnit: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const digits = value.split('');

  return (
    <div className={styles.timeBlock}>
      <div className={styles.digitGroup}>
        {digits.map((d, i) => (
          <FlipDigit key={`${label}-${i}`} digit={d} delay={i * 50} />
        ))}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

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
    return null;
  }

  return (
    <div className={styles.countdownContainer}>
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className={styles.separator}>:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className={styles.separator}>:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className={styles.separator}>:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default Countdown;
