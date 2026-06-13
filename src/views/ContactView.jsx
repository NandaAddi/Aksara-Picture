import React, { memo, useState } from 'react';

function ContactView({ t, className, handleContactSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    package: '',
    campus: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleContactSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      date: '',
      package: '',
      campus: ''
    });
  };

  return (
    <div id="contact-view" className={className}>
      <div className="glass-card">
        <h2 className="section-label">{t("contact-label")}</h2>
        <p className="text-body" style={{ marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: t("contact-desc") }} />
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="minimal-input" 
            placeholder={t("placeholder-name")} 
            required 
          />
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="minimal-input" 
            placeholder={t("placeholder-date")} 
            required 
          />
          <select 
            name="package"
            value={formData.package}
            onChange={handleChange}
            className="minimal-input" 
            required
          >
            <option value="" disabled hidden>{t("placeholder-package")}</option>
            <option value="Personal">{t("package-solo")}</option>
            <option value="Group">{t("package-group")}</option>
            <option value="Outdoor">{t("package-outdoor")}</option>
            <option value="VIP / Custom">{t("package-vip")}</option>
          </select>
          <input 
            type="text" 
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            className="minimal-input" 
            placeholder={t("placeholder-campus")} 
            required 
          />
          <button type="submit" className="action-btn">{t("btn-submit")}</button>
        </form>
      </div>
    </div>
  );
}

export default memo(ContactView);
