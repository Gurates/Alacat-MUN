import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Gavel, Settings, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

const applicationTypes = [
  {
    id: 'delegate',
    title: 'Delegate',
    description: 'Represent a nation in committee',
    icon: <User size={24} />,
    color: 'var(--color-secondary)',
    path: '/register/delegate'
  },
  {
    id: 'delegation',
    title: 'Delegation',
    description: 'Register your school as a group',
    icon: <Users size={24} />,
    color: 'var(--color-text)',
    path: '/register/delegation'
  },
  {
    id: 'chairboard',
    title: 'Chairboard',
    description: 'Lead and moderate a committee',
    icon: <Gavel size={24} />,
    color: 'var(--color-accent)',
    path: '/register/chairboard'
  },
  {
    id: 'admin',
    title: 'Admin Staff',
    description: 'Help organise the conference',
    icon: <Settings size={24} />,
    color: 'var(--color-secondary)',
    path: '/register/admin'
  },
  {
    id: 'press',
    title: 'Press',
    description: 'Cover the event as journalist or photographer',
    icon: <Camera size={24} />,
    color: 'var(--color-text)',
    path: '/register/press'
  }
];

const Register: React.FC = () => {
  return (
    <div className={styles.registerPage}>
      <div className={styles.oceanBackground}>
        <div className={styles.wave}></div>
      </div>
      <div className={`container ${styles.container}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.selectionWrapper}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>Apply</h1>
            <p className={styles.subtitle}>
              Choose your role and submit your application. We look forward to seeing you.
            </p>
          </div>

          <div className={styles.gridSelection}>
            {applicationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={type.path} className={styles.cardLink}>
                  <div className={styles.cardLeftLine} style={{ backgroundColor: type.color }}></div>
                  <div className={styles.cardIcon} style={{ color: type.color }}>
                    {type.icon}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle} style={{ color: type.color }}>{type.title}</h3>
                    <p className={styles.cardDescription}>{type.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
