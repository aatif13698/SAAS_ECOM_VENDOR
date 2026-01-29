import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import ProductListModel from './ProductListModel';
import statementService from '@/services/statement/statement.service';

function CreateBanner({ noFade }) {
    const [isDark] = useDarkmode();

    const [formData, setFormData] = useState({
        product: null,
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

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
        if (!formData.image) {
            toast.error('Please select a banner image.');
            return;
        }
        try {
            const clientId = localStorage.getItem('saas_client_clientId');
            const formDataToSend = new FormData();
            formDataToSend.append('clientId', clientId);
            formDataToSend.append('product', formData.product._id);
            formDataToSend.append('image', formData.image);

            const res = await statementService.createBanner(formDataToSend);
            console.log('res', res);
            toast.success('Banner created successfully.');
            // Optionally reset formData here
        } catch (error) {
            console.error('error while creating', error);
            toast.error('Failed to create banner.');
        }
    };

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">Create Banner</h4>
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
                    {formData.image && (
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Image:</h5>
                            <p className="text-gray-600 mb-2">{formData.image.name}</p>
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
                <div className='flex justify-end'>
                    <button
                        type="submit"
                        className="bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover mt-2 text-white dark:hover:text-black-900 px-4 py-2 rounded"
                    >
                        Create Banner
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

export default CreateBanner;