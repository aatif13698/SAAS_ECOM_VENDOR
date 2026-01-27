import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useDarkmode from '@/hooks/useDarkMode';
import statementService from '@/services/statement/statement.service';
// import aboutUsService from '@/services/aboutUs/aboutUs.service';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

function CreateAboutUs() {
  const [isDark] = useDarkmode();
  const navigate = useNavigate();

  const location = useLocation();
  const row = location?.state?.row;
  const name = location?.state?.name;
  const id = location?.state?.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateForm = (data, files) => {
    const newErrors = {};

    if (!data.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const trimmedDesc = data.description.trim();
    if (!trimmedDesc || trimmedDesc === '<p><br></p>') {
      newErrors.description = 'Description is required';
    }

    if (!id) {
      if (files.length !== 3) {
        newErrors.images = 'Please upload exactly three images';
      }
    } else {
      if (files.length > 0 && files.length !== 3) {
        newErrors.images = 'Please upload exactly three images if updating images';
      }
    }

    return newErrors;
  };

  useEffect(() => {
    if (attemptedSubmit) {
      const newErrors = validateForm(formData, selectedFiles);
      setErrors(newErrors);
    }
  }, [formData, selectedFiles, attemptedSubmit, id]);

  useEffect(() => {
    if (id) {
      setFormData({
        title: row?.title || '',
        description: row?.description || '',
      });
      setExistingImages(row?.images || []);
    }
  }, [id, row]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    const newErrors = validateForm(formData, selectedFiles);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const clientId = localStorage.getItem("saas_client_clientId");
    const data = new FormData();
    data.append('clientId', clientId);
    data.append('title', formData.title);
    data.append('description', formData.description.trim());
    data.append('type', "About")

    if (selectedFiles.length === 3) {
      selectedFiles.forEach((file) => {
        data.append('file', file);
      });
    }

    try {
      let response;
      if (id) {
        data.append('aboutId', id);
        response = await statementService.createAbout(data);
        toast.success("About Us updated successfully.");
      } else {
        response = await statementService.createAbout(data);
        toast.success("About Us created successfully.");
      }
      setFormData({
        title: '',
        description: '',
      });
      setSelectedFiles([]);
      setErrors({});
      setAttemptedSubmit(false);
      navigate("/about-us-list");
    } catch (error) {
      console.error('Submission Error:', error?.response?.data?.message);
      toast.error(error?.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="">
      <div className={`mx-auto shadow-md rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              disabled={name === "view"}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <ReactQuill
              value={formData.description}
              readOnly={name === "view"}
              onChange={handleDescriptionChange}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'bold',
                'italic',
                'underline',
                'strike',
                'blockquote',
                'list',
                'bullet',
                'link',
                'image',
              ]}
              theme="snow"
              className={isDark ? 'dark-quill' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Images</label>
            {name === "view" ? (
              <div className="flex space-x-4">
                {existingImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            ) : (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
              />
            )}
            {name !== "view" && selectedFiles.length > 0 && (
              <div className="flex space-x-4 mt-4">
                {selectedFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
            {id && name !== "view" && selectedFiles.length === 0 && existingImages.length > 0 && (
              <div className="flex space-x-4 mt-4">
                {existingImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Existing ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          </div>

          {name === "view" ? null : (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn inline-flex justify-center"
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateAboutUs;