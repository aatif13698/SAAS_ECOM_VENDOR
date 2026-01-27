import React, { Fragment, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import ProductListModel from './ProductListModel';
import statementService from '@/services/statement/statement.service';
import FormLoader from '@/Common/formLoader/FormLoader'; // Assuming a reusable loading spinner component exists; otherwise, implement one

// EditBanner Component
function EditBanner({ noFade }) {
    const { id } = useParams(); // Get banner ID from URL params
    const navigate = useNavigate(); // For navigation after update or cancel
    const [isDark] = useDarkmode();

    const [formData, setFormData] = useState({
        product: null,
        image: null,
        imageUrl: '',
    });

    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await statementService.bannerById(id); // Assuming bannerById method exists in the service
                if (res?.data) {
                    setFormData({
                        product: res?.data?.product ? { _id: res.data.product._id, name: res.data.product.name } : null,
                        image: null,
                        imageUrl: res?.data?.image || '',
                    });
                    setPreview(res?.data?.image || null);
                } else {
                    setError('Banner not found.');
                }
            } catch (err) {
                console.error('Error fetching banner:', err);
                setError('Failed to load banner data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanner();
    }, [id]);

    useEffect(() => {
        return () => {
            if (preview && !formData.imageUrl) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview, formData.imageUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must not exceed 5 MB.');
                return;
            }
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.product) {
            toast.error('Please select a product.');
            return;
        }
        try {
            const clientId = localStorage.getItem('saas_client_clientId');
            const formDataToSend = new FormData();
            formDataToSend.append('clientId', clientId);
            formDataToSend.append('id', id);
            formDataToSend.append('product', formData.product._id);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const res = await statementService.updateBanner(formDataToSend); // Assuming updateBanner method exists in the service
            toast.success('Banner updated successfully.');
            navigate('/banners/list'); // Navigate back to list or dashboard after success; adjust as needed
        } catch (error) {
            console.error('Error while updating:', error);
            setError('Failed to update banner. Please try again.');
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
            <h4 className="text-2xl font-bold mb-6">Edit Banner</h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                    </label> */}
                    <button
                        type="button"
                        onClick={() => setIsProductsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Choose Product
                    </button>
                    {formData.product && (
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Product:</h5>
                            <p className="text-gray-600">{formData.product.name}</p>
                        </div>
                    )}
                </div>
                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banner Image
                    </label> */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Choose Banner Image
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {(formData.image || formData.imageUrl) && (
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Image:</h5>
                            {formData.image && <p className="text-gray-600 mb-2">{formData.image.name}</p>}
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Banner Preview"
                                    className="max-w-xs h-auto rounded-md"
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Update Banner
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

            <ProductListModel
                item={formData?.product}
                setItem={setFormData}
                openModal3={isProductsModalOpen}
                setOpenModal3={setIsProductsModalOpen}
                noFade={noFade}
            />
        </div>
    );
}

// ViewBanner Component
function ViewBanner() {
    const { id } = useParams(); // Get banner ID from URL params
    const navigate = useNavigate(); // For navigation back
    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await statementService.bannerById(id); // Assuming bannerById method exists
                if (res?.data) {
                    setBanner(res?.data);
                } else {
                    setError('Banner not found.');
                }
            } catch (err) {
                console.error('Error fetching banner:', err);
                setError('Failed to load banner data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanner();
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

    if (!banner) {
        return null; // Fallback, though error should handle this
    }

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">View Banner</h4>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <p className="text-gray-900">{banner.product?.name || 'No product selected.'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                    {banner.image ? (
                        <img
                            src={banner.image}
                            alt="Banner Image"
                            className="max-w-xs h-auto rounded-md"
                        />
                    ) : (
                        <p className="text-gray-600">No image available.</p>
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

export { EditBanner, ViewBanner };