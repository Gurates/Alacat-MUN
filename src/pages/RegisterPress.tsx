import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase';
import styles from './Register.module.css';

const RegisterPress: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    orgExpList: '',
    cameraModel: '',
    references: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const gradeOptions = [
    { value: 'Prep', label: 'Prep' },
    { value: '9th Grade', label: '9th Grade' },
    { value: '10th Grade', label: '10th Grade' },
    { value: '11th Grade', label: '11th Grade' },
    { value: '12th Grade', label: '12th Grade' }
  ];

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
    if (!formData.grade) newErrors.grade = 'Grade is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('press_apps')
          .insert([
            {
              full_name: formData.fullName,
              school: formData.school,
              grade: formData.grade,
              email: formData.email,
              phone: formData.phone,
              org_exp_list: formData.orgExpList,
              camera_model: formData.cameraModel,
              references_text: formData.references,
              message: formData.message
            }
          ]);

        if (error) {
          throw error;
        }
        
        setIsSuccess(true);
      } catch (error: any) {
        console.error('Error submitting application:', error.message);
        alert('An error occurred while submitting your application.');
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
              Thank you for applying to the Press Corps for AlaçatıMUN 2026. We have received your application
              and will get back to you soon.
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
            <h1 className={styles.title}>Press Corps Registration</h1>
            <p className={styles.subtitle}>Cover AlaçatıMUN '26 as a journalist or photographer.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Personal Details</h3>
              <div className={styles.grid}>
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="Your full name"
                  maxLength={100}
                />
                <Input
                  label="School / Institution"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  error={errors.school}
                  placeholder="Your school or institution"
                  maxLength={150}
                />
                <Select
                  label="Grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  options={gradeOptions}
                  error={errors.grade}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  maxLength={100}
                />
                <Input
                  label="Phone"
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
              <h3 className={styles.sectionTitle}>Experience & Equipment (Optional)</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Organization / Publication Experience</label>
                <textarea
                  className={styles.textarea}
                  name="orgExpList"
                  value={formData.orgExpList}
                  onChange={handleChange}
                  placeholder="List any newspapers, magazines, photography clubs, school publications, or other organizations you've been part of. Leave blank if none."
                  rows={4}
                  maxLength={3000}
                ></textarea>
              </div>
              <div className={styles.grid} style={{ marginTop: '1rem' }}>
                <Input
                  label="Camera Brand / Model"
                  name="cameraModel"
                  value={formData.cameraModel}
                  onChange={handleChange}
                  placeholder="e.g. Canon EOS 90D, Sony α6400, iPhone 15 Pro"
                  maxLength={150}
                />
              </div>
              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>References</label>
                <textarea
                  className={styles.textarea}
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="Names and contact details of teachers, editors, or coordinators who can speak to your work."
                  rows={3}
                  maxLength={1000}
                ></textarea>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Additional Details (Optional)</h3>
              <div className={styles.textareaWrapper}>
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

export default RegisterPress;
