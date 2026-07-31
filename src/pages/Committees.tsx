import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Award } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { committees } from '../data/mockData';
import styles from './Committees.module.css';

const Committees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const filteredCommittees = committees.filter(committee => {
    const matchesSearch = committee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          committee.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter ? committee.difficulty === difficultyFilter : true;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className={styles.committeesPage}>
      {/* Banner */}
      <section className={styles.banner}>
        <div className={`container ${styles.bannerContainer}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>Committees</h1>
            <p className={styles.subtitle}>Explore the diverse range of committees offered at AlaçatıMUN 2026.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters and List */}
      <section className={styles.mainSection}>
        <div className={`container`}>
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <Input 
                label="" 
                placeholder="Search committees..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterWrapper}>
              <Filter className={styles.filterIcon} size={20} />
              <Select 
                label=""
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Levels' },
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' }
                ]}
                className={styles.filterSelect}
              />
            </div>
          </div>

          {filteredCommittees.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No committees found matching your criteria.</p>
              <button className={styles.resetBtn} onClick={() => {setSearchTerm(''); setDifficultyFilter('');}}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredCommittees.map((committee, index) => (
                <motion.div
                  key={committee.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card hoverable className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img src={committee.image} alt={committee.name} />
                      <div className={styles.badge}>{committee.difficulty}</div>
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.name}>{committee.name}</h3>
                      <p className={styles.agenda}><strong>Agenda:</strong> {committee.agenda}</p>
                      <p className={styles.description}>{committee.shortDescription}</p>
                      
                      <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                          <Award size={16} />
                          <span>Level: {committee.difficulty}</span>
                        </div>
                      </div>
                      
                      <button className={styles.learnMoreBtn}>Learn More</button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Committees;
