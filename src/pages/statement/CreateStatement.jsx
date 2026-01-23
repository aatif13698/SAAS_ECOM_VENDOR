import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useDarkmode from '@/hooks/useDarkMode';
import statementService from '@/services/statement/statement.service';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

function CreateStatement() {
  const [isDark] = useDarkmode();
  const navigate = useNavigate()


  const location = useLocation();
  const row = location?.state?.row;
  const name = location?.state?.name;
  const id = location?.state?.id;

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.type || !['Privacy', 'Refund', 'Terms'].includes(data.type)) {
      newErrors.type = 'Type is required';
    }

    if (!data.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const trimmedDesc = data.description.trim();
    if (!trimmedDesc || trimmedDesc === '<p><br></p>') {
      newErrors.description = 'Description is required';
    }

    return newErrors;
  };

  useEffect(() => {
    if (attemptedSubmit) {
      const newErrors = validateForm(formData);
      setErrors(newErrors);
    }
  }, [formData, attemptedSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const clientId = localStorage.getItem("saas_client_clientId");
    const data = {
      clientId: clientId,
      type: formData.type,
      title: formData.title,
      description: formData.description.trim(),
    };

    try {
      let response;
      if (id) {
        response = await statementService.update({ ...data, statementId: id });
        toast.success("Statement updated successfully.");
      } else {
        response = await statementService.create(data);
        toast.success("Statement created successfully.");
      }
      setFormData({
        type: '',
        title: '',
        description: '',
      });
      setErrors({});
      setAttemptedSubmit(false);
      navigate("/statement-list")
    } catch (error) {
      console.error('Submission Error:', error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };


  useEffect(() => {
    if (id) {
      const baseAddress = location?.state?.row;
      setFormData((prev) => ({
        ...prev,
        type: baseAddress?.type,
        title: baseAddress?.title,
        description: baseAddress?.description,
      }));
      // setPageLoading(false)
    }
  }, [id]);

  return (
    <div className="">
      <div className={` mx-auto shadow-md rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="type" className="block text-sm font-medium mb-2">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={id}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            >
              <option value="">Select Type</option>
              <option value="Privacy">Privacy</option>
              <option value="Refund">Refund</option>
              <option value="Terms">Terms</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

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
              readOnly={name === "view"} // Make read-only in view mode
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
              className={isDark ? 'dark-quill' : ''} // Assuming you might need a custom dark theme for Quill
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          {
            name === "view" ? "" :
              <div className='flex justify-end'>
                <button
                  type="submit"
                  className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                >
                  {
                    id ? "Update" : "Submit"
                  }

                </button>
              </div>
          }
        </form>
      </div>
    </div>
  );
}

export default CreateStatement;