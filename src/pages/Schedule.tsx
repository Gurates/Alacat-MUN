import React, { useState } from 'react';
import styles from './Schedule.module.css';

interface Event {
  time: string;
  title: string;
  location: string;
  type: 'academic' | 'social' | 'meal' | 'general';
}

interface DaySchedule {
  date: string;
  events: Event[];
}

const scheduleData: DaySchedule[] = [
  {
    date: 'Day 1 - Friday',
    events: [
      { time: '09:00 - 10:30', title: 'Registration & Welcome Breakfast', location: 'Main Hall', type: 'general' },
      { time: '10:30 - 12:00', title: 'Opening Ceremony', location: 'Auditorium', type: 'general' },
      { time: '12:00 - 13:00', title: 'Lunch Break', location: 'Cafeteria', type: 'meal' },
      { time: '13:00 - 15:30', title: 'Committee Session I', location: 'Committee Rooms', type: 'academic' },
      { time: '15:30 - 16:00', title: 'Coffee Break', location: 'Foyer', type: 'meal' },
      { time: '16:00 - 18:30', title: 'Committee Session II', location: 'Committee Rooms', type: 'academic' },
    ]
  },
  {
    date: 'Day 2 - Saturday',
    events: [
      { time: '09:30 - 11:30', title: 'Committee Session III', location: 'Committee Rooms', type: 'academic' },
      { time: '11:30 - 12:00', title: 'Coffee Break', location: 'Foyer', type: 'meal' },
      { time: '12:00 - 14:00', title: 'Committee Session IV', location: 'Committee Rooms', type: 'academic' },
      { time: '14:00 - 15:00', title: 'Lunch Break', location: 'Cafeteria', type: 'meal' },
      { time: '15:00 - 17:30', title: 'Committee Session V', location: 'Committee Rooms', type: 'academic' },
      { time: '20:00 - 23:30', title: 'Social Event: Gala Dinner', location: 'Grand Hotel', type: 'social' },
    ]
  },
  {
    date: 'Day 3 - Sunday',
    events: [
      { time: '10:00 - 12:30', title: 'Committee Session VI', location: 'Committee Rooms', type: 'academic' },
      { time: '12:30 - 13:30', title: 'Lunch Break', location: 'Cafeteria', type: 'meal' },
      { time: '13:30 - 15:30', title: 'Plenary Session & Voting', location: 'Auditorium', type: 'academic' },
      { time: '15:30 - 16:00', title: 'Coffee Break', location: 'Foyer', type: 'meal' },
      { time: '16:00 - 17:30', title: 'Closing Ceremony & Awards', location: 'Auditorium', type: 'general' },
    ]
  }
];

const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className={styles.schedulePage}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Conference Schedule</h1>
        <p className={styles.subtitle}>Plan your 3-day MUN experience</p>
      </div>

      <div className={styles.container}>
        <div className={styles.daySelector}>
          {scheduleData.map((day, index) => (
            <button
              key={index}
              className={`${styles.dayButton} ${activeDay === index ? styles.active : ''}`}
              onClick={() => setActiveDay(index)}
            >
              {day.date}
            </button>
          ))}
        </div>

        <div className={styles.scheduleContainer}>
          <div className={styles.timeline}>
            {scheduleData[activeDay].events.map((event, index) => (
              <div key={index} className={styles.eventCard}>
                <div className={styles.timeColumn}>
                  <span className={styles.time}>{event.time}</span>
                </div>
                <div className={`${styles.detailsColumn} ${styles[event.type]}`}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <div className={styles.eventLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
