import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { committees } from '../data/mockData';
import styles from './Register.module.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    country: '',
    committeeId: '',
    experience: '',
    motivationLetter: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const committeeOptions = committees.map(c => ({ value: c.id, label: c.name }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.school.trim()) newErrors.school = 'School/University is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.committeeId) newErrors.committeeId = 'Please select a committee';
    if (!formData.experience) newErrors.experience = 'Please select your experience level';
    if (!formData.motivationLetter.trim()) {
      newErrors.motivationLetter = 'Motivation letter is required';
    } else if (formData.motivationLetter.trim().length < 100) {
      newErrors.motivationLetter = 'Motivation letter must be at least 100 characters';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        // Reset form or redirect in a real app
      }, 1500);
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
              Thank you for applying to AlaçatıMUN 2026. We have received your application
              and will get back to you via email within 5-7 business days.
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
            <h1 className={styles.title}>Delegate Registration</h1>
            <p className={styles.subtitle}>Join us for an unforgettable diplomatic experience. Please fill out the application form carefully.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              <div className={styles.grid}>
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Doe"
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="john.doe@example.com"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="School / University"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  error={errors.school}
                  placeholder="Oxford University"
                />
                <Input
                  label="Country of Residence"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  error={errors.country}
                  placeholder="United Kingdom"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Committee Preferences</h3>
              <div className={styles.grid}>
                <Select
                  label="Preferred Committee"
                  name="committeeId"
                  value={formData.committeeId}
                  onChange={handleChange}
                  options={committeeOptions}
                  error={errors.committeeId}
                />
                <Select
                  label="Previous MUN Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  options={[
                    { value: 'none', label: 'None (First Timer)' },
                    { value: '1-2', label: '1-2 Conferences' },
                    { value: '3-5', label: '3-5 Conferences' },
                    { value: '5+', label: 'More than 5 Conferences' }
                  ]}
                  error={errors.experience}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Motivation</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Motivation Letter (Min. 100 characters)</label>
                <textarea
                  className={`${styles.textarea} ${errors.motivationLetter ? styles.textareaError : ''}`}
                  name="motivationLetter"
                  value={formData.motivationLetter}
                  onChange={handleChange}
                  placeholder="Please explain why you wish to participate in AlaçatıMUN and your chosen committee..."
                  rows={6}
                ></textarea>
                {errors.motivationLetter && <span className={styles.error}>{errors.motivationLetter}</span>}
              </div>
            </div>

            <div className={styles.formSection}>
              <label className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxLabel}>
                  I agree to the OceanMUN Terms and Conditions, Privacy Policy, and Code of Conduct.
                </span>
              </label>
              {errors.agreeTerms && <span className={styles.error} style={{ display: 'block', marginTop: '0.5rem' }}>{errors.agreeTerms}</span>}
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

export default Register;
