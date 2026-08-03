import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase';
import { committees } from '../data/mockData';
import styles from './Register.module.css';

const RegisterChairboard: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    expList: '',
    pref1: '',
    pref2: '',
    pref3: '',
    motivationLetter: '',
    crisisDirective: '',
    gaProcedure: '',
    message: '',
    references: '',
    qAiSuspicion: '',
    qFinalDocuments: '',
    qDirectiveHelp: '',
    qDisagreement: '',
    qResolutionPaper: '',
    shuttle: '',
    accommodation: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const committeeOptions = committees.map(c => ({ value: c.id, label: c.name }));
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
    if (!formData.pref1) newErrors.pref1 = '1st choice is required';
    if (!formData.pref2) newErrors.pref2 = '2nd choice is required';
    if (!formData.pref3) newErrors.pref3 = '3rd choice is required';
    
    if (!formData.motivationLetter.trim()) {
      newErrors.motivationLetter = 'Motivation letter is required';
    } else if (formData.motivationLetter.trim().length < 150) {
      newErrors.motivationLetter = 'Motivation letter must be at least 150 characters';
    }
    
    if (!formData.qAiSuspicion.trim()) newErrors.qAiSuspicion = 'Please answer this question';
    if (!formData.qFinalDocuments.trim()) newErrors.qFinalDocuments = 'Please answer this question';
    if (!formData.qDisagreement.trim()) newErrors.qDisagreement = 'Please answer this question';
    if (!formData.shuttle) newErrors.shuttle = 'Please select your shuttle preference';
    if (!formData.accommodation) newErrors.accommodation = 'Please select your accommodation preference';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('chairboard_apps')
          .insert([
            {
              full_name: formData.fullName,
              school: formData.school,
              grade: formData.grade,
              email: formData.email,
              phone: formData.phone,
              exp_list: formData.expList,
              pref1: formData.pref1,
              pref2: formData.pref2,
              pref3: formData.pref3,
              motivation_letter: formData.motivationLetter,
              crisis_directive: formData.crisisDirective,
              ga_procedure: formData.gaProcedure,
              message: formData.message,
              references_text: formData.references,
              q_ai_suspicion: formData.qAiSuspicion,
              q_final_documents: formData.qFinalDocuments,
              q_directive_help: formData.qDirectiveHelp,
              q_disagreement: formData.qDisagreement,
              q_resolution_paper: formData.qResolutionPaper,
              shuttle: formData.shuttle,
              accommodation: formData.accommodation === 'yes'
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
              Thank you for applying to the Chairboard for AlaçatıMUN 2026. We have received your application
              and will evaluate it carefully.
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
            <h1 className={styles.title}>Chairboard Registration</h1>
            <p className={styles.subtitle}>Apply to chair a committee and lead discussions.</p>
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
                  label="School"
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
              <h3 className={styles.sectionTitle}>MUN Experience</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Experience List (Optional)</label>
                <textarea
                  className={styles.textarea}
                  name="expList"
                  value={formData.expList}
                  onChange={handleChange}
                  placeholder="List your previous MUN conferences, committees, and awards. Leave blank if this is your first conference."
                  rows={4}
                  maxLength={3000}
                ></textarea>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Committee Preferences</h3>
              <div className={styles.grid}>
                <Select
                  label="1st Choice"
                  name="pref1"
                  value={formData.pref1}
                  onChange={handleChange}
                  options={committeeOptions}
                  error={errors.pref1}
                />
                <Select
                  label="2nd Choice"
                  name="pref2"
                  value={formData.pref2}
                  onChange={handleChange}
                  options={committeeOptions}
                  error={errors.pref2}
                />
                <Select
                  label="3rd Choice"
                  name="pref3"
                  value={formData.pref3}
                  onChange={handleChange}
                  options={committeeOptions}
                  error={errors.pref3}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Motivation</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Motivation Letter (Min. 150 characters)</label>
                <textarea
                  className={`${styles.textarea} ${errors.motivationLetter ? styles.textareaError : ''}`}
                  name="motivationLetter"
                  value={formData.motivationLetter}
                  onChange={handleChange}
                  placeholder="Why do you want to chair at AlaçatıMUN? Describe your leadership style and what you bring to the committee."
                  rows={7}
                  maxLength={5000}
                ></textarea>
                {errors.motivationLetter && <span className={styles.error}>{errors.motivationLetter}</span>}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Technical Details (Optional)</h3>
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Sample Crisis Directive (for crisis directors)</label>
                <textarea
                  className={styles.textarea}
                  name="crisisDirective"
                  value={formData.crisisDirective}
                  onChange={handleChange}
                  placeholder="If you are applying as a Crisis Director, share a sample directive you would inject into a committee. Leave blank if you are applying for a GA committee."
                  rows={4}
                  maxLength={3000}
                ></textarea>
              </div>
              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>GA Procedure (for GA chairs)</label>
                <textarea
                  className={styles.textarea}
                  name="gaProcedure"
                  value={formData.gaProcedure}
                  onChange={handleChange}
                  placeholder="If you are applying for a GA committee, walk us through how you would run the session and establish speakers list. Leave blank if you are applying as a Crisis Director."
                  rows={4}
                  maxLength={3000}
                ></textarea>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Scenario Questions</h3>
              
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>You have listened to a delegate's speeches and you suspect that the delegate is using AI. What would you do? *</label>
                <textarea
                  className={`${styles.textarea} ${errors.qAiSuspicion ? styles.textareaError : ''}`}
                  name="qAiSuspicion"
                  value={formData.qAiSuspicion}
                  onChange={handleChange}
                  placeholder="Your answer..."
                  rows={4}
                  maxLength={2000}
                ></textarea>
                {errors.qAiSuspicion && <span className={styles.error}>{errors.qAiSuspicion}</span>}
              </div>

              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>Explain the final documents and their details (Resolution Paper, Declaration, Communiqué, Final Directive) *</label>
                <textarea
                  className={`${styles.textarea} ${errors.qFinalDocuments ? styles.textareaError : ''}`}
                  name="qFinalDocuments"
                  value={formData.qFinalDocuments}
                  onChange={handleChange}
                  placeholder="Your answer..."
                  rows={4}
                  maxLength={3000}
                ></textarea>
                {errors.qFinalDocuments && <span className={styles.error}>{errors.qFinalDocuments}</span>}
              </div>

              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>One of your delegates is having troubles in writing a directive. What would you do to solve this issue? (for crisis applicants)</label>
                <textarea
                  className={styles.textarea}
                  name="qDirectiveHelp"
                  value={formData.qDirectiveHelp}
                  onChange={handleChange}
                  placeholder="Your answer (Optional if not applying for crisis)..."
                  rows={4}
                  maxLength={2000}
                ></textarea>
              </div>

              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>There is 1 session left and half of the resolution paper has been written. What would you do in the last session to finish the resolution paper? (for ga appliers)</label>
                <textarea
                  className={styles.textarea}
                  name="qResolutionPaper"
                  value={formData.qResolutionPaper}
                  onChange={handleChange}
                  placeholder="Your answer (Optional if not applying for GA)..."
                  rows={4}
                  maxLength={3000}
                ></textarea>
              </div>

              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>You and another Chairboard member had different opinions regarding a procedural matter, and the other Chairboard member insisted that their opinion was correct and this disagreement started to affect the committee. What would you do to resolve this issue? *</label>
                <textarea
                  className={`${styles.textarea} ${errors.qDisagreement ? styles.textareaError : ''}`}
                  name="qDisagreement"
                  value={formData.qDisagreement}
                  onChange={handleChange}
                  placeholder="Your answer..."
                  rows={4}
                  maxLength={3000}
                ></textarea>
                {errors.qDisagreement && <span className={styles.error}>{errors.qDisagreement}</span>}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Logistics *</h3>
              <div className={styles.grid}>
                <Select
                  label="Which shuttle will you use?"
                  name="shuttle"
                  value={formData.shuttle}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select a shuttle...' },
                    { value: 'Halkapınar', label: 'Halkapınar' },
                    { value: 'Karşıyaka', label: 'Karşıyaka' },
                    { value: 'Fahrettin Altay', label: 'Fahrettin Altay' },
                    { value: 'Torbalı', label: 'Torbalı' },
                    { value: 'I will not use a shuttle', label: 'I will not use a shuttle' }
                  ]}
                  error={errors.shuttle}
                />
                
                <Select
                  label="Will you be using the accommodation?"
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  error={errors.accommodation}
                />
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
              <div className={styles.textareaWrapper} style={{ marginTop: '1rem' }}>
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

export default RegisterChairboard;
