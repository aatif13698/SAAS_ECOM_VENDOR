
import { useState } from 'react';
import {
  FiSettings,
  FiBox,
  FiTag,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiUsers,
  FiShield,
  FiBell,
  FiLink,
  FiGrid,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

import PurchaseSettings from './PurchaseSettings';
import RoleList from '../rolesAndPermission/RolesList';
import SaleSetting from "./SaleSettings";
import GeneralSettings from "./GeneralSettings";
import { useNavigate } from 'react-router-dom';

const menuItems = [
  {
    title: "ORGANIZATION SETTING",
    icon: FiSettings,
    menu: [
      { id: 'organization', label: 'Organization' },
      { id: 'subscription', label: 'Subscription' },
      { id: 'role', label: 'Role' },
    ]
  },
  {
    title: "TAXS & COMPLIANCE",
    icon: FiShield,
    menu: [
      { id: 'taxes', label: 'Tax Rate & Gst Setting' },
      { id: 'direct-tax', label: 'TDS & TCS Setting' },
      { id: 'msme', label: 'MSME Setting' },
    ]
  },
  {
    title: "CONFIGURATION SETTING",
    icon: FiGrid,
    menu: [
      { id: 'financial-year', label: 'Financial Year' },
      { id: 'reminder', label: 'Reminder' },
    ]
  },
  {
    title: "CUSTOMIZATION SETTING",
    icon: FiGrid,
    menu: [
      { id: 'serial-number', label: 'Serial Number' },
      { id: 'transaction-pdf-template', label: 'Transaction Pdf Template' },
    ]
  },
  {
    title: "SALE SETTING",
    icon: FiDollarSign,
    menu: [
      { id: 'sale-config', label: 'Sale Configure' },
      { id: 'sale-quotation', label: 'Sale Quotation' },
      { id: 'sale-performa', label: 'Sale Performa' },
      { id: 'sale-invoice', label: 'Sale Invoice' },
      { id: 'sale-return', label: 'Sale Return' },
      { id: 'payment-in', label: 'Payment In' },
      { id: 'credit-note', label: 'Credit Note' },
      { id: 'delivery-challan', label: 'Delivery Challan' },
    ]
  },
  {
    title: "PURCHASE SETTING",
    icon: FiShoppingCart,
    menu: [
      { id: 'purchase-config', label: 'Purchase Configure' },
      { id: 'purchase-order', label: 'Purchase Order' },
      { id: 'purchase-invoice', label: 'Purchase Invoice' },
      { id: 'purchase-return', label: 'Purchase Return' },
      { id: 'payment-out', label: 'Payment Out' },
      { id: 'debit-note', label: 'Debit Note' },
    ]
  },
  {
    title: "PRODUCT SETTING",
    icon: FiBox,
    menu: [
      { id: 'stock', label: 'Stock' },
      { id: 'product', label: 'Product' },
    ]
  },
];

export default function SystemSettings() {
  const [activeSection, setActiveSection] = useState('serial-number');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleMenuClick = (id) => {
    setActiveSection(id);
    setIsMobileOpen(false);
  };

  const renderMenu = (collapsed = false) => (
    <div className="px-3 py-4 space-y-8">
      {menuItems.map((group) => {
        const GroupIcon = group.icon;

        return (
          <div key={group.title} className="space-y-1">
            {/* Section Header - Different icon per group */}
            <div
              className={`flex items-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                collapsed ? 'justify-center' : 'gap-3'
              }`}
            >
              <GroupIcon className={`text-lg flex-shrink-0 ${collapsed ? 'text-xl' : ''}`} />
              {!collapsed && <span>{group.title}</span>}
            </div>

            {/* Submenu Items - Using same group icon (as per your request - no separate icons needed per menu item) */}
            <ul className="space-y-1">
              {group.menu.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`
                        flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                        ${collapsed ? 'justify-center' : 'pl-11'}
                      `}
                    >
                      {/* <GroupIcon
                        className={`text-xl flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}`}
                      /> */}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-16 items-center ">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden flex items-center gap-2 p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 px-4"
          >
            <FiMenu className="text-2xl" /> 
            <span>Menus</span>
          </button>

          <div className='lg:block hidden w-72  '>
            <div className="flex px-4 lg:px-6   items-center gap-3 ml-3 lg:ml-0  ">
              <div className="w-8 h-8 bg-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                System Settings
              </h1>
            </div>
          </div>

          <div className=" flex items-center gap-4">
            {activeSection === 'general' &&
              <div className="px-4 lg:px-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  General Settings
                </h2>
                <p className="mt-1 text-sm sm:text-xs text-gray-500 dark:text-gray-400">
                  Configure your general settings
                </p>
              </div>
            }
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="px-4">
              <button onClick={() => navigate('/dashboard')} className='bg-red-600 hover:bg-red-400 hover:right-2 ring-red-100 px-2 py-1 rounded-lg text-white'>Close</button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'
            }`}
        >
          <div className="flex-1 overflow-y-auto">{renderMenu(isCollapsed)}</div>

          {/* Collapse Toggle Button */}
          {/* <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
          </div> */}
        </aside>

        {/* Mobile Offcanvas */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <h2 className="text-xl font-semibold">Settings</h2>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-73px)]">
                {renderMenu(false)}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="p-4 lg:p-8  mx-auto">
            {activeSection === 'serial-number' && <GeneralSettings />}
            {activeSection === 'purchase-config' && <PurchaseSettings />}
            {activeSection === 'sale-config' && <SaleSetting />}
            {activeSection === 'role' && <RoleList />}

            {/* Placeholder for remaining sections */}
            {['inventory', 'products', 'stocks', 'accounting', 'vendors', 'notifications', 'integrations'].includes(activeSection) && (
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {menuItems.find((group) => group.menu.some(item => item.id === activeSection))?.menu.find(item => item.id === activeSection)?.label || activeSection}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configuration options for <span className="font-medium capitalize">{activeSection.replace('-', ' ')}</span> will appear here.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}