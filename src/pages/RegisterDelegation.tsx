import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase';
import styles from './Register.module.css';

const RegisterDelegation: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    school: '',
    delegationName: '',
    expectedMembers: '',
    email: '',
    phone: '',
    allEmails: '',
    allPhones: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.school.trim()) newErrors.school = 'School is required';
    if (!formData.delegationName.trim()) newErrors.delegationName = 'Delegation name is required';
    if (!formData.expectedMembers.trim()) newErrors.expectedMembers = 'Expected members is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.allEmails.trim()) newErrors.allEmails = 'All member emails are required';
    if (!formData.allPhones.trim()) newErrors.allPhones = 'All member phones are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      try {
        const { error } = await supabase
          .from('delegations')
          .insert([
            {
              full_name: formData.fullName,
              school: formData.school,
              delegation_name: formData.delegationName,
              expected_members: parseInt(formData.expectedMembers, 10),
              email: formData.email,
              phone: formData.phone,
              all_emails: formData.allEmails,
              all_phones: formData.allPhones,
              message: formData.message
            }
          ]);

        if (error) {
          throw error;
        }

        setIsSuccess(true);
      } catch (error: any) {
        console.error('Error submitting application:', error.message);
        alert('An error occurred while submitting your application. Please try again or contact support.');
      } finally {
        setIsSubmitting(false);
      }
    }
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
              Thank you for applying as a Delegation to AlaçatıMUN 2026. We have received your application
              and will get back to you via email shortly.
            </p>
            <Button onClick={() => window.location.href = '/'} variant="primary">Return Home</Button>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <h1 className={styles.title}>Delegation Registration</h1>
            <p className={styles.subtitle}>Register your school's delegation and bring your team to AlaçatıMUN '26.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Delegation Setup</h3>
              <div className={styles.grid}>
                <Input
                  label="Full Name (Head Delegate)"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="Your full name"
                  maxLength={100}
                />
                <Input
                  label="School"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  error={errors.school}
                  placeholder="Your school or institution"
                  maxLength={150}
                />
                <Input
                  label="Delegation Name"
                  name="delegationName"
                  value={formData.delegationName}
                  onChange={handleChange}
                  error={errors.delegationName}
                  placeholder="Enter your delegation name"
                  maxLength={150}
                />
                <Input
                  label="Expected Members"
                  type="number"
                  name="expectedMembers"
                  value={formData.expectedMembers}
                  onChange={handleChange}
                  error={errors.expectedMembers}
                  placeholder="e.g. 12"
                  max={200}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Contact Details</h3>
              <div className={styles.grid}>
                <Input
                  label="Your Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  maxLength={100}
                />
                <Input
                  label="Your Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="0555 000 00 00"
                  maxLength={25}
                />
              </div>

              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>All Member Emails</label>
                <textarea
                  className={`${styles.textarea} ${errors.allEmails ? styles.textareaError : ''}`}
                  name="allEmails"
                  value={formData.allEmails}
                  onChange={handleChange}
                  placeholder={`student1@school.com\nstudent2@school.com`}
                  rows={4}
                  maxLength={3000}
                ></textarea>
                {errors.allEmails && <span className={styles.error}>{errors.allEmails}</span>}
              </div>

              <div className={styles.textareaWrapper}>
                <label className={styles.label}>All Member Phone Numbers</label>
                <textarea
                  className={`${styles.textarea} ${errors.allPhones ? styles.textareaError : ''}`}
                  name="allPhones"
                  value={formData.allPhones}
                  onChange={handleChange}
                  placeholder={`0555 000 00 00\n0555 111 11 11`}
                  rows={4}
                  maxLength={1500}
                ></textarea>
                {errors.allPhones && <span className={styles.error}>{errors.allPhones}</span>}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Additional Information</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Anything you want to add (Optional)</label>
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
            </div>

            <div className={styles.submitWrapper}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterDelegation;
