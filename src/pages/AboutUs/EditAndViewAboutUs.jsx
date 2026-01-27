import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import FormLoader from '@/Common/formLoader/FormLoader'; // Assuming a reusable loading spinner component exists; otherwise, implement one
import statementService from '@/services/statement/statement.service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// EditAboutUs Component
function EditAboutUs() {
    const { id } = useParams(); // Get about us ID from URL params
    const navigate = useNavigate(); // For navigation after update or cancel
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [], // Array for new images to upload
        existingImages: [], // Array for existing image URLs
        isActive: true,
    });
    console.log("formData", formData);

    const [previews, setPreviews] = useState([]); // For new image previews
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchAboutUs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await statementService.aboutById(id); // Assuming aboutById method exists in the service
                if (res?.data) {
                    setFormData({
                        title: res.data.title || '',
                        description: res.data.description || '',
                        images: [],
                        existingImages: res.data.images || [],
                        isActive: res.data.isActive ?? true,
                    });
                } else {
                    setError('About Us not found.');
                }
            } catch (err) {
                console.error('Error fetching About Us:', err);
                setError('Failed to load About Us data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutUs();
    }, [id]);

    useEffect(() => {
        // Clean up previews on unmount
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [previews]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const validFiles = files.filter((file) => {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`Image ${file.name} exceeds 5 MB limit.`);
                    return false;
                }
                return true;
            });
            setFormData((prev) => ({ ...prev, images: [...validFiles] }));
            const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...newPreviews]);
        }
    };

    // const handleFileChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     setSelectedFiles(files);
    // };

    const removeExistingImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index),
        }));
    };

    const removeNewImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        URL.revokeObjectURL(previews[index]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Please enter a title.');
            return;
        }
        if (formData.images?.length > 0 && formData.images.length !== 3) {
            toast.error('Please upload exactly three images if updating images');
             return;
        }
        try {
            const clientId = localStorage.getItem('saas_client_clientId');
            const formDataToSend = new FormData();
            formDataToSend.append('clientId', clientId);
            formDataToSend.append('id', id);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formData.images.forEach((img) => formDataToSend.append('file', img));

            const res = await statementService.updatedAbout(formDataToSend); // Assuming updatedAbout method exists in the service
            toast.success('About Us updated successfully.');
            navigate('/about-us/list'); // Navigate back to list or dashboard after success; adjust as needed
        } catch (error) {
            console.error('Error while updating:', error);
            toast.error(error?.response?.data?.message)
            // setError('Failed to update About Us. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navigate back; adjust as needed
    };

    if (isLoading) {
        return <div className='min-h-[80vh] flex justify-center items-center'><FormLoader /></div>; // Display loading spinner
    }

    if (error) {
        return <div className="text-red-500 p-6">{error}</div>;
    }

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">Edit About Us</h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (HTML)</label>
                    <ReactQuill
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                        formats={[
                            'header',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image'
                        ]}
                        className="border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Upload Images
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    {formData.existingImages.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Existing Images:</h5>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.existingImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Existing Image ${index + 1}`}
                                            className="w-full h-auto rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {formData.images.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">New Images:</h5>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={previews[index]}
                                            alt={`New Image ${index + 1}`}
                                            className="w-full h-auto rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Update About Us
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// ViewAboutUs Component
function ViewAboutUs() {
    const { id } = useParams(); // Get about us ID from URL params
    const navigate = useNavigate(); // For navigation back
    const [aboutUs, setAboutUs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutUs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await statementService.aboutById(id); // Assuming aboutById method exists
                if (res?.data) {
                    setAboutUs(res?.data);
                } else {
                    setError('About Us not found.');
                }
            } catch (err) {
                console.error('Error fetching About Us:', err);
                setError('Failed to load About Us data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutUs();
    }, [id]);

    const handleBack = () => {
        navigate('/'); // Navigate back to list or dashboard; adjust as needed
    };

    if (isLoading) {
        return <FormLoader />;
    }

    if (error) {
        return <div className="text-red-500 p-6">{error}</div>;
    }

    if (!aboutUs) {
        return null; // Fallback, though error should handle this
    }

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">View About Us</h4>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{aboutUs.title || 'No title available.'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div
                        className="prose max-w-none text-gray-900"
                        dangerouslySetInnerHTML={{ __html: aboutUs.description || '<p>No description available.</p>' }}
                    />
                </div>
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                    <p className="text-gray-900">{aboutUs.isActive ? 'Yes' : 'No'}</p>
                </div> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    {aboutUs.images && aboutUs.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {aboutUs.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`About Us Image ${index + 1}`}
                                    className="w-full h-auto rounded-md"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No images available.</p>
                    )}
                </div>
                {/* <button
                    type="button"
                    onClick={handleBack}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Back
                </button> */}
            </div>
        </div>
    );
}

export { EditAboutUs, ViewAboutUs };