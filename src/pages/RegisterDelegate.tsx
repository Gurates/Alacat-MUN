import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { committees } from '../data/mockData';
import { supabase } from '../lib/supabase';
import styles from './Register.module.css';

const RegisterDelegate: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    expList: '',
    committeePreference1: '',
    committeePreference2: '',
    committeePreference3: '',
    motivationLetter: '',
    shuttleWanted: '',
    shuttleFrom: '',
    message: '',
    references: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const committeeOptions = committees.map(c => ({ value: c.name, label: c.name }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name (at least 3 characters).';
    }
    if (!formData.school.trim()) {
      newErrors.school = 'Please enter your school or institution.';
    }
    if (!formData.grade) {
      newErrors.grade = 'Please select your grade.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }
    if (!formData.committeePreference1) {
      newErrors.committeePreference1 = 'Please select your 1st committee preference.';
    }
    if (!formData.committeePreference2) {
      newErrors.committeePreference2 = 'Please select your 2nd committee preference.';
    }
    if (!formData.committeePreference3) {
      newErrors.committeePreference3 = 'Please select your 3rd committee preference.';
    }
    if (!formData.motivationLetter.trim() || formData.motivationLetter.trim().length < 150) {
      newErrors.motivationLetter = `Motivation letter must be at least 150 characters. (${formData.motivationLetter.trim().length}/150)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('registrations')
          .insert([
            {
              full_name: formData.fullName,
              school: formData.school,
              grade: formData.grade,
              email: formData.email,
              phone: formData.phone,
              exp_list: formData.expList,
              committee_preference_1: formData.committeePreference1,
              committee_preference_2: formData.committeePreference2,
              committee_preference_3: formData.committeePreference3,
              motivation_letter: formData.motivationLetter,
              shuttle_wanted: formData.shuttleWanted || 'no_preference',
              shuttle_from: formData.shuttleWanted === 'yes' ? formData.shuttleFrom : null,
              message: formData.message,
              references: formData.references
            }
          ]);

        if (error) throw error;
        
        setIsSuccess(true);
      } catch (error: any) {
        console.error('Error submitting application:', error.message);
        alert(`An error occurred while submitting your application: ${error.message}. Please try again or contact support.`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Helper to disable already selected committees in other dropdowns
  const getFilteredCommitteeOptions = (currentFieldName: string) => {
    const selectedValues = [
      formData.committeePreference1,
      formData.committeePreference2,
      formData.committeePreference3
    ];
    
    return committeeOptions.map(opt => {
      const isSelectedElsewhere = selectedValues.some((val, idx) => {
        const fieldName = `committeePreference${idx + 1}`;
        return fieldName !== currentFieldName && val === opt.value;
      });
      return {
        ...opt,
        disabled: isSelectedElsewhere
      };
    });
  };

  if (isSuccess) {
    return (
      <div className={styles.registerPage}>
        <div className={`container ${styles.container}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.successCard}
          >
            <CheckCircle className={styles.successIcon} size={64} />
            <h2 className={styles.successTitle}>Application Submitted!</h2>
            <p className={styles.successText}>
              Thank you for applying to AlaçatıMUN 2026. We have received your application
              and will get back to you via email within 5-7 business days.
            </p>
            <Button onClick={() => window.location.href = '/'} variant="primary">Return Home</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const motLen = formData.motivationLetter.length;
  const motPct = Math.min((motLen / 150) * 100, 100);

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
          className={styles.formWrapper}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>Delegate Application</h1>
            <p className={styles.subtitle}>Represent a nation in one of our committees. Please fill out the application form carefully.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>General Information</h3>
              <div className={styles.grid}>
                <Input
                  label="Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="Your full name"
                  maxLength={100}
                />
                <Input
                  label="School / Institution *"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  error={errors.school}
                  placeholder="Your school or institution"
                  maxLength={150}
                />
                <Select
                  label="Grade *"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  options={[
                    { value: 'Prep', label: 'Prep' },
                    { value: '9th Grade', label: '9th Grade' },
                    { value: '10th Grade', label: '10th Grade' },
                    { value: '11th Grade', label: '11th Grade' },
                    { value: '12th Grade', label: '12th Grade' }
                  ]}
                  error={errors.grade}
                />
                <Input
                  label="Email *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  maxLength={100}
                />
                <Input
                  label="Phone *"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="0555 000 00 00"
                  maxLength={25}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>MUN Experience</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>
                  MUN Experience <span className={styles.optionalTag}>(optional)</span>
                </label>
                <textarea
                  className={styles.textarea}
                  name="expList"
                  value={formData.expList}
                  onChange={handleChange}
                  placeholder="List your previous MUN conferences, committees, and awards.&#10;Leave blank if this is your first conference."
                  rows={4}
                  maxLength={3000}
                ></textarea>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Committee Preferences *</h3>
              <div className={styles.grid}>
                <Select
                  label="1st Choice"
                  name="committeePreference1"
                  value={formData.committeePreference1}
                  onChange={handleChange}
                  options={getFilteredCommitteeOptions('committeePreference1')}
                  error={errors.committeePreference1}
                />
                <Select
                  label="2nd Choice"
                  name="committeePreference2"
                  value={formData.committeePreference2}
                  onChange={handleChange}
                  options={getFilteredCommitteeOptions('committeePreference2')}
                  error={errors.committeePreference2}
                />
                <Select
                  label="3rd Choice"
                  name="committeePreference3"
                  value={formData.committeePreference3}
                  onChange={handleChange}
                  options={getFilteredCommitteeOptions('committeePreference3')}
                  error={errors.committeePreference3}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Motivation Letter *</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Why do you want to attend AlaçatıMUN 2026? What do you hope to gain from the experience?</label>
                <textarea
                  className={`${styles.textarea} ${errors.motivationLetter ? styles.textareaError : ''}`}
                  name="motivationLetter"
                  value={formData.motivationLetter}
                  onChange={handleChange}
                  placeholder="Motivation Letter (Min. 150 characters)..."
                  rows={7}
                  maxLength={5000}
                ></textarea>
                
                <div className={styles.progressBarWrapper} style={{ marginTop: '0.5rem', height: '4px', background: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${motPct}%`, 
                      height: '100%', 
                      background: motLen >= 150 ? 'var(--color-secondary)' : 'linear-gradient(to right, var(--color-accent), var(--color-secondary))',
                      transition: 'width 0.2s ease'
                    }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  {errors.motivationLetter ? (
                    <span className={styles.error} style={{ margin: 0 }}>{errors.motivationLetter}</span>
                  ) : <span />}
                  <span>{motLen} / 150</span>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Shuttle Service <span className={styles.optionalTag}>(optional)</span></h3>
              <div className={styles.grid}>
                <Select
                  label="Shuttle Preference"
                  name="shuttleWanted"
                  value={formData.shuttleWanted}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'No preference' },
                    { value: 'yes', label: 'Yes, I would like shuttle' },
                    { value: 'no', label: 'No, I will arrange my own transport' }
                  ]}
                />
                {formData.shuttleWanted === 'yes' && (
                  <Input
                    label="Pick-up Location"
                    name="shuttleFrom"
                    value={formData.shuttleFrom}
                    onChange={handleChange}
                    placeholder="e.g. Alsancak, Konak, Bornova"
                    maxLength={100}
                  />
                )}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Additional Info & References <span className={styles.optionalTag}>(optional)</span></h3>
              <div className={styles.grid}>
                <div className={styles.textareaWrapper} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Anything you want to add</label>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any additional information you'd like us to know..."
                    rows={3}
                    maxLength={2000}
                  ></textarea>
                </div>
                <div className={styles.textareaWrapper} style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                  <label className={styles.label}>References</label>
                  <textarea
                    className={styles.textarea}
                    name="references"
                    value={formData.references}
                    onChange={handleChange}
                    placeholder="Names and contact details of people who can speak to your MUN experience (e.g. a previous chair or faculty advisor)."
                    rows={3}
                    maxLength={1000}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className={styles.submitWrapper}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterDelegate;

