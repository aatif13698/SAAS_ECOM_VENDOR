import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Install: npm install axios
import authService from '@/services/authService';

const API_BASE = '/api'; // Change to your actual backend base URL

function Organization() {
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullAddress: '',
    phone: '',
    email: '',
    instaLink: '',
    showInsta: false,
    facebookLink: '',
    showFacebook: false,
    linkedinLink: '',
    showLinkedin: false,
    telegramLink: '',
    showTelegram: false,
  });

  const [longLogoFile, setLongLogoFile] = useState(null);
  const [shortLogoFile, setShortLogoFile] = useState(null);
  const [longLogoPreview, setLongLogoPreview] = useState('');
  const [shortLogoPreview, setShortLogoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch organization data
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await authService.getOrgInfo();
        console.log("res?.data?.data", res?.data?.data);
        
        if (res?.data?.data && res?.data?.data._id) {
          setOrgData(res?.data?.data);
          setFormData({
            name: res?.data?.data?.name || '',
            description: res?.data?.data?.description || '',
            fullAddress: res?.data?.data?.fullAddress || '',
            phone: res?.data?.data?.phone || '',
            email: res?.data?.data?.email || '',
            instaLink: res?.data?.data?.instaLink || '',
            showInsta: res?.data?.data?.showInsta || false,
            facebookLink: res?.data?.data?.facebookLink || '',
            showFacebook: res?.data?.data?.showFacebook || false,
            linkedinLink: res?.data?.data?.linkedinLink || '',
            showLinkedin: res?.data?.data?.showLinkedin || false,
            telegramLink: res?.data?.data?.telegramLink || '',
            showTelegram: res?.data?.data?.showTelegram || false,
          });
          setLongLogoPreview(res?.data?.data?.longLogo || '');
          setShortLogoPreview(res?.data?.data?.shortLogo || '');
        } else {
          setIsEditing(true); // No data → directly show create form
        }
      } catch (err) {
        console.error('Fetch error:', err);
        // If 404 or no data, go to create mode
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLongLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLongLogoFile(file);
      setLongLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleShortLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShortLogoFile(file);
      setShortLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const submitData = new FormData();

    // Append text fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    const clientId = localStorage.getItem("saas_client_clientId");
    submitData.append('clientId', clientId);

    // Append files (if new files selected)
    if (longLogoFile) submitData.append('longLogo', longLogoFile);
    if (shortLogoFile) submitData.append('shortLogo', shortLogoFile);

    try {
      let res;
      if (orgData && orgData._id) {
        // Update
        res = await authService.updateOrgInfo(submitData, orgData._id)
        setOrgData(res?.data);
      } else {
        // Create
        res = await authService.createOrgInfo(submitData);
        setOrgData(res?.data);
      }

      console.log("res", res);
      

      setMessage({ type: 'success', text: 'Organization saved successfully!' });
      setIsEditing(false);
      setLongLogoFile(null);
      setShortLogoFile(null);
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save organization. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading organization data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Organization Configuration</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* VIEW MODE */}
      {!isEditing && orgData && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Organization Details</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Organization
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logos */}
            <div>
              <p className="font-medium mb-2">Long Logo</p>
              {orgData.longLogo && (
                <img src={orgData.longLogo} alt="Long Logo" className="max-h-32 object-contain border rounded" />
              )}
            </div>
            <div>
              <p className="font-medium mb-2">Short Logo</p>
              {orgData.shortLogo && (
                <img src={orgData.shortLogo} alt="Short Logo" className="max-h-32 object-contain border rounded" />
              )}
            </div>
          </div>

          <div>
            <p className="font-medium">Name</p>
            <p className="text-lg">{orgData.name}</p>
          </div>

          <div>
            <p className="font-medium">Description</p>
            <p className="text-gray-700">{orgData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-medium">Full Address</p>
              <p>{orgData.fullAddress}</p>
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p>{orgData.phone}</p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p>{orgData.email}</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Social Media</h3>
            <div className="space-y-3">
              {orgData.instaLink && orgData.showInsta && (
                <p>Instagram: <a href={orgData.instaLink} target="_blank" className="text-blue-600 hover:underline">{orgData.instaLink}</a></p>
              )}
              {orgData.facebookLink && orgData.showFacebook && (
                <p>Facebook: <a href={orgData.facebookLink} target="_blank" className="text-blue-600 hover:underline">{orgData.facebookLink}</a></p>
              )}
              {orgData.linkedinLink && orgData.showLinkedin && (
                <p>LinkedIn: <a href={orgData.linkedinLink} target="_blank" className="text-blue-600 hover:underline">{orgData.linkedinLink}</a></p>
              )}
              {orgData.telegramLink && orgData.showTelegram && (
                <p>Telegram: <a href={orgData.telegramLink} target="_blank" className="text-blue-600 hover:underline">{orgData.telegramLink}</a></p>
              )}
              {!orgData.instaLink && !orgData.facebookLink && !orgData.linkedinLink && !orgData.telegramLink && (
                <p className="text-gray-500">No social links configured.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORM MODE (Create or Edit) */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-2xl font-semibold">
            {orgData ? 'Edit Organization' : 'Create Organization'}
          </h2>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name <span className='text-red-500'>*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email <span className='text-red-500'>*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description <span className='text-red-500'>*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Address <span className='text-red-500'>*</span></label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone <span className='text-red-500'>*</span></label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Logos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2">Long Logo <span className='text-red-500'>*</span></label>
              {longLogoPreview && (
                <img src={longLogoPreview} alt="Long Logo Preview" className="mb-3 max-h-32 object-contain border rounded" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLongLogoChange}
                required={!longLogoPreview}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: wide horizontal logo</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Logo <span className='text-red-500'>*</span></label>
              {shortLogoPreview && (
                <img src={shortLogoPreview} alt="Short Logo Preview" className="mb-3 max-h-32 object-contain border rounded" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleShortLogoChange}
                required={!shortLogoPreview}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: square / icon logo</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Social Media Links</h3>
            <div className="space-y-6">
              {['insta', 'facebook', 'linkedin', 'telegram'].map(platform => {
                const key = platform + 'Link';
                const showKey = 'show' + platform.charAt(0).toUpperCase() + platform.slice(1);
                const label = platform === 'insta' ? 'Instagram' :
                  platform === 'facebook' ? 'Facebook' :
                    platform === 'linkedin' ? 'LinkedIn' : 'Telegram';

                return (
                  <div key={platform} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">{label} Link</label>
                      <input
                        type="url"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        placeholder={`https://www.${platform}.com/...`}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6 md:mt-0">
                      <input
                        type="checkbox"
                        name={showKey}
                        checked={formData[showKey]}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <label className="text-sm font-medium">Show on website</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-70 transition"
            >
              {submitting ? 'Saving...' : (orgData ? 'Update Organization' : 'Create Organization')}
            </button>

            {orgData && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default Organization;