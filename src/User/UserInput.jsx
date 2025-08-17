import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCode, FaTools, FaCertificate, FaUpload, FaPlus, FaTimes, FaLinkedin, FaGithub } from 'react-icons/fa';
import "./UserInput.css";

const UserInput = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    linkedinUrl: '',
    githubUrl: '',
    programmingLanguages: [],
    customProgrammingLanguage: '',
    toolsFrameworks: [],
    customToolFramework: '',
    certifications: '',
    certificateFiles: [],
    interestedInPlacement: '',
    preferredDomains: [],
    customPreferredDomain: '',
    internshipDone: '',
    resumeFile: null
  });

  const [errors, setErrors] = useState({});

  // Predefined options
  const programmingLanguageOptions = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'PHP', 'C#'];
  const toolsFrameworksOptions = ['React', 'Node.js', 'Flutter', 'TensorFlow', 'Docker', 'Angular', 'Vue.js', 'Spring', 'Django', 'MongoDB'];
  const preferredDomainOptions = ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'Cybersecurity', 'DevOps', 'Cloud Computing', 'Embedded Systems', 'Game Development', 'Blockchain'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value) 
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const addCustomItem = (listName, customInputName) => {
    const customValue = formData[customInputName].trim();
    if (customValue && !formData[listName].includes(customValue)) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], customValue],
        [customInputName]: ''
      }));
    }
  };

  const removeItem = (listName, item) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(i => i !== item)
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    
    if (type === 'certificates') {
      setFormData(prev => ({
        ...prev,
        certificateFiles: [...prev.certificateFiles, ...files]
      }));
    } else if (type === 'resume') {
      setFormData(prev => ({
        ...prev,
        resumeFile: files[0]
      }));
    }
  };

  const removeCertificateFile = (index) => {
    setFormData(prev => ({
      ...prev,
      certificateFiles: prev.certificateFiles.filter((_, i) => i !== index)
    }));
  };

  // URL validation functions
  const isValidLinkedInUrl = (url) => {
    if (!url) return true; // Optional field
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const isValidGitHubUrl = (url) => {
    if (!url) return true; // Optional field
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
    return githubRegex.test(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Validate LinkedIn URL
    if (formData.linkedinUrl.trim() && !isValidLinkedInUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn profile URL';
    }

    // Validate GitHub URL
    if (formData.githubUrl.trim() && !isValidGitHubUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub profile URL';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle form submission here
      alert('Form submitted successfully!');
    } else {
      setErrors(newErrors);
    }
  };

  const renderSelectedItems = (items, listName) => (
    <div className="selected-items">
      {items.map((item, index) => (
        <span key={index} className="selected-item">
          {item}
          <button 
            type="button" 
            onClick={() => removeItem(listName, item)}
            className="remove-item-btn"
          >
            <FaTimes />
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="route-container">
      <div className="userinput-container">
        <div className="userinput-wrapper">
          <form onSubmit={handleSubmit} className="userinput-form">
            <div className="form-header">
              <h1>Additional Information</h1>
              <div className="header-underline"></div>
              <p className="form-subtitle">Complete your profile for better placement opportunities</p>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              
              <div className="form-grid">
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-box">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={errors.email ? 'error' : ''}
                      required
                    />
                    <FaEnvelope className="input-icon" />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <div className="input-box">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={errors.phone ? 'error' : ''}
                      required
                    />
                    <FaPhone className="input-icon" />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Address</label>
                  <div className="input-box">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      className={errors.address ? 'error' : ''}
                      required
                    />
                    <FaMapMarkerAlt className="input-icon" />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="form-section">
              <h2 className="section-title">Professional Links</h2>
              
              <div className="form-grid">
                <div className="input-group">
                  <label>LinkedIn Profile (Optional)</label>
                  <div className="input-box">
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={errors.linkedinUrl ? 'error' : ''}
                    />
                    <FaLinkedin className="input-icon social-icon linkedin-icon" />
                    {errors.linkedinUrl && <span className="error-text">{errors.linkedinUrl}</span>}
                  </div>
                  <div className="input-helper">
                    <span>Example: https://linkedin.com/in/yourprofile</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>GitHub Profile (Optional)</label>
                  <div className="input-box">
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className={errors.githubUrl ? 'error' : ''}
                    />
                    <FaGithub className="input-icon social-icon github-icon" />
                    {errors.githubUrl && <span className="error-text">{errors.githubUrl}</span>}
                  </div>
                  <div className="input-helper">
                    <span>Example: https://github.com/yourusername</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills / Technical Info */}
            <div className="form-section">
              <h2 className="section-title">Skills & Technical Information</h2>
              
              <div className="form-grid">
                <div className="input-group">
                  <label>Programming Languages</label>
                  <div className="multi-select-container">
                    <div className="checkbox-grid">
                      {programmingLanguageOptions.map(lang => (
                        <label key={lang} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.programmingLanguages.includes(lang)}
                            onChange={() => handleMultiSelect('programmingLanguages', lang)}
                          />
                          <span className="checkmark-small"></span>
                          {lang}
                        </label>
                      ))}
                    </div>
                    
                    <div className="custom-input-container">
                      <input
                        type="text"
                        name="customProgrammingLanguage"
                        value={formData.customProgrammingLanguage}
                        onChange={handleChange}
                        placeholder="Add other programming language"
                        className="custom-input"
                      />
                      <button
                        type="button"
                        onClick={() => addCustomItem('programmingLanguages', 'customProgrammingLanguage')}
                        className="add-custom-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    {formData.programmingLanguages.length > 0 && 
                      renderSelectedItems(formData.programmingLanguages, 'programmingLanguages')
                    }
                  </div>
                </div>

                <div className="input-group">
                  <label>Tools & Frameworks</label>
                  <div className="multi-select-container">
                    <div className="checkbox-grid">
                      {toolsFrameworksOptions.map(tool => (
                        <label key={tool} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.toolsFrameworks.includes(tool)}
                            onChange={() => handleMultiSelect('toolsFrameworks', tool)}
                          />
                          <span className="checkmark-small"></span>
                          {tool}
                        </label>
                      ))}
                    </div>
                    
                    <div className="custom-input-container">
                      <input
                        type="text"
                        name="customToolFramework"
                        value={formData.customToolFramework}
                        onChange={handleChange}
                        placeholder="Add other tool/framework"
                        className="custom-input"
                      />
                      <button
                        type="button"
                        onClick={() => addCustomItem('toolsFrameworks', 'customToolFramework')}
                        className="add-custom-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    {formData.toolsFrameworks.length > 0 && 
                      renderSelectedItems(formData.toolsFrameworks, 'toolsFrameworks')
                    }
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Certifications (Optional)</label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="List your certifications, achievements, or courses..."
                    className="textarea-input"
                    rows="4"
                  />
                </div>

                <div className="input-group full-width">
                  <label>Upload Certificates</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="certificates"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'certificates')}
                      className="file-input"
                    />
                    <label htmlFor="certificates" className="file-upload-label">
                      <FaUpload />
                      Upload Certificate Files
                    </label>
                    {formData.certificateFiles.length > 0 && (
                      <div className="uploaded-files">
                        {formData.certificateFiles.map((file, index) => (
                          <div key={index} className="uploaded-file">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeCertificateFile(index)}
                              className="remove-file-btn"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Placement Details */}
            <div className="form-section">
              <h2 className="section-title">Placement Details</h2>
              
              <div className="form-grid">
                <div className="input-group">
                  <label>Interested in Placement</label>
                  <select
                    name="interestedInPlacement"
                    value={formData.interestedInPlacement}
                    onChange={handleChange}
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe/Undecided</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Internship Experience</label>
                  <select
                    name="internshipDone"
                    value={formData.internshipDone}
                    onChange={handleChange}
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes, completed</option>
                    <option value="ongoing">Currently doing</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="input-group full-width">
                  <label>Preferred Domains</label>
                  <div className="multi-select-container">
                    <div className="checkbox-grid">
                      {preferredDomainOptions.map(domain => (
                        <label key={domain} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.preferredDomains.includes(domain)}
                            onChange={() => handleMultiSelect('preferredDomains', domain)}
                          />
                          <span className="checkmark-small"></span>
                          {domain}
                        </label>
                      ))}
                    </div>
                    
                    <div className="custom-input-container">
                      <input
                        type="text"
                        name="customPreferredDomain"
                        value={formData.customPreferredDomain}
                        onChange={handleChange}
                        placeholder="Add other preferred domain"
                        className="custom-input"
                      />
                      <button
                        type="button"
                        onClick={() => addCustomItem('preferredDomains', 'customPreferredDomain')}
                        className="add-custom-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    {formData.preferredDomains.length > 0 && 
                      renderSelectedItems(formData.preferredDomains, 'preferredDomains')
                    }
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Resume Upload</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'resume')}
                      className="file-input"
                    />
                    <label htmlFor="resume" className="file-upload-label">
                      <FaUpload />
                      Upload Resume
                    </label>
                    {formData.resumeFile && (
                      <div className="uploaded-files">
                        <div className="uploaded-file">
                          <span>{formData.resumeFile.name}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, resumeFile: null }))}
                            className="remove-file-btn"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="back-btn">
                Back
              </button>
              <button type="submit" className="submit-btn">
                Complete Profile
              </button>
            </div>

            <div className="platform-info">
              <div className="info-text">
                <span className="platform-emoji">🎯</span>
                <span>Complete Your Placement Profile</span>
              </div>
              <p className="info-subtitle">
                All information helps us match you with the best opportunities
              </p>
            </div>
          </form>
        </div>

        {/* Background decorative elements */}
        <div className="bg-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default UserInput;