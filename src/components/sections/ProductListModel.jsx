import React, { Fragment, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import stockService from '@/services/stock/stock.service';
import subcategoryService from '@/services/subCategory/subcategory.service';

function ProductListModel({ items, noFade, openModal3, setOpenModal3, setItem }) {
    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [isDark] = useDarkmode();

    /* ---------------------- pagination & filters ---------------------- */
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationData, setPaginationData] = useState([]);
    const [keyWord, setKeyWord] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    /* ---------------------- selected products ---------------------- */
    const [selectedProducts, setSelectedProducts] = useState([]);

    /* ---------------------- initialize selected from props ---------------------- */
    useEffect(() => {
        setSelectedProducts(items || []);
    }, [items]);

    /* ---------------------- debounce search ---------------------- */
    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyWord(searchInput.trim());
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    /* ---------------------- reset page on filter change ---------------------- */
    useEffect(() => {
        setPage(1);
    }, [keyWord, selectedCategory, selectedSubCategory, perPage]);

    /* ---------------------- load categories ---------------------- */
    useEffect(() => {
        const load = async () => {
            try {
                const res = await subcategoryService.getAllActiveCategory();
                setCategories(res?.data || []);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load categories');
            }
        };
        load();
    }, []);

    /* ---------------------- load sub-categories ---------------------- */
    useEffect(() => {
        if (!selectedCategory) {
            setSubCategories([]);
            setSelectedSubCategory('');
            return;
        }
        const load = async () => {
            try {
                const res = await subcategoryService.getAllSubCategoryByCategory(selectedCategory);
                setSubCategories(res?.data || []);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load sub-categories');
            }
        };
        load();
    }, [selectedCategory]);

    /* ---------------------- fetch stock (paginated) ---------------------- */
    const fetchStockData = useCallback(
        async (page, perPage, keyWord, level, levelId, categoryFilter, subCategoryFilter) => {
            try {
                setPending(true);
                const res = await stockService.getProductListForCms(
                    page,
                    keyWord,
                    perPage,
                    level,
                    levelId,
                    categoryFilter || null,
                    subCategoryFilter || null
                );

                setTotalRows(res?.data?.total || 0);
                setPaginationData(res?.data?.products || []);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch stock data');
            } finally {
                setPending(false);
            }
        },
        []
    );

    useEffect(() => {
        if (!isAuthenticated || !currentUser) return;

        let level = 'vendor';
        let levelId = '';
        if (currentUser.isVendorLevel) level = 'vendor';
        else if (currentUser.isBuLevel) {
            level = 'business';
            levelId = currentUser.businessUnit;
        } else if (currentUser.isBranchLevel) {
            level = 'branch';
            levelId = currentUser.branch;
        } else if (currentUser.isWarehouseLevel) {
            level = 'warehouse';
            levelId = currentUser.warehouse;
        }

        fetchStockData(
            page,
            perPage,
            keyWord,
            level,
            levelId,
            selectedCategory,
            selectedSubCategory
        );
    }, [
        isAuthenticated,
        currentUser,
        page,
        perPage,
        keyWord,
        selectedCategory,
        selectedSubCategory,
        fetchStockData,
    ]);

    /* ---------------------- toggle product selection ---------------------- */
    const toggleProductSelection = (product) => {
        setSelectedProducts((prev) => {
            const isAlreadySelected = prev.some((p) => p._id === product._id);
            if (isAlreadySelected) {
                return prev.filter((p) => p._id !== product._id);
            } else {
                return [...prev, product];
            }
        });
    };

    /* ---------------------- SAVE ---------------------- */
    const handleSave = () => {
        if (selectedProducts.length < 6) {
            toast.error('Please select at least 6 products.');
            return;
        }
        setItem((prevData) => ({
            ...prevData,
            products: selectedProducts,
        }));
        setOpenModal3(false);
    };

    const totalPages = Math.ceil(totalRows / perPage);

    /* --------------------------------------------------------------
       Render
       -------------------------------------------------------------- */
    return (
        <div>
            <Transition appear show={openModal3} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
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
                                    className={`w-full relative transform rounded-md text-left align-middle shadow-xl transition-all max-w-5xl ${isDark ? 'bg-darkSecondary text-white' : 'bg-light'}`}
                                >
                                    {/* ----- Header ----- */}
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary`}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Product List{' '}
                                            {selectedProducts.length > 0 &&
                                                `(${selectedProducts.length} selected)`}
                                        </h2>
                                        <button
                                            onClick={() => setOpenModal3(false)}
                                            className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]"
                                        >
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    {/* ----- Body ----- */}
                                    <div className="overflow-y-auto max-h-[80vh]">
                                        {pending ? (
                                            <div className="flex justify-center items-center h-32">
                                                <Icon
                                                    icon="heroicons:arrow-path"
                                                    className="animate-spin text-4xl"
                                                />
                                            </div>
                                        ) : paginationData.length === 0 ? (
                                            <p className="text-center text-gray-500">
                                                No products found matching your filters.
                                            </p>
                                        ) : (
                                            <>
                                                {/* ----- Filters (sticky) ----- */}
                                                <div className="p-4 sticky top-0 bg-white dark:bg-darkInput z-10 flex flex-wrap gap-3 mb-6 items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Search by name..."
                                                        value={searchInput}
                                                        onChange={(e) => setSearchInput(e.target.value)}
                                                        className={`flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-darkInput border-darkSecondary text-white' : 'bg-white border-gray-300'}`}
                                                    />
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => {
                                                            setSelectedCategory(e.target.value);
                                                            setSelectedSubCategory('');
                                                        }}
                                                        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-darkInput border-darkSecondary text-white' : 'bg-white border-gray-300'}`}
                                                    >
                                                        <option value="">All Categories</option>
                                                        {categories.map((c) => (
                                                            <option key={c._id} value={c._id}>
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={selectedSubCategory}
                                                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                                                        disabled={!selectedCategory}
                                                        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${isDark ? 'bg-darkInput border-darkSecondary text-white' : 'bg-white border-gray-300'}`}
                                                    >
                                                        <option value="">All Subcategories</option>
                                                        {subCategories.map((s) => (
                                                            <option key={s._id} value={s._id}>
                                                                {s.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={perPage}
                                                        onChange={(e) => setPerPage(Number(e.target.value))}
                                                        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-darkInput border-darkSecondary text-white' : 'bg-white border-gray-300'}`}
                                                    >
                                                        {[10, 25, 50, 100].map((v) => (
                                                            <option key={v} value={v}>
                                                                {v} / page
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* ----- Product groups ----- */}
                                                <div className="space-y-8 p-4">
                                                    {paginationData.map((product) => {
                                                        const isSelected = selectedProducts.some(
                                                            (p) => p._id === product._id
                                                        );
                                                        return (
                                                            <div
                                                                key={product._id}
                                                                className={`border rounded-lg p-5 transition-colors ${
                                                                    isSelected
                                                                        ? isDark
                                                                            ? 'bg-blue-900/50 border-blue-500'
                                                                            : 'bg-blue-100 border-blue-500'
                                                                        : isDark
                                                                        ? 'border-darkSecondary bg-darkInput/50'
                                                                        : 'border-gray-200 bg-gray-50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center mb-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={() =>
                                                                            toggleProductSelection({_id: product?._id, name: product?.name})
                                                                        }
                                                                        className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                    />
                                                                    <h3 className="text-lg font-semibold flex-1">
                                                                        {product?.name}
                                                                    </h3>
                                                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                        ({product?.categoryId.name})
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-start">
                                                                    <img
                                                                        src={product.images?.[0] || ''}
                                                                        alt={product.name}
                                                                        className="w-12 h-12 object-cover rounded mr-3"
                                                                        loading="lazy"
                                                                    />
                                                                    {product.description && (
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                            {product.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* ----- Pagination ----- */}
                                                {totalPages > 1 && (
                                                    <div
                                                        className={`flex justify-between items-center mt-6 pt-4 border-t sticky bottom-0 bg-white dark:bg-darkInput p-4 ${
                                                            isDark ? 'border-darkSecondary' : 'border-gray-200'
                                                        }`}
                                                    >
                                                        <button
                                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                            disabled={page === 1 || pending}
                                                            className={`px-4 py-2 rounded-md border transition-colors ${
                                                                page === 1 || pending
                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                    : 'hover:bg-gray-100 dark:hover:bg-darkSecondary'
                                                            } ${isDark ? 'border-darkSecondary' : 'border-gray-300'}`}
                                                        >
                                                            Previous
                                                        </button>
                                                        <span className="text-sm">
                                                            Page <strong>{page}</strong> of <strong>{totalPages}</strong> (
                                                            {totalRows} total)
                                                        </span>
                                                        <button
                                                            onClick={() => setPage((p) => p + 1)}
                                                            disabled={page >= totalPages || pending}
                                                            className={`px-4 py-2 rounded-md border transition-colors ${
                                                                page >= totalPages || pending
                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                    : 'hover:bg-gray-100 dark:hover:bg-darkSecondary'
                                                            } ${isDark ? 'border-darkSecondary' : 'border-gray-300'}`}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* ----- Footer ----- */}
                                    <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                                        <Button
                                            text="Cancel"
                                            className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                                            onClick={() => setOpenModal3(false)}
                                        />
                                        <Button
                                            text="Save"
                                            className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded ${
                                                selectedProducts.length < 6 ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={handleSave}
                                            disabled={selectedProducts.length < 6}
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