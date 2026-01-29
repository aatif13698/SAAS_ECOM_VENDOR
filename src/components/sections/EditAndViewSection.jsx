import React, { Fragment, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import SectionCards from './SectionCards'; // Adjust the import path based on your file structure
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import ProductListModel from './ProductListModel';
import statementService from '@/services/statement/statement.service';
import FormLoader from '@/Common/formLoader/FormLoader'; // Assuming a reusable loading spinner component exists; otherwise, implement one

// EditSection Component
function EditSection({ noFade }) {
    const { id } = useParams(); // Get section ID from URL params
    const navigate = useNavigate(); // For navigation after update or cancel
    const [isDark] = useDarkmode();

    const [formData, setFormData] = useState({
        template: '',
        title: '',
        products: [],
    });


    console.log("formData", formData);



    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSection = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await statementService.sectionById(id); // Assuming getSectionById method exists in the service
                if (res?.data) {
                    const mapedProducts = res?.data?.products?.map((p) => {
                        return {
                            name: p?.id?.name,
                            _id: p?.id?._id
                        }
                    })
                    setFormData({
                        template: res?.data?.template || '',
                        title: res?.data?.title || '',
                        products: mapedProducts || [], // Assuming products are returned as array of objects
                    });
                } else {
                    setError('Section not found.');
                }
            } catch (err) {
                console.error('Error fetching section:', err);
                setError('Failed to load section data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSection();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectTemplate = (type) => {
        setFormData((prevData) => ({
            ...prevData,
            template: type,
        }));
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mappedProducts = formData.products.map((p) => ({
                id: p._id,
            }));
            const clientId = localStorage.getItem('saas_client_clientId');
            const dataObject = {
                clientId,
                id,
                template: formData.template,
                type: 'card', // Assuming type is fixed as in create
                title: formData.title,
                products: mappedProducts,
            };
            const res = await statementService.updateSection(dataObject); // Assuming updateSection method exists in the service
            console.log('Update response:', res);
            navigate('/landing-sections-list'); // Navigate back to list or dashboard after success; adjust as needed
        } catch (error) {
            console.error('Error while updating:', error);
            setError('Failed to update section. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navigate back; adjust as needed
    };

    if (isLoading) {
        return <div className='min-h-[80vh] flex justify-center items-center'><FormLoader /></div> ; // Display loading spinner
    }

    if (error) {
        return
    }

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">Edit Section</h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template
                    </label>
                    <p className="text-gray-600 mb-2">
                        {formData.template || 'None selected'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Choose Card Type
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Products
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsProductsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Choose Products
                    </button>
                    {formData.products.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Products:</h5>
                            <ul className="list-disc pl-5">
                                {formData.products.map((product) => (
                                    <li key={product?._id} className="text-gray-600">
                                        {product?.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Update Section
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? '' : 'duration-300 ease-out'}
                        enterFrom={noFade ? '' : 'opacity-0'}
                        enterTo={noFade ? '' : 'opacity-100'}
                        leave={noFade ? '' : 'duration-200 ease-in'}
                        leaveFrom={noFade ? '' : 'opacity-100'}
                        leaveTo={noFade ? '' : 'opacity-0'}
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0">
                        <div className="flex min-h-full justify-center text-center p-6 items-center">
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? '' : 'duration-300 ease-out'}
                                enterFrom={noFade ? '' : 'opacity-0 scale-95'}
                                enterTo={noFade ? '' : 'opacity-100 scale-100'}
                                leave={noFade ? '' : 'duration-200 ease-in'}
                                leaveFrom={noFade ? '' : 'opacity-100 scale-100'}
                                leaveTo={noFade ? '' : 'opacity-0 scale-95'}
                            >
                                <Dialog.Panel
                                    className={`w-full relative transform rounded-md text-left align-middle shadow-xl transition-all max-w-7xl ${isDark ? 'bg-darkSecondary text-white' : 'bg-light'}`}
                                >
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary`}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Style List
                                        </h2>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]"
                                        >
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>
                                    <div className="overflow-y-auto max-h-[80vh] px-2">
                                        <SectionCards onSelect={handleSelectTemplate} template={formData.template} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ProductListModel
                items={formData.products}
                setItem={setFormData}
                openModal3={isProductsModalOpen}
                setOpenModal3={setIsProductsModalOpen}
                noFade={noFade}
            />
        </div>
    );
}

// ViewSection Component
function ViewSection() {
    const { id } = useParams(); // Get section ID from URL params
    const navigate = useNavigate(); // For navigation back
    const [section, setSection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSection = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await statementService.sectionById(id); // Assuming getSectionById method exists

                console.log("Res ss", res);

                if (res?.data) {
                    setSection(res?.data);
                } else {
                    setError('Section not found.');
                }
            } catch (err) {
                console.error('Error fetching section:', err);
                setError('Failed to load section data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSection();
    }, [id]);

    const handleBack = () => {
        navigate('/'); // Navigate back to list or dashboard; adjust as needed
    };

    if (isLoading) {
        return <FormLoader />;
    }

    if (error) {
        return;
    }

    if (!section) {
        return null; // Fallback, though error should handle this
    }

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">View Section</h4>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{section.title}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                    <p className="text-gray-900">{section.template}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
                    {section.products && section.products.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {section.products.map((product) => (
                                <li key={product?.id?._id} className="text-gray-600">
                                    {product?.id?.name} {/* Assuming product has 'name'; adjust based on actual structure */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No products selected.</p>
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

export { EditSection, ViewSection };