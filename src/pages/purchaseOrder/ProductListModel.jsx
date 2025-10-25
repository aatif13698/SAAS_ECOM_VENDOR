import supplierService from '@/services/supplier/supplier.service';
import React, { Fragment, useCallback, useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Dialog, Transition } from "@headlessui/react";
import useDarkmode from '@/hooks/useDarkMode';
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import stockService from '@/services/stock/stock.service';
import categoryService from '@/services/category/category.service'; // Assume this exists for categories/subcategories

function ProductListModel({ noFade, openModal3, setOpenModal3, getShippingAddress, currentSupplierId }) {
    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [isDark] = useDarkmode();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationData, setPaginationData] = useState([]);
    const [keyWord, setKeyWord] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const [selectedVariants, setSelectedVariants] = useState({}); // { variant._id: { ...variant, product, stockId } }

    // Debounce search input to avoid excessive API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyWord(searchInput.trim());
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [keyWord, selectedCategory, selectedSubCategory]);

    // Fetch all categories (independent of stock pagination)
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoryService.getCategories(); // Assume returns { data: [{ _id, name }] }
                setCategories(response?.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load categories");
            }
        };
        loadCategories();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (!selectedCategory) {
            setSubCategories([]);
            setSelectedSubCategory("");
            return;
        }
        const loadSubCategories = async  ()  => {
            try {
                const response = await categoryService.getSubCategories(selectedCategory); // Assume returns { data: [{ _id, name }] }
                setSubCategories(response?.data || []);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                toast.error("Failed to load subcategories");
            }
        };
        // loadSubCategories();
    }, [selectedCategory]);

    const fetchStockData = useCallback(async (page, perPage, keyWord, level, levelId, categoryFilter, subCategoryFilter) => {
        try {
            setPending(true);
            const response = await stockService.getStockList(
                page,
                keyWord,
                perPage,
                level,
                levelId,
                categoryFilter || null, // Assume API supports optional categoryId
                subCategoryFilter || null // Assume API supports optional subCategoryId
            );
            setTotalRows(response?.data?.count || 0);
            setPaginationData(response?.data?.stocks || []);
        } catch (error) {
            console.error("Error fetching stocks:", error);
            toast.error("Failed to fetch stock data");
        } finally {
            setPending(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !currentUser) return;

        let currentLevel = "vendor";
        let levelId = "";
        if (currentUser.isVendorLevel) {
            currentLevel = "vendor";
        } else if (currentUser.isBuLevel) {
            currentLevel = "business";
            levelId = currentUser.businessUnit;
        } else if (currentUser.isBranchLevel) {
            currentLevel = "branch";
            levelId = currentUser.branch;
        } else if (currentUser.isWarehouseLevel) {
            currentLevel = "warehouse";
            levelId = currentUser.warehouse;
        }

        fetchStockData(page, perPage, keyWord, currentLevel, levelId, selectedCategory, selectedSubCategory);
    }, [isAuthenticated, currentUser, page, perPage, keyWord, selectedCategory, selectedSubCategory, fetchStockData]);

    const handleVariantToggle = (variant, stock) => {
        setSelectedVariants((prev) => {
            const key = variant._id;
            if (prev[key]) {
                const { [key]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [key]: {
                    ...variant,
                    product: stock.product,
                    stockId: stock._id
                }
            };
        });
    };

    const handleSave = () => {
        const selected = Object.values(selectedVariants);
        // TODO: Pass `selected` to parent via prop (e.g., onProductSelect(selected)) or Redux/context
        // For now, log and toast
        console.log("Selected variants:", selected);
        toast.success(`Selected ${selected.length} variant(s)`);
        setOpenModal3(false);
        // Optional: Reset selection after save
        // setSelectedVariants({});
    };

    const totalPages = Math.ceil(totalRows / perPage);

    return (
        <div>
            <Transition appear show={openModal3} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? "" : "duration-300 ease-out"}
                        enterFrom={noFade ? "" : "opacity-0"}
                        enterTo={noFade ? "" : "opacity-100"}
                        leave={noFade ? "" : "duration-200 ease-in"}
                        leaveFrom={noFade ? "" : "opacity-100"}
                        leaveTo={noFade ? "" : "opacity-0"}
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0">
                        <div className="flex min-h-full justify-center text-center p-6 items-center">
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? "" : "duration-300 ease-out"}
                                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                enterTo={noFade ? "" : "opacity-100 scale-100"}
                                leave={noFade ? "" : "duration-200 ease-in"}
                                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                leaveTo={noFade ? "" : "opacity-0 scale-95"}
                            >
                                <Dialog.Panel
                                    className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-5xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                >
                                    <div className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary`}>
                                        <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Product List {Object.keys(selectedVariants).length > 0 && `(${Object.keys(selectedVariants).length} selected)`}
                                        </h2>
                                        <button onClick={() => setOpenModal3(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                                        {pending ? (
                                            <div className="flex justify-center items-center h-32">
                                                <Icon icon="heroicons:arrow-path" className="animate-spin text-4xl" />
                                            </div>
                                        ) : paginationData.length === 0 ? (
                                            <p className="text-center text-gray-500">No products found matching your filters.</p>
                                        ) : (
                                            <>
                                                {/* Filters */}
                                                <div className="flex flex-wrap gap-3 mb-6 items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Search by name..."
                                                        value={searchInput}
                                                        onChange={(e) => setSearchInput(e.target.value)}
                                                        className={`flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-darkInput border-darkSecondary text-white" : "bg-white border-gray-300"}`}
                                                    />
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => {
                                                            setSelectedCategory(e.target.value);
                                                            setSelectedSubCategory("");
                                                        }}
                                                        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-darkInput border-darkSecondary text-white" : "bg-white border-gray-300"}`}
                                                    >
                                                        <option value="">All Categories</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat._id} value={(cat._id)}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={selectedSubCategory}
                                                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                                                        disabled={!selectedCategory}
                                                        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-darkInput border-darkSecondary text-white disabled:opacity-50" : "bg-white border-gray-300 disabled:opacity-50"}`}
                                                    >
                                                        <option value="">All Subcategories</option>
                                                        {subCategories.map((sub) => (
                                                            <option key={sub._id} value={sub._id}>
                                                                {sub.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={perPage}
                                                        onChange={(e) => {
                                                            setPerPage(Number(e.target.value));
                                                            setPage(1);
                                                        }}
                                                        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-darkInput border-darkSecondary text-white" : "bg-white border-gray-300"}`}
                                                    >
                                                        {[10, 25, 50, 100].map((size) => (
                                                            <option key={size} value={size}>{size} / page</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Product Groups */}
                                                <div className="space-y-8">
                                                    {paginationData.map((stock) => (
                                                        <div key={stock._id} className={`border rounded-lg p-5 ${isDark ? "border-darkSecondary bg-darkInput/50" : "border-gray-200 bg-gray-50"}`}>
                                                            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
                                                                {stock.product.name}
                                                                <span className="text-sm font-normal text-gray-500">
                                                                    ({stock.product.categoryId.name})
                                                                </span>
                                                            </h3>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {stock.normalSaleStock.map((variant) => (
                                                                    <div
                                                                        key={variant._id}
                                                                        className={`border rounded-lg p-3 flex flex-col items-center text-center transition-all hover:shadow-md ${isDark ? "border-darkSecondary bg-darkInput" : "border-gray-200 bg-white"} ${selectedVariants[variant._id] ? "ring-2 ring-blue-500" : ""}`}
                                                                    >
                                                                        {variant.images?.[0] ? (
                                                                            <img
                                                                                src={variant.images[0]}
                                                                                alt={variant.name}
                                                                                className="w-full h-40 object-cover rounded-md mb-3"
                                                                            />
                                                                        ) : (
                                                                            <div className={`w-full h-40 rounded-md mb-3 flex items-center justify-center text-sm ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                                                                                No Image
                                                                            </div>
                                                                        )}
                                                                        <p className="font-medium mb-1">{variant.name}</p>
                                                                        <div className="text-xs mb-3 space-y-0.5">
                                                                            {Object.entries(variant.varianValue || {}).map(([k, v]) => (
                                                                                <p key={k}>
                                                                                    <span className="font-medium">{k}:</span> {v}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                        <label className="flex items-center cursor-pointer mt-auto">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={!!selectedVariants[variant._id]}
                                                                                onChange={() => handleVariantToggle(variant, stock)}
                                                                                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                                            />
                                                                            <span className="text-sm">Select</span>
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Pagination Controls */}
                                                {totalPages > 1 && (
                                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-darkSecondary">
                                                        <button
                                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                            disabled={page === 1 || pending}
                                                            className={`px-4 py-2 rounded-md border transition-colors ${page === 1 || pending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-darkSecondary"} ${isDark ? "border-darkSecondary" : "border-gray-300"}`}
                                                        >
                                                            Previous
                                                        </button>
                                                        <span className="text-sm">
                                                            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalRows} total)
                                                        </span>
                                                        <button
                                                            onClick={() => setPage((p) => p + 1)}
                                                            disabled={page >= totalPages || pending}
                                                            className={`px-4 py-2 rounded-md border transition-colors ${page >= totalPages || pending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-darkSecondary"} ${isDark ? "border-darkSecondary" : "border-gray-300"}`}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                                        <Button
                                            text="Cancel"
                                            className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                                            onClick={() => setOpenModal3(false)}
                                        />
                                        <Button
                                            text="Save"
                                            className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded ${Object.keys(selectedVariants).length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={handleSave}
                                            disabled={Object.keys(selectedVariants).length === 0}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default ProductListModel;