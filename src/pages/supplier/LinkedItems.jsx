
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    memo,
    Fragment,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import stockService from '@/services/stock/stock.service';
import subcategoryService from '@/services/subCategory/subcategory.service';
import supplierService from '@/services/supplier/supplier.service';
import FormLoader from '@/Common/formLoader/FormLoader';


function LinkedItems({
    noFade,
    currentSupplierId,
}) {
    const { user: currentUser, isAuth: isAuthenticated } = useSelector(
        (s) => s.auth
    );
    const [isDark] = useDarkmode();
    const navigate = useNavigate();
    const location = useLocation();

    const supplierId = location?.state?.supplierId ?? currentSupplierId;
    const clientId = localStorage.getItem('saas_client_clientId');

    /* --------------------------------------------------------------
       Pagination & Filters
       -------------------------------------------------------------- */
    const [pending, setPending] = useState(false);
    const [loadinItem, setLoadingItem] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationData, setPaginationData] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [supplierDetails, setSupplierDetails] = useState(null);

    console.log("supplierDetails", supplierDetails);


    /* --------------------------------------------------------------
       Supplier linked items (full objects)
       -------------------------------------------------------------- */
    const [linkedItems, setLinkedItems] = useState([]);

    /* --------------------------------------------------------------
       Load supplier items
       -------------------------------------------------------------- */
    const loadSupplierItems = useCallback(async () => {
        if (!supplierId) return;
        try {
            const res = await supplierService.getOne(supplierId);
            setLinkedItems(res?.data?.items ?? []);
        } catch {
            toast.error('Failed to load supplier items');
        }
    }, [supplierId]);

    useEffect(() => {
        loadSupplierItems();
    }, [loadSupplierItems]);

    /* --------------------------------------------------------------
       Debounce search
       -------------------------------------------------------------- */
    useEffect(() => {
        const t = setTimeout(() => {
            setKeyword(searchInput.trim());
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => setPage(1), [keyword, selectedCategory, selectedSubCategory, perPage]);

    /* --------------------------------------------------------------
       Load categories / sub-categories
       -------------------------------------------------------------- */
    useEffect(() => {
        (async () => {
            try {
                const res = await subcategoryService.getAllActiveCategory();
                setCategories(res?.data ?? []);
            } catch {
                toast.error('Failed to load categories');
            }
        })();
    }, []);

    useEffect(() => {
        if (!selectedCategory) {
            setSubCategories([]);
            setSelectedSubCategory('');
            return;
        }
        (async () => {
            try {
                const res = await subcategoryService.getAllSubCategoryByCategory(selectedCategory);
                setSubCategories(res?.data ?? []);
            } catch {
                toast.error('Failed to load sub-categories');
            }
        })();
    }, [selectedCategory]);

    /* --------------------------------------------------------------
       Fetch stock list
       -------------------------------------------------------------- */
    const fetchStock = useCallback(async () => {
        if (!isAuthenticated || !currentUser) return;
        setLoadingItem(true);
        try {
            const level = currentUser.isVendorLevel
                ? 'vendor'
                : currentUser.isBuLevel
                    ? 'business'
                    : currentUser.isBranchLevel
                        ? 'branch'
                        : 'warehouse';
            const levelId =
                currentUser.isBuLevel
                    ? currentUser.businessUnit
                    : currentUser.isBranchLevel
                        ? currentUser.branch
                        : currentUser.isWarehouseLevel
                            ? currentUser.warehouse
                            : '';

            const res = await stockService.getStockList(
                page,
                keyword,
                perPage,
                level,
                levelId,
                selectedCategory || null,
                selectedSubCategory || null
            );
            setTotalRows(res?.data?.count ?? 0);
            setPaginationData(res?.data?.stocks ?? []);
        } catch {
            toast.error('Failed to fetch stock');
        } finally {
            setLoadingItem(false);
        }
    }, [
        isAuthenticated,
        currentUser,
        page,
        perPage,
        keyword,
        selectedCategory,
        selectedSubCategory,
    ]);

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    /* --------------------------------------------------------------
       Helper – is variant linked?
       -------------------------------------------------------------- */
    const isLinked = useCallback(
        (stockId, variantId) =>
            linkedItems.some(
                (i) =>
                    i.productStock._id === stockId && i.productMainStock._id === variantId
            ),
        [linkedItems]
    );

    /* --------------------------------------------------------------
       Add / Remove (optimistic)
       -------------------------------------------------------------- */
    const toggleLink = async (variant, stock) => {
        const payload = {
            clientId,
            supplierId,
            productStock: stock._id,
            productMainStock: variant._id,
        };
        const alreadyLinked = isLinked(stock._id, variant._id);

        // Optimistic UI
        if (alreadyLinked) {
            setLinkedItems((prev) =>
                prev.filter(
                    (i) =>
                        !(i.productStock._id === stock._id && i.productMainStock._id === variant._id)
                )
            );
        } else {
            setLinkedItems((prev) => [
                ...prev,
                {
                    productStock: { _id: stock._id, product: stock.product },
                    productMainStock: { _id: variant._id, ...variant },
                },
            ]);
        }

        try {
            if (alreadyLinked) {
                await stockService.removeItem(payload);
                toast.success('Item removed from supplier');
            } else {
                await stockService.addItem(payload);
                toast.success('Item linked to supplier');
            }
        } catch (err) {
            // Rollback
            setLinkedItems((prev) =>
                alreadyLinked
                    ? [
                        ...prev,
                        {
                            productStock: { _id: stock._id, product: stock.product },
                            productMainStock: { _id: variant._id, ...variant },
                        },
                    ]
                    : prev.filter(
                        (i) =>
                            !(i.productStock._id === stock._id && i.productMainStock._id === variant._id)
                    )
            );
            toast.error(err?.response?.data?.message ?? 'Operation failed');
        }
    };

    /* --------------------------------------------------------------
       Modal – View Linked Items
       -------------------------------------------------------------- */
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const removeFromModal = async (item) => {
        const payload = {
            clientId,
            supplierId,
            productStock: item.productStock._id,
            productMainStock: item.productMainStock._id,
        };
        setLinkedItems((prev) =>
            prev.filter(
                (i) =>
                    !(i.productStock._id === payload.productStock && i.productMainStock._id === payload.productMainStock)
            )
        );
        try {
            await stockService.removeItem(payload);
            toast.success('Item removed');
        } catch {
            toast.error('Failed to remove');
            loadSupplierItems();
        }
    };

    useEffect(() => {
        getSupplierDetails(supplierId)
    }, [supplierId]);

    async function getSupplierDetails(supplierId) {
        try {
            setPending(true);
            const respons = await supplierService.getOne(supplierId);
            setSupplierDetails(respons?.data)
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error while getting supplier details", error);
        }
    }



    const totalPages = Math.ceil(totalRows / perPage);

    /* --------------------------------------------------------------
       Render
       -------------------------------------------------------------- */
    return (
        <div className="relative">
            {/* Loading */}
            {pending ? (
                <div className="flex justify-center items-center h-32">
                    <Icon icon="heroicons:arrow-path" className="animate-spin text-4xl" />
                </div>
            ) : (
                <>
                    {/* ==== FILTER BAR ==== */}
                    <div className="sticky top-14 z-10 bg-white dark:bg-darkInput p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className='mb-2 flex items-center gap-2 bg-gray-300 dark:bg-gray-900 rounded-xl p-1 shadow-md'>
                                    <p className='text-base font-semibold'>{supplierDetails?.name}, </p>
                                    <p className='text-sm'>{supplierDetails?.contactNumber}</p>
                                </div>

                                <h3 className="text-lg font-semibold">
                                    Linked Items ({linkedItems.length})
                                </h3>
                            </div>

                            <Button
                                onClick={openModal}
                                className="bg-lightBtn dark:bg-darkBtn text-white px-4 py-2 rounded-md"
                            >
                                View Linked Items
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className={`flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-darkInput border-darkSecondary text-white'
                                    : 'bg-white border-gray-300'
                                    }`}
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedSubCategory('');
                                }}
                                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-darkInput border-darkSecondary text-white'
                                    : 'bg-white border-gray-300'
                                    }`}
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
                                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${isDark
                                    ? 'bg-darkInput border-darkSecondary text-white'
                                    : 'bg-white border-gray-300'
                                    }`}
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
                                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-darkInput border-darkSecondary text-white'
                                    : 'bg-white border-gray-300'
                                    }`}
                            >
                                {[10, 25, 50, 100].map((v) => (
                                    <option key={v} value={v}>
                                        {v} / page
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ==== STOCK LIST ==== */}

                    {
                        loadinItem ?
                            <div className='flex justify-center h-[20vh] items-center'>
                                <FormLoader />
                            </div>
                            :
                            <div className="space-y-8 p-4">
                                {paginationData.length === 0 ? (
                                    <p className="text-center text-gray-500">
                                        No products found matching your filters.
                                    </p>
                                ) : (
                                    paginationData.map((stock) => (
                                        <ProductCard
                                            key={stock._id}
                                            stock={stock}
                                            isLinked={isLinked}
                                            toggleLink={toggleLink}
                                            isDark={isDark}
                                        />
                                    ))
                                )}
                            </div>
                    }


                    {/* ==== PAGINATION ==== */}
                    {totalPages > 1 && (
                        <div
                            className={`flex justify-between items-center mt-6 pt-4 border-t sticky bottom-0 bg-white dark:bg-darkInput ${isDark ? 'border-darkSecondary' : 'border-gray-200'
                                }`}
                        >
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || pending}
                                className={`px-4 py-2 rounded-md border transition-colors ${page === 1 || pending
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
                                className={`px-4 py-2 rounded-md border transition-colors ${page >= totalPages || pending
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


            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[99999]"
                    onClose={closeModal}
                >
                    {(
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
                    )}
                    <div className="fixed inset-0 overflow-y-auto">
                        <div
                            className={`flex min-h-full justify-center text-center p-6 items-center "
                                                      }`}
                        >
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? "" : "duration-300  ease-out"}
                                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                enterTo={noFade ? "" : "opacity-100 scale-100"}
                                leave={noFade ? "" : "duration-200 ease-in"}
                                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                leaveTo={noFade ? "" : "opacity-0 scale-95"}
                            >
                                <Dialog.Panel
                                    className={`w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-darkInput p-6 text-left align-middle shadow-xl transition-all ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    <Dialog.Title className="text-xl font-semibold mb-4">
                                        Linked Items ({linkedItems.length})
                                    </Dialog.Title>

                                    <div className="max-h-[70vh] overflow-y-auto space-y-6">
                                        {linkedItems.length === 0 ? (
                                            <p className="text-center text-gray-500">
                                                No items linked yet.
                                            </p>
                                        ) : (
                                            linkedItems.reverse().map((item, idx) => (
                                                <LinkedItemCard
                                                    key={`${item.productStock._id}-${item.productMainStock._id}-${idx}`}
                                                    item={item}
                                                    onRemove={() => removeFromModal(item)}
                                                    isDark={isDark}
                                                />
                                            ))
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            onClick={closeModal}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Close
                                        </Button>
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

/* --------------------------------------------------------------
   Reusable product card (used in main list)
   -------------------------------------------------------------- */
const ProductCard = memo(({ stock, isLinked, toggleLink, isDark }) => {
    return (
        <div
            className={`border rounded-lg p-5 ${isDark ? 'border-darkSecondary bg-darkInput/50' : 'border-gray-200 bg-gray-50'
                }`}
        >
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
                {stock.product.name}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({stock.product.categoryId?.name ?? ''})
                </span>
            </h3>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-darkSecondary">
                    <thead className={isDark ? 'bg-darkSecondary' : 'bg-gray-100'}>
                        <tr className="text-left text-sm font-medium">
                            <th className="px-4 py-2">Select</th>
                            <th className="px-4 py-2">Item</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-darkSecondary">
                        {stock.normalSaleStock.map((variant) => {
                            const checked = isLinked(stock._id, variant._id);
                            return (
                                <tr
                                    key={variant._id}
                                    className={checked ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                                >
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleLink(variant, stock)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <VariantRow variant={variant} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

/* --------------------------------------------------------------
   Reusable variant row (image + name + desc + attributes)
   -------------------------------------------------------------- */
const VariantRow = memo(({ variant }) => (
    <div className="flex items-center">
        <img
            src={variant.defaultImage || variant.images?.[0] || ''}
            alt={variant.name}
            className="w-12 h-12 object-cover rounded mr-3"
            loading="lazy"
        />
        <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{variant.name}</p>
            {variant.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {variant.description}
                </p>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
                {Object.entries(variant.varianValue ?? {}).map(([k, v]) => (
                    <span key={k}>
                        {k}: {v}
                    </span>
                ))}
            </div>
        </div>
    </div>
));

/* --------------------------------------------------------------
   Card for linked items in modal (no checkbox)
   -------------------------------------------------------------- */
const LinkedItemCard = memo(({ item, onRemove, isDark }) => {
    const { productStock, productMainStock } = item;
    return (
        <div
            className={`border rounded-lg p-5 flex justify-between items-start gap-4 ${isDark ? 'border-darkSecondary bg-darkInput/50' : 'border-gray-200 bg-gray-50'
                }`}
        >
            <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
                    {productStock.product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {productStock.product.categoryId?.name}
                </p>

                <div className="mt-3">
                    <VariantRow variant={productMainStock} />
                </div>
            </div>

            <button
                onClick={onRemove}
                className="text-red-600 hover:text-red-800"
                aria-label="Remove linked item"
            >
                <Icon icon="heroicons:trash" className="w-5 h-5" />
            </button>
        </div>
    );
});

export default LinkedItems;