// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import ledgerGroupService from '@/services/ledgerGroup/ledgerGroup.service';
// import { FaRegEdit } from "react-icons/fa";
// import  } from "react-icons/fa6";

// // You can move these types to a separate file later
// const PaymentAndLedger = () => {
//     const [currentLevel, setCurrentLevel] = useState('');
//     const [levelId, setLevelId] = useState('');

//     const [availableCashLedgers, setAvailableCashLedgers] = useState([]);
//     const [availableBankLedgers, setAvailableBankLedgers] = useState([]);

//     const [cashMethods, setCashMethods] = useState([]);
//     const [bankMethods, setBankMethods] = useState([]);

//     console.log("cashMethods", cashMethods);
//     console.log("bankMethods", bankMethods);

//     const [loading, setLoading] = useState(false);

//     const { user: currentUser, isAuth } = useSelector((state) => state.auth);

//     // Determine level
//     useEffect(() => {
//         if (!currentUser || !isAuth) return;

//         if (currentUser.isVendorLevel) {
//             setCurrentLevel('vendor');
//         } else if (currentUser.isBuLevel) {
//             setCurrentLevel('business');
//             setLevelId(currentUser.businessUnit || '');
//         } else if (currentUser.isBranchLevel) {
//             setCurrentLevel('branch');
//             setLevelId(currentUser.branch || '');
//         } else if (currentUser.isWarehouseLevel) {
//             setCurrentLevel('warehouse');
//             setLevelId(currentUser.warehouse || '');
//         } else {
//             setCurrentLevel('vendor');
//         }
//     }, [currentUser, isAuth]);

//     // Load available ledgers
//     useEffect(() => {
//         if (!currentLevel) return;

//         const fetchLedgers = async () => {
//             setLoading(true);
//             try {
//                 const res = await ledgerGroupService.getCashAndBankGroupLedger(currentLevel, levelId);

//                 setAvailableCashLedgers(res?.data?.cashLedgers || []);
//                 setAvailableBankLedgers(res?.data?.bankLedgers || []);

//                 // If you have saved payment methods from backend → load them here
//                 // setCashMethods(transformSavedMethods(res.data.savedCash || []));
//                 // setBankMethods(transformSavedMethods(res.data.savedBank || []));
//             } catch (error) {
//                 console.error('Error loading ledgers:', error);
//                 // TODO: show notification/toast
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLedgers();
//     }, [currentLevel, levelId]);

//     const addNewCash = () => {
//         setCashMethods((prev) => [
//             ...prev,
//             { id: null, ledgerId: '', isEditing: true, isNew: true },
//         ]);
//     };

//     const addNewBank = () => {
//         setBankMethods((prev) => [
//             ...prev,
//             { id: null, ledgerId: '', isEditing: true, isNew: true },
//         ]);
//     };

//     const updateLedger = (type, index, ledgerId) => {
//         const ledgers = type === 'cash' ? availableCashLedgers : availableBankLedgers;
//         const selected = ledgers.find((l) => l.id === ledgerId);

//         const setter = type === 'cash' ? setCashMethods : setBankMethods;

//         setter((prev) => {
//             const updated = [...prev];
//             updated[index] = {
//                 ...updated[index],
//                 ledgerId,
//                 name: selected?.name || '',
//             };
//             return updated;
//         });
//     };

//     const toggleEdit = (type, index, shouldEdit = true) => {
//         const setter = type === 'cash' ? setCashMethods : setBankMethods;
//         setter((prev) => {
//             const updated = [...prev];
//             updated[index] = { ...updated[index], isEditing: shouldEdit };
//             return updated;
//         });
//     };

//     const saveMethod = (type, index) => {
//         const methods = type === 'cash' ? cashMethods : bankMethods;
//         const item = methods[index];

//         if (!item.ledgerId) return;

//         // TODO: Real API call here
//         // await api.savePaymentMethod({ level, levelId, type, ledgerId: item.ledgerId, id: item.id });

//         const setter = type === 'cash' ? setCashMethods : setBankMethods;

//         setter((prev) => {
//             const updated = [...prev];
//             updated[index] = {
//                 ...updated[index],
//                 id: item.id || `temp_${Date.now()}`, // temporary id
//                 isEditing: false,
//                 isNew: false,
//             };
//             return updated;
//         });
//     };

//     const deleteMethod = (type, index) => {
//         if (!window.confirm('Remove this payment method?')) return;

//         const setter = type === 'cash' ? setCashMethods : setBankMethods;
//         setter((prev) => prev.filter((_, i) => i !== index));

//         // TODO: If has real id → call delete API
//     };

//     const renderSection = (title, type, methods, available, addHandler) => {

//         console.log("available", available);

//         return (
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex justify-between items-center mb-5">
//                     <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//                     <button
//                         onClick={addHandler}
//                         className="px-4 py-2 bg-emerald-400 hover:bg-emerald-400 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
//                         type="button"
//                     >
//                         <span>+ Add {type === 'cash' ? 'Cash' : 'Bank'}</span>
//                     </button>
//                 </div>

//                 {methods.length === 0 && (
//                     <div className="text-center py-10 text-gray-500 italic">
//                         No {type === 'cash' ? 'cash' : 'bank'} payment methods configured yet
//                     </div>
//                 )}

//                 <div className="space-y-3">
//                     {methods.map((method, index) => {
//                         console.log("method", method);
                        
//                         return (
//                             <div
//                                 key={method.id || index}
//                                 className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
//                             >
//                                 <select
//                                     value={method.ledgerId}
//                                     onChange={(e) => updateLedger(type, index, e.target.value)}
//                                     disabled={!method.isEditing}
//                                     className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-embg-emerald-400 focus:border-embg-emerald-400 disabled:bg-gray-100 disabled:text-gray-600 transition-colors"
//                                 >
//                                     <option value="">Select {type === 'cash' ? 'Cash' : 'Bank'} Ledger</option>
//                                     {available.map((ledger) => (
//                                         <option key={ledger._id} value={ledger._id}>
//                                             {ledger.ledgerName}
//                                         </option>
//                                     ))}
//                                 </select>

//                                 <div className="flex items-center gap-2">
//                                     {method.isEditing ? (
//                                         <>
//                                             <button
//                                                 onClick={() => saveMethod(type, index)}
//                                                 disabled={!method.ledgerId}
//                                                 className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
//                                             >
//                                                 Save
//                                             </button>
//                                             {!method.isNew && (
//                                                 <button
//                                                     onClick={() => toggleEdit(type, index, false)}
//                                                     className="px-4 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors text-sm font-medium"
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <>
//                                             <button
//                                                 onClick={() => toggleEdit(type, index, true)}
//                                                 className="p-2 bg-indigo-600/80 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm font-medium"
//                                             >
//                                                 <FaRegEdit/>
//                                             </button>
//                                             <button
//                                                 onClick={() => deleteMethod(type, index)}
//                                                 className="p-2  bg-red-600/80 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
//                                             >
//                                                />
//                                             </button>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         )
//                     })}
//                 </div>
//             </div>
//         )
//     };

//     return (
//         <div className="max-w-4xl  py-8 px-4">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8">Payment Methods Configuration</h2>

//             {loading ? (
//                 <div className=" py-12 text-gray-600">Loading ledgers...</div>
//             ) : (
//                 <div className="space-y-10">
//                     {renderSection(
//                         'Cash Payment Methods',
//                         'cash',
//                         cashMethods,
//                         availableCashLedgers,
//                         addNewCash
//                     )}

//                     {renderSection(
//                         'Bank Payment Methods',
//                         'bank',
//                         bankMethods,
//                         availableBankLedgers,
//                         addNewBank
//                     )}

//                    <button
//                         className="px-4 py-2 bg-emerald-400 hover:bg-emerald-400 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
//                         type="button"
//                     >
//                         <span>Save changes</span>
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PaymentAndLedger;


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegEdit, FaStar, FaRegStar } from "react-icons/fa";
import ledgerGroupService from '@/services/ledgerGroup/ledgerGroup.service';
import { BsTrash } from "react-icons/bs";

// import purchasePaymentService from '@/services/purchasePaymentConfig.service'; // create this

const PaymentAndLedger = () => {
  const [currentLevel, setCurrentLevel] = useState('');
  const [levelId, setLevelId] = useState('');

  const [availableCash, setAvailableCash] = useState([]);
  const [availableBank, setAvailableBank] = useState([]);

  const [cashMethods, setCashMethods] = useState([]);     // [{ledgerId, name, isPrimary, _id?}]
  const [bankMethods, setBankMethods] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user: currentUser, isAuth } = useSelector(state => state.auth);

  // Set level
  useEffect(() => {
    if (!currentUser || !isAuth) return;

    if (currentUser.isVendorLevel) {
      setCurrentLevel('vendor');
    } else if (currentUser.isBuLevel) {
      setCurrentLevel('business');
      setLevelId(currentUser.businessUnit || '');
    } else if (currentUser.isBranchLevel) {
      setCurrentLevel('branch');
      setLevelId(currentUser.branch || '');
    } else if (currentUser.isWarehouseLevel) {
      setCurrentLevel('warehouse');
      setLevelId(currentUser.warehouse || '');
    } else {
      setCurrentLevel('vendor');
    }
  }, [currentUser, isAuth]);

  // Load available ledgers + saved configurations
  useEffect(() => {
    if (!currentLevel) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Available ledgers
        const ledgersRes = await ledgerGroupService.getCashAndBankGroupLedger(currentLevel, levelId);
        setAvailableCash(ledgersRes?.data?.cashLedgers || []);
        setAvailableBank(ledgersRes?.data?.bankLedgers || []);

        // 2. Saved payment configurations (you'll need this endpoint)
        // const configRes = await purchasePaymentService.getConfigs(currentLevel, levelId);
        // setCashMethods(configRes.data.cashLedgers || []);
        // setBankMethods(configRes.data.bankLedgers || []);

        // For now simulate / use your real service
        setCashMethods([]);
        setBankMethods([]);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLevel, levelId]);

  const addNew = (type) => {
    const setter = type === 'cash' ? setCashMethods : setBankMethods;
    setter(prev => [
      ...prev,
      { ledgerId: '', name: '', isPrimary: prev.length === 0, isEditing: true, isNew: true }
    ]);
  };

  const updateLedger = (type, index, ledgerId) => {
    const available = type === 'cash' ? availableCash : availableBank;
    const selected = available.find(l => l._id === ledgerId);

    const setter = type === 'cash' ? setCashMethods : setBankMethods;

    setter(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        ledgerId,
        name: selected?.ledgerName || '',
      };
      return next;
    });
  };

  const togglePrimary = (type, index) => {
    const setter = type === 'cash' ? setCashMethods : setBankMethods;
    setter(prev => {
      const next = [...prev];
      // Set all to false
      next.forEach(item => { item.isPrimary = false; });
      // Set clicked one to true
      next[index].isPrimary = true;
      return next;
    });
  };

  const toggleEdit = (type, index, shouldEdit = true) => {
    const setter = type === 'cash' ? setCashMethods : setBankMethods;
    setter(prev => {
      const next = [...prev];
      next[index].isEditing = shouldEdit;
      return next;
    });
  };

  const remove = (type, index) => {
    if (!window.confirm('Remove this payment method?')) return;

    const setter = type === 'cash' ? setCashMethods : setBankMethods;
    setter(prev => {
      const next = prev.filter((_, i) => i !== index);
      // If removed primary → make first remaining primary
      if (next.length > 0 && !next.some(item => item.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // You should call two separate requests or one bulk
      // Here we show separate for clarity

      if (cashMethods.length > 0) {
        await purchasePaymentService.upsert({
          level: currentLevel,
          levelId,
          type: 'cash',
          ledgers: cashMethods.map(m => ({
            id: m.ledgerId,
            isPrimary: m.isPrimary
          }))
        });
      }

      if (bankMethods.length > 0) {
        await purchasePaymentService.upsert({
          level: currentLevel,
          levelId,
          type: 'bank',
          ledgers: bankMethods.map(m => ({
            id: m.ledgerId,
            isPrimary: m.isPrimary
          }))
        });
      }

      alert('Changes saved successfully!');
      // Optionally reload data
    } catch (err) {
      console.error(err);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (title, type, methods, available) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => addNew(type)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
          type="button"
        >
          + Add {type === 'cash' ? 'Cash' : 'Bank'}
        </button>
      </div>

      {methods.length === 0 && (
        <div className="text-center py-10 text-gray-500 italic">
          No {type} payment methods configured yet
        </div>
      )}

      <div className="space-y-3">
        {methods.map((method, index) => (
          <div
            key={method._id || method.ledgerId || index}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <select
              value={method.ledgerId}
              onChange={e => updateLedger(type, index, e.target.value)}
              disabled={!method.isEditing}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
            >
              <option value="">Select {type === 'cash' ? 'Cash' : 'Bank'} Ledger</option>
              {available.map(ledger => (
                <option key={ledger._id} value={ledger._id}>
                  {ledger.ledgerName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => togglePrimary(type, index)}
              className="p-2 text-yellow-500 hover:text-yellow-600 transition-colors"
              title={method.isPrimary ? "Primary" : "Set as primary"}
            >
              {method.isPrimary ? <FaStar size={20} /> : <FaRegStar size={20} />}
            </button>

            <div className="flex items-center gap-2">
              {method.isEditing ? (
                <button
                  onClick={() => toggleEdit(type, index, false)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleEdit(type, index, true)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={() => remove(type, index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                 <BsTrash/>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Payment Methods Configuration</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-10">
          {renderSection('Cash Payment Methods', 'cash', cashMethods, availableCash)}
          {renderSection('Bank Payment Methods', 'bank', bankMethods, availableBank)}

          <div className="flex justify-end">
            <button
              onClick={saveAll}
              disabled={saving || (cashMethods.length === 0 && bankMethods.length === 0)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentAndLedger;