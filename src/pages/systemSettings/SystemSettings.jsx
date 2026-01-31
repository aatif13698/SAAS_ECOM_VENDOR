import { useState } from 'react';

// React Icons - choose the collection you prefer (here using mostly from 'react-icons/fi' & 'react-icons/md')
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
} from 'react-icons/fi';
import PurchaseSettings from './PurchaseSettings';
import RoleList from '../rolesAndPermission/RolesList';
import SaleSetting from "./SaleSettings"
const menuItems = [
  { id: 'general', label: 'General', icon: FiSettings },
  { id: 'inventory', label: 'Inventory', icon: FiBox },
  { id: 'products', label: 'Products', icon: FiTag },
  { id: 'stocks', label: 'Stocks & Warehouses', icon: FiGrid },
  { id: 'purchase', label: 'Purchase', icon: FiShoppingCart },
  { id: 'sales', label: 'Sales', icon: FiDollarSign },
  { id: 'accounting', label: 'Accounting', icon: FiPackage },
  { id: 'vendors', label: 'Vendors & Commissions', icon: FiUsers },
  { id: 'users-roles', label: ' Roles', icon: FiShield },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'integrations', label: 'Integrations', icon: FiLink },
];

function SystemSettings() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="flex  h-screen bg-gray-50 dark:bg-gray-950 ">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            System Settings
          </h1>
        </div>

        <nav className="mt-2 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className={`text-xl ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Horizontal Scrollable Tabs */}
      <div className="lg:hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 bg-white px-1 py-3 dark:border-gray-800 dark:bg-gray-900 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  mr-5 flex flex-col items-center gap-1 whitespace-nowrap px-3 py-1 text-xs font-medium
                  ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}
                `}
              >
                <Icon className="text-xl" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto  px-2 pt-2 sm:px-2 lg:px-2">


          {/* Content - placeholder sections */}
          <div className="">
            {activeSection === 'general' && (
              <section>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Company Details</h4>
                    {/* Company name, logo, timezone, currency etc. */}
                  </div>
                  {/* Add more cards */}
                </div>
              </section>
            )}

            {activeSection === 'inventory' && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Inventory Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Low stock alerts, tracking method, auto stock deduction rules...
                </p>
              </div>
            )}

            {activeSection === 'products' && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  products Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Low stock alerts, tracking method, auto stock deduction rules...
                </p>
              </div>
            )}

            {activeSection === 'purchase' && (
              <PurchaseSettings />
            )}

            {activeSection === 'sales' && (
              <SaleSetting />
            )}

            {activeSection === 'users-roles' && (
              <RoleList />
            )}
            {/* Quick placeholder for other sections */}
            {['stocks', 'sales', 'accounting', 'vendors', 'notifications', 'integrations']
              .includes(activeSection) && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {menuItems.find((item) => item.id === activeSection)?.label}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage {activeSection.replace('-', ' ')} related configurations here...
                  </p>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SystemSettings;