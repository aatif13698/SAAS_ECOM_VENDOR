import React, { Fragment, useState } from 'react';
import SectionCards from './SectionCards'; // Adjust the import path based on your file structure
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import ProductListModel from './ProductListModel';
import statementService from '@/services/statement/statement.service';

function CreateSection({ noFade }) {
    const [isDark] = useDarkmode();

    const [formData, setFormData] = useState({
        template: '',
        title: '',
        products: [],
    });


    console.log("formData", formData);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

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
            const mapedProducts = formData?.products?.map((p) => {
                return {
                    id: p?._id
                }
            });
            const clientId = localStorage.getItem("saas_client_clientId");
            const dataObject = {
                clientId: clientId,
                template: formData?.template,
                type: "card",
                title: formData?.title,
                products: mapedProducts,
            };
            console.log("dataObject", dataObject);
            const res = await statementService.createSection(dataObject);
            console.log("res", res);
        } catch (error) {
            console.log("error while creating", error);
        }

    };

    return (
        <div className="p-6 w-full bg-white rounded-lg shadow-md">
            <h4 className="text-2xl font-bold mb-6">Create Section</h4>
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
                                    <li key={product._id} className="text-gray-600">
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className='flex justify-end'>
                    <button
                        type="submit"
                        className="bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover mt-2 text-white dark:hover:text-black-900 px-4 py-2 rounded"
                    >
                        Create Section
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
                                    {/* ----- Header ----- */}
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

                                    {/* ----- Body ----- */}
                                    <div className="overflow-y-auto max-h-[80vh] px-2">
                                        <SectionCards onSelect={handleSelectTemplate} template={formData?.template} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ProductListModel
                items={formData?.products}
                setItem={setFormData}
                openModal3={isProductsModalOpen}
                setOpenModal3={setIsProductsModalOpen}
                noFade={noFade}
            />
        </div>
    );
}

export default CreateSection;