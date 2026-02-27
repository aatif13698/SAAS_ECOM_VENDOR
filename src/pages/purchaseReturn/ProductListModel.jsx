

// // new
// import supplierService from '@/services/supplier/supplier.service';
// import React, {
//     Fragment,
//     useCallback,
//     useEffect,
//     useRef,
//     useState,
// } from 'react';
// import toast from 'react-hot-toast';
// import { Dialog, Transition } from '@headlessui/react';
// import useDarkmode from '@/hooks/useDarkMode';
// import Icon from '@/components/ui/Icon';
// import Button from '../../components/ui/Button';
// import { useSelector } from 'react-redux';
// import stockService from '@/services/stock/stock.service';
// import categoryService from '@/services/category/category.service';
// import subcategoryService from '@/services/subCategory/subcategory.service';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setItemsList } from '@/store/slices/purchaseReturn/purchaseReturnSclice';

// /* --------------------------------------------------------------
//    Main Component
//    -------------------------------------------------------------- */
// function ProductListModel({
//     selectedInv,
//     items,
//     isInterState,
//     setItem,
//     noFade,
//     openModal3,
//     setOpenModal3,
//     supplier,
//     getShippingAddress,
//     currentSupplierId,
// }) {


//     const dispatch = useDispatch();

//     const { user: currentUser, isAuth: isAuthenticated } = useSelector(
//         (state) => state.auth
//     );
//     const [isDark] = useDarkmode();
//     const navigate = useNavigate();

//     /* ---------------------- pagination & filters ---------------------- */
//     const [pending, setPending] = useState(false);
//     const [totalRows, setTotalRows] = useState(0);
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const [paginationData, setPaginationData] = useState([]);
//     const [keyWord, setKeyWord] = useState('');
//     const [searchInput, setSearchInput] = useState('');



//     const [categories, setCategories] = useState([]);
//     const [subCategories, setSubCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [selectedSubCategory, setSelectedSubCategory] = useState('');

//     /* ---------------------- selected variants (qty only) ---------------------- */
//     const [selectedVariants, setSelectedVariants] = useState({}); // { variantId: {variant, stock, qty} }

//     console.log("selectedVariants", selectedVariants);
//     console.log("paginatedData", paginationData);


//     useEffect(() => {
//         if (selectedInv) {
//             getInvLinkedItems()
//         }
//     }, [selectedInv]);





//     /* ---------------------- debounce search ---------------------- */
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setKeyWord(searchInput.trim());
//             setPage(1);
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [searchInput]);

//     /* ---------------------- reset page on filter change ---------------------- */
//     useEffect(() => {
//         setPage(1);
//     }, [keyWord, selectedCategory, selectedSubCategory, perPage]);

//     /* ---------------------- load categories ---------------------- */


//     /* ---------------------- load sub-categories ---------------------- */
//     useEffect(() => {
//         if (!selectedCategory) {
//             setSubCategories([]);
//             setSelectedSubCategory('');
//             return;
//         }
//         (async () => {
//             try {
//                 const res = await subcategoryService.getAllSubCategoryByCategory(selectedCategory);
//                 setSubCategories(res?.data ?? []);
//             } catch {
//                 toast.error('Failed to load sub-categories');
//             }
//         })();
//     }, [selectedCategory]);

//     /* ---------------------- fetch stock (paginated) ---------------------- */
//     const fetchStockData = useCallback(
//         async (
//             page,
//             perPage,
//             keyWord,
//             level,
//             levelId,
//             categoryFilter,
//             subCategoryFilter,
//             supplier
//         ) => {
//             try {
//                 setPending(true);
//                 const res = await stockService.getStockListOfSupplier(
//                     page,
//                     keyWord,
//                     perPage,
//                     level,
//                     levelId,
//                     categoryFilter || null,
//                     subCategoryFilter || null,
//                     supplier || null
//                 );
//                 // setTotalRows(res?.data?.count || 0);
//                 // setPaginationData(res?.data?.stocks || []);
//             } catch (e) {
//                 console.error(e);
//                 toast.error('Failed to fetch stock data');
//             } finally {
//                 setPending(false);
//             }
//         },
//         []
//     );


//     async function getInvLinkedItems(params) {
//         try {
//             const res = await stockService.getStockListOfSupplierByPurchaseId(
//                 supplier || null,
//                 selectedInv._id
//             );
//             setTotalRows(res?.data?.count || 0);
//             setPaginationData(res?.data?.stocks || []);
//         } catch (error) {
//             console.log("error", error);
//         }
//     }

    

//     useEffect(() => {
//         if (!isAuthenticated || !currentUser) return;

//         let level = 'vendor';
//         let levelId = '';
//         if (currentUser.isVendorLevel) level = 'vendor';
//         else if (currentUser.isBuLevel) {
//             level = 'business';
//             levelId = currentUser.businessUnit;
//         } else if (currentUser.isBranchLevel) {
//             level = 'branch';
//             levelId = currentUser.branch;
//         } else if (currentUser.isWarehouseLevel) {
//             level = 'warehouse';
//             levelId = currentUser.warehouse;
//         }

//         if (supplier) {
//             fetchStockData(
//                 page,
//                 perPage,
//                 keyWord,
//                 level,
//                 levelId,
//                 selectedCategory,
//                 selectedSubCategory,
//                 supplier
//             );
//         } else {
//             setTotalRows(0);
//             setPaginationData([]);
//         }


//     }, [
//         isAuthenticated,
//         currentUser,
//         page,
//         perPage,
//         keyWord,
//         selectedCategory,
//         selectedSubCategory,
//         supplier,
//         fetchStockData,
//     ]);

//     /* ---------------------- toggle selection (checkbox) ---------------------- */
//     const toggleSelect = (variant, stock) => {
//         const id = variant._id;
//         setSelectedVariants((prev) => {
//             if (prev[id]) {
//                 // uncheck → remove
//                 const { [id]: _, ...rest } = prev;
//                 console.log("rest", rest);

//                 return rest;
//             }
//             // check → add with qty = 1
//             return {
//                 ...prev,
//                 [id]: { variant, stock, qty: 1 },
//             };
//         });
//     };
//     /* ---------------------- SAVE ---------------------- */
//     const handleSave = () => {
//         const selected = Object.values(selectedVariants).filter((v) => v.qty > 0);

//         const itemsArray = selected?.map((stock, index) => {
//             const quantity = stock?.qty;
//             const mrp = stock?.mrp || 0;
//             const discount = stock?.discount || 0;
//             const taxableAmount = mrp * quantity - discount;
//             const gstPercent = stock?.gstPercent || 0;
//             const cgstPercent = stock?.cgstPercent || 0;
//             const sgstPercent = stock?.sgstPercent || 0;
//             const igstPercent = stock?.igstPercent || 0;
//             const cgst = taxableAmount * (cgstPercent / 100) || 0;
//             const sgst = taxableAmount * (sgstPercent / 100) || 0;
//             const igst = taxableAmount * (igstPercent / 100) || 0;
//             let tax = 0
//             if (isInterState) {
//                 tax = (cgst + sgst) || 0;
//             } else {
//                 tax = igst || 0;
//             }
//             const totalAmount = (taxableAmount + tax) || 0;
//             return {
//                 srNo: index + 1,
//                 itemName: {
//                     name: stock?.variant?.name,
//                     productStock: stock?.stock?._id,
//                     productMainStock: stock?.variant?._id,
//                 },
//                 quantity: stock?.qty,
//                 mrp: mrp || 0,
//                 discount: discount || 0,
//                 taxableAmount: taxableAmount || 0,
//                 gstPercent: gstPercent || 0,
//                 cgstPercent: cgstPercent || 0,
//                 sgstPercent: sgstPercent || 0,
//                 igstPercent: igstPercent || 0,
//                 cgst: cgst || 0,
//                 sgst: sgst || 0,
//                 igst: igst || 0,
//                 tax: tax || 0,
//                 totalAmount: totalAmount || 0
//             }
//         });

//         setItem((prev) => {
//             return [
//                 ...itemsArray
//             ]
//         });

//         toast.success(`Selected ${selected.length} variant(s)`);
//         setOpenModal3(false);
//     };

//     const totalPages = Math.ceil(totalRows / perPage);


    

//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await subcategoryService.getAllActiveCategory();
//                 setCategories(res?.data ?? []);
//             } catch {
//                 toast.error('Failed to load categories');
//             }
//         })();
//     }, []);

//     let count = 0;


//     useEffect(() => {
//         if (paginationData?.length > 0) {
//             paginationData.map((stock) => {
//                 stock?.normalSaleStock?.map((variant) => {
//                     count += 1
//                 })
//             });
//         }
//     }, [paginationData])






//     useEffect(() => {
//         if (paginationData?.length > 0 && selectedInv) {

//             let countt = 0;

//             paginationData.map((stock) => {
//                 stock?.normalSaleStock?.map((variant) => {
//                     toggleSelect(variant, stock);
//                     countt = countt + 1;
//                     // setItemsCounts((prev) => prev + 1)
//                 })
//             });

//             console.log("count", count);
//             console.log("countt", countt);
//             console.log("selectedVariants", selectedVariants);

//             console.log("Object.keys(selectedVariants)?.length", Object.keys(selectedVariants)?.length);

//             // if (countt == count) {

//             //     setTimeout(() => {
//             //         handleSave()

//             //     }, 2000);

//             // }
//         }

//     }, [paginationData, selectedInv]);
    

//     /* --------------------------------------------------------------
//        Render
//        -------------------------------------------------------------- */
//     return (
//         <div>
//             <Transition appear show={openModal3} as={Fragment}>
//                 <Dialog as="div" className="relative z-[9999]" onClose={() => { }}>
//                     <Transition.Child
//                         as={Fragment}
//                         enter={noFade ? '' : 'duration-300 ease-out'}
//                         enterFrom={noFade ? '' : 'opacity-0'}
//                         enterTo={noFade ? '' : 'opacity-100'}
//                         leave={noFade ? '' : 'duration-200 ease-in'}
//                         leaveFrom={noFade ? '' : 'opacity-100'}
//                         leaveTo={noFade ? '' : 'opacity-0'}
//                     >
//                         <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
//                     </Transition.Child>

//                     <div className="fixed inset-0">
//                         <div className="flex min-h-full justify-center text-center p-6 items-center">
//                             <Transition.Child
//                                 as={Fragment}
//                                 enter={noFade ? '' : 'duration-300 ease-out'}
//                                 enterFrom={noFade ? '' : 'opacity-0 scale-95'}
//                                 enterTo={noFade ? '' : 'opacity-100 scale-100'}
//                                 leave={noFade ? '' : 'duration-200 ease-in'}
//                                 leaveFrom={noFade ? '' : 'opacity-100 scale-100'}
//                                 leaveTo={noFade ? '' : 'opacity-0 scale-95'}
//                             >
//                                 <Dialog.Panel
//                                     className={`w-full relative transform rounded-md text-left align-middle shadow-xl transition-all max-w-5xl ${isDark ? 'bg-darkSecondary text-white' : 'bg-light'
//                                         }`}
//                                 >
//                                     {/* ----- Header ----- */}
//                                     <div
//                                         className={`relative overflow-hidden py-4 px-5 flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary`}
//                                     >
//                                         <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
//                                             Product List{' '}
//                                             {Object.keys(selectedVariants).length > 0 &&
//                                                 `(${Object.keys(selectedVariants).length} selected)`}
//                                         </h2>
//                                         <button
//                                             onClick={() => setOpenModal3(false)}
//                                             className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]"
//                                         >
//                                             <Icon icon="heroicons-outline:x" />
//                                         </button>
//                                     </div>

//                                     {/* ----- Body ----- */}
//                                     <div className="overflow-y-auto max-h-[80vh]">
//                                         {pending ? (
//                                             <div className="flex justify-center items-center h-32">
//                                                 <Icon
//                                                     icon="heroicons:arrow-path"
//                                                     className="animate-spin text-4xl"
//                                                 />
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 {/* ----- Product groups (tables) ----- */}
//                                                 <div className="space-y-8 p-4">
//                                                     {paginationData?.length > 0 ? paginationData.map((stock) => (
//                                                         <div
//                                                             key={stock._id}
//                                                             className={`border rounded-lg p-5 ${isDark
//                                                                 ? 'border-darkSecondary bg-darkInput/50'
//                                                                 : 'border-gray-200 bg-gray-50'
//                                                                 }`}
//                                                         >
//                                                             <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
//                                                                 {stock.product.name}
//                                                                 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                                                                     ({stock.product.categoryId.name})
//                                                                 </span>
//                                                             </h3>

//                                                             {/* RESPONSIVE TABLE */}
//                                                             <div className="overflow-x-auto">
//                                                                 <table className="min-w-full divide-y divide-gray-200 dark:divide-darkSecondary">
//                                                                     <thead className={isDark ? 'bg-darkSecondary' : 'bg-gray-100'}>
//                                                                         <tr className="text-left text-sm font-medium">
//                                                                             <th className="px-4 py-2">Select</th>
//                                                                             <th className="px-4 py-2">Item</th>
//                                                                             {/* <th className="px-4 py-2 text-center">Quantity</th> */}
//                                                                         </tr>
//                                                                     </thead>

//                                                                     <tbody className="divide-y divide-gray-200 dark:divide-darkSecondary">
//                                                                         {stock.normalSaleStock.map((variant) => {
//                                                                             const id = variant._id;
//                                                                             const sel = selectedVariants[id];
//                                                                             const qty = sel ? sel.qty : 0;
//                                                                             const isSelected = !!sel;

//                                                                             return (
//                                                                                 <tr
//                                                                                     key={id}
//                                                                                     className={`${isSelected
//                                                                                         ? 'bg-blue-50 dark:bg-blue-900/20'
//                                                                                         : ''
//                                                                                         }`}
//                                                                                 >
//                                                                                     {/* SELECT */}
//                                                                                     <td className="px-4 py-2">
//                                                                                         <input
//                                                                                             type="checkbox"
//                                                                                             checked={isSelected}
//                                                                                             onChange={() => toggleSelect(variant, stock)}
//                                                                                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                                                                         />
//                                                                                     </td>

//                                                                                     {/* ITEM */}
//                                                                                     <td className="px-4 py-2">
//                                                                                         <div className="flex items-center">
//                                                                                             <img
//                                                                                                 src={
//                                                                                                     variant.defaultImage ||
//                                                                                                     variant.images?.[0] ||
//                                                                                                     ''
//                                                                                                 }
//                                                                                                 alt={variant.name}
//                                                                                                 className="w-12 h-12 object-cover rounded mr-3"
//                                                                                                 loading="lazy"
//                                                                                             />
//                                                                                             <div className="flex-1 min-w-0">
//                                                                                                 <p className="font-medium truncate">
//                                                                                                     {variant.name}
//                                                                                                 </p>
//                                                                                                 {variant.description && (
//                                                                                                     <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
//                                                                                                         {variant.description}
//                                                                                                     </p>
//                                                                                                 )}
//                                                                                                 <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
//                                                                                                     {Object.entries(variant.varianValue || {}).map(
//                                                                                                         ([k, v]) => (
//                                                                                                             <span key={k}>
//                                                                                                                 {k}: {v}
//                                                                                                             </span>
//                                                                                                         )
//                                                                                                     )}
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             );
//                                                                         })}
//                                                                     </tbody>
//                                                                 </table>
//                                                             </div>
//                                                         </div>
//                                                     )) : <>

//                                                         {
//                                                             supplier ? paginationData?.length == 0 ?
//                                                                 <div className="flex flex-col items-center justify-center h-20 ">
//                                                                     <p className='text-center text-gray-500'>No items found for invoice.</p>

//                                                                 </div> : "" :
//                                                                 <div className="">
//                                                                     <p className='text-center text-gray-500'> No supplier selected yet.</p>

//                                                                 </div>

//                                                         }
//                                                     </>


//                                                     }
//                                                 </div>

//                                                 {/* ----- Pagination ----- */}
//                                                 {totalPages > 1 && (
//                                                     <div
//                                                         className={`flex justify-between items-center mt-6 pt-4 border-t sticky bottom-0 bg-white dark:bg-darkInput ${isDark ? 'border-darkSecondary' : 'border-gray-200'
//                                                             }`}
//                                                     >
//                                                         <button
//                                                             onClick={() => setPage((p) => Math.max(1, p - 1))}
//                                                             disabled={page === 1 || pending}
//                                                             className={`px-4 py-2 rounded-md border transition-colors ${page === 1 || pending
//                                                                 ? 'opacity-50 cursor-not-allowed'
//                                                                 : 'hover:bg-gray-100 dark:hover:bg-darkSecondary'
//                                                                 } ${isDark ? 'border-darkSecondary' : 'border-gray-300'
//                                                                 }`}
//                                                         >
//                                                             Previous
//                                                         </button>
//                                                         <span className="text-sm">
//                                                             Page <strong>{page}</strong> of{' '}
//                                                             <strong>{totalPages}</strong> ({totalRows} total)
//                                                         </span>
//                                                         <button
//                                                             onClick={() => setPage((p) => p + 1)}
//                                                             disabled={page >= totalPages || pending}
//                                                             className={`px-4 py-2 rounded-md border transition-colors ${page >= totalPages || pending
//                                                                 ? 'opacity-50 cursor-not-allowed'
//                                                                 : 'hover:bg-gray-100 dark:hover:bg-darkSecondary'
//                                                                 } ${isDark ? 'border-darkSecondary' : 'border-gray-300'
//                                                                 }`}
//                                                         >
//                                                             Next
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </>
//                                         )}
//                                     </div>

//                                     {/* ----- Footer ----- */}
//                                     <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
//                                         <Button
//                                             text="Cancel"
//                                             className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
//                                             onClick={() => setOpenModal3(false)}
//                                         />
//                                         <Button
//                                             text="Save Selected"
//                                             className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded ${Object.keys(selectedVariants).length === 0
//                                                 ? 'opacity-50 cursor-not-allowed'
//                                                 : ''
//                                                 }`}
//                                             onClick={handleSave}
//                                             disabled={Object.keys(selectedVariants).length === 0}
//                                         />

//                                         {
//                                             supplier && paginationData?.length > 0 &&
//                                             <Button
//                                                 onClick={() => navigate(`/create-supplier/link/items`, { state: { supplierId: supplier } })}
//                                                 text="Link more items"
//                                                 className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded `}
//                                             />
//                                         }

//                                     </div>
//                                 </Dialog.Panel>
//                             </Transition.Child>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition>
//         </div>
//     );
// }

// export default ProductListModel;



import supplierService from '@/services/supplier/supplier.service';
import React, {
    Fragment,
    useCallback,
    useEffect,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import useDarkmode from '@/hooks/useDarkMode';
import Icon from '@/components/ui/Icon';
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import stockService from '@/services/stock/stock.service';
import categoryService from '@/services/category/category.service';
import subcategoryService from '@/services/subCategory/subcategory.service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setItemsList } from '@/store/slices/purchaseReturn/purchaseReturnSclice';

/* --------------------------------------------------------------
   Main Component
   -------------------------------------------------------------- */
function ProductListModel({
    selectedInv,
    items,
    isInterState,
    setItem,
    noFade,
    openModal3,
    setOpenModal3,
    supplier,
    getShippingAddress,
    currentSupplierId,
}) {

    const dispatch = useDispatch();

    const { user: currentUser, isAuth: isAuthenticated } = useSelector(
        (state) => state.auth
    );
    const [isDark] = useDarkmode();
    const navigate = useNavigate();

    /* ---------------------- pagination & filters ---------------------- */
    const [pending, setPending] = useState(false);
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

    /* ---------------------- selected variants (qty only) ---------------------- */
    const [selectedVariants, setSelectedVariants] = useState({}); // { variantId: {variant, stock, qty} }

    useEffect(() => {
        if (selectedInv) {
            getInvLinkedItems();
        }
    }, [selectedInv]);

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

    /* ---------------------- load sub-categories ---------------------- */
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

    /* ---------------------- fetch stock (paginated) ---------------------- */
    const fetchStockData = useCallback(
        async (
            page,
            perPage,
            keyWord,
            level,
            levelId,
            categoryFilter,
            subCategoryFilter,
            supplier
        ) => {
            try {
                setPending(true);
                const res = await stockService.getStockListOfSupplier(
                    page,
                    keyWord,
                    perPage,
                    level,
                    levelId,
                    categoryFilter || null,
                    subCategoryFilter || null,
                    supplier || null
                );
                setTotalRows(res?.data?.count || 0);
                setPaginationData(res?.data?.stocks || []);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch stock data');
            } finally {
                setPending(false);
            }
        },
        []
    );

    async function getInvLinkedItems() {
        try {
            const res = await stockService.getStockListOfSupplierByPurchaseId(
                supplier || null,
                selectedInv._id
            );
            setTotalRows(res?.data?.count || 0);
            setPaginationData(res?.data?.stocks || []);
        } catch (error) {
            console.log("error", error);
        }
    }

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

        if (selectedInv) {
            // Do nothing here; linked items are fetched separately
        } else if (supplier) {
            fetchStockData(
                page,
                perPage,
                keyWord,
                level,
                levelId,
                selectedCategory,
                selectedSubCategory,
                supplier
            );
        } else {
            setTotalRows(0);
            setPaginationData([]);
        }
    }, [
        isAuthenticated,
        currentUser,
        page,
        perPage,
        keyWord,
        selectedCategory,
        selectedSubCategory,
        supplier,
        selectedInv,
        fetchStockData,
    ]);

    /* ---------------------- toggle selection (checkbox) ---------------------- */
    const toggleSelect = (variant, stock) => {
        const id = variant._id;
        setSelectedVariants((prev) => {
            if (prev[id]) {
                // uncheck → remove
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            // check → add with qty = 1
            return {
                ...prev,
                [id]: { variant, stock, qty: 1 },
            };
        });
    };

    /* ---------------------- Auto-select and save for linked items ---------------------- */
    useEffect(() => {
        if (paginationData?.length > 0 && selectedInv) {
            const newSelected = {};
            paginationData.forEach((stockItem) => {
                stockItem.normalSaleStock.forEach((variant) => {
                    const id = variant._id;
                    newSelected[id] = { variant, stock: stockItem, qty: 1 };
                });
            });

            setSelectedVariants(newSelected);
            saveSelected(newSelected);
        }
    }, [paginationData, selectedInv]);

    /* ---------------------- Extracted save logic ---------------------- */
    const saveSelected = (selVariants) => {
        const selected = Object.values(selVariants).filter((v) => v.qty > 0);

        const itemsArray = selected?.map((entry, index) => {
            const quantity = entry.qty;
            const mrp = entry.variant?.mrp || 0;
            const discount = entry.variant?.discount || 0;
            const taxableAmount = mrp * quantity - discount;
            const gstPercent = entry.variant?.gstPercent || 0;
            const cgstPercent = entry.variant?.cgstPercent || 0;
            const sgstPercent = entry.variant?.sgstPercent || 0;
            const igstPercent = entry.variant?.igstPercent || 0;
            const cgst = taxableAmount * (cgstPercent / 100) || 0;
            const sgst = taxableAmount * (sgstPercent / 100) || 0;
            const igst = taxableAmount * (igstPercent / 100) || 0;
            let tax = 0;
            if (isInterState) {
                tax = igst || 0;
            } else {
                tax = (cgst + sgst) || 0;
            }
            const totalAmount = (taxableAmount + tax) || 0;
            return {
                srNo: index + 1,
                itemName: {
                    name: entry.variant?.name,
                    productStock: entry.stock?._id,
                    productMainStock: entry.variant?._id,
                },
                quantity: entry.qty,
                mrp: mrp || 0,
                discount: discount || 0,
                taxableAmount: taxableAmount || 0,
                gstPercent: gstPercent || 0,
                cgstPercent: cgstPercent || 0,
                sgstPercent: sgstPercent || 0,
                igstPercent: igstPercent || 0,
                cgst: cgst || 0,
                sgst: sgst || 0,
                igst: igst || 0,
                tax: tax || 0,
                totalAmount: totalAmount || 0
            }
        });

        setItem(itemsArray);

        // toast.success(`Selected ${selected.length} variant(s)`);
        setOpenModal3(false);
    };

    /* ---------------------- SAVE ---------------------- */
    const handleSave = () => {
        saveSelected(selectedVariants);
    };

    const totalPages = Math.ceil(totalRows / perPage);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const res = await categoryService.getAllActiveCategory();
    //             setCategories(res?.data ?? []);
    //         } catch {
    //             toast.error('Failed to load categories');
    //         }
    //     })();
    // }, []);

    /* --------------------------------------------------------------
       Render
       -------------------------------------------------------------- */
    return (
        <div>
            <Transition appear show={openModal3} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => { }}>
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
                                    className={`w-full relative transform rounded-md text-left align-middle shadow-xl transition-all max-w-5xl ${isDark ? 'bg-darkSecondary text-white' : 'bg-light'
                                        }`}
                                >
                                    {/* ----- Header ----- */}
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary`}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Product List{' '}
                                            {Object.keys(selectedVariants).length > 0 &&
                                                `(${Object.keys(selectedVariants).length} selected)`}
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
                                        ) : (
                                            <>
                                                {/* ----- Product groups (tables) ----- */}
                                                <div className="space-y-8 p-4">
                                                    {paginationData?.length > 0 ? paginationData.map((stock) => (
                                                        <div
                                                            key={stock._id}
                                                            className={`border rounded-lg p-5 ${isDark
                                                                ? 'border-darkSecondary bg-darkInput/50'
                                                                : 'border-gray-200 bg-gray-50'
                                                                }`}
                                                        >
                                                            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
                                                                {stock.product.name}
                                                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                    ({stock.product.categoryId.name})
                                                                </span>
                                                            </h3>

                                                            {/* RESPONSIVE TABLE */}
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-darkSecondary">
                                                                    <thead className={isDark ? 'bg-darkSecondary' : 'bg-gray-100'}>
                                                                        <tr className="text-left text-sm font-medium">
                                                                            <th className="px-4 py-2">Select</th>
                                                                            <th className="px-4 py-2">Item</th>
                                                                            {/* <th className="px-4 py-2 text-center">Quantity</th> */}
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody className="divide-y divide-gray-200 dark:divide-darkSecondary">
                                                                        {stock.normalSaleStock.map((variant) => {
                                                                            const id = variant._id;
                                                                            const sel = selectedVariants[id];
                                                                            const qty = sel ? sel.qty : 0;
                                                                            const isSelected = !!sel;

                                                                            return (
                                                                                <tr
                                                                                    key={id}
                                                                                    className={`${isSelected
                                                                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                                                                        : ''
                                                                                        }`}
                                                                                >
                                                                                    {/* SELECT */}
                                                                                    <td className="px-4 py-2">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={isSelected}
                                                                                            onChange={() => toggleSelect(variant, stock)}
                                                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                                        />
                                                                                    </td>

                                                                                    {/* ITEM */}
                                                                                    <td className="px-4 py-2">
                                                                                        <div className="flex items-center">
                                                                                            <img
                                                                                                src={
                                                                                                    variant.defaultImage ||
                                                                                                    variant.images?.[0] ||
                                                                                                    ''
                                                                                                }
                                                                                                alt={variant.name}
                                                                                                className="w-12 h-12 object-cover rounded mr-3"
                                                                                                loading="lazy"
                                                                                            />
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="font-medium truncate">
                                                                                                    {variant.name}
                                                                                                </p>
                                                                                                {variant.description && (
                                                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                                                                        {variant.description}
                                                                                                    </p>
                                                                                                )}
                                                                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
                                                                                                    {Object.entries(variant.varianValue || {}).map(
                                                                                                        ([k, v]) => (
                                                                                                            <span key={k}>
                                                                                                                {k}: {v}
                                                                                                            </span>
                                                                                                        )
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )) : <>

                                                        {
                                                            supplier ? paginationData?.length == 0 ?
                                                                <div className="flex flex-col items-center justify-center h-20 ">
                                                                    <p className='text-center text-gray-500'>No items found for invoice.</p>

                                                                </div> : "" :
                                                                <div className="">
                                                                    <p className='text-center text-gray-500'> No supplier selected yet.</p>

                                                                </div>

                                                        }
                                                    </>


                                                    }
                                                </div>

                                                {/* ----- Pagination ----- */}
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
                                                                } ${isDark ? 'border-darkSecondary' : 'border-gray-300'
                                                                }`}
                                                        >
                                                            Previous
                                                        </button>
                                                        <span className="text-sm">
                                                            Page <strong>{page}</strong> of{' '}
                                                            <strong>{totalPages}</strong> ({totalRows} total)
                                                        </span>
                                                        <button
                                                            onClick={() => setPage((p) => p + 1)}
                                                            disabled={page >= totalPages || pending}
                                                            className={`px-4 py-2 rounded-md border transition-colors ${page >= totalPages || pending
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : 'hover:bg-gray-100 dark:hover:bg-darkSecondary'
                                                                } ${isDark ? 'border-darkSecondary' : 'border-gray-300'
                                                                }`}
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
                                            text="Save Selected"
                                            className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded ${Object.keys(selectedVariants).length === 0
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                                }`}
                                            onClick={handleSave}
                                            disabled={Object.keys(selectedVariants).length === 0}
                                        />

                                        {
                                            supplier && paginationData?.length > 0 &&
                                            <Button
                                                onClick={() => navigate(`/create-supplier/link/items`, { state: { supplierId: supplier } })}
                                                text="Link more items"
                                                className={`bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-4 py-2 rounded `}
                                            />
                                        }

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

