

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse } from "react-collapse";
import Icon from "@/components/ui/Icon";
import useMobileMenu from "@/hooks/useMobileMenu";
import Submenu from "./Submenu";
import useDarkmode from "@/hooks/useDarkMode";
import { lowerCase } from "lodash";

const Navmenu = ({ menus }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [sideNavItems, setSideNavItems] = useState([]);
  const [isDark] = useDarkmode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const location = useLocation();
  const locationName = location.pathname.replace("/", "");

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const isLocationMatch = (targetLocation) => {
    return (
      locationName === targetLocation ||
      locationName.startsWith(`${targetLocation}/`)
    );
  };

  // Determine active submenu and parent menu based on current location
  useEffect(() => {
    let submenuIndex = null;
    menus.forEach((item, i) => {
      if (isLocationMatch(item.link)) {
        submenuIndex = i;
      }
      if (item.child) {
        item.child.forEach((childItem) => {
          if (
            isLocationMatch(childItem.childlink) ||
            (childItem.multi_menu &&
              childItem.multi_menu.some((nestedItem) =>
                isLocationMatch(nestedItem.multiLink)
              ))
          ) {
            submenuIndex = i;
          }
        });
      }
    });
    setActiveSubmenu(submenuIndex);
    // if (mobileMenu) {
    //   setMobileMenu(false);
    // }
  }, [location, menus, mobileMenu, setMobileMenu]);

  // Transform permissions to generate menu items
  useEffect(() => {
    const adminInfo = localStorage.getItem("saas_client_adminInfo");
    const parseInfo = JSON.parse(adminInfo);
    const transformedList = transformPermissionsList(parseInfo?.role?.capability || []);
    // setSideNavItems(transformedList);

    setSideNavItems([
      {
        title: "Dashboard",
        link: "/dashboard",
        icon: "heroicons-outline:home",
      },
      ...transformedList,
    ]);
  }, [menus]);

  const transformPermissionsList = (vendorPermissionsList) => {
    const toLowerCaseFirstLetter = (str) =>
      str.charAt(0).toLowerCase() + str.slice(1);

    const iconMap = {
      "Roles & Permissions": "material-symbols:developer-board-off-outline",
      "Employee": "material-symbols:group-outline",
      "Documents": "material-symbols:unknown-document-outline",
      "Customer": "material-symbols:sensor-occupied-outline",
      "BusinessUnit": "material-symbols:crown-outline",
      "Branch": "material-symbols:polyline-outline",
      "Warehouse": "material-symbols:warehouse-outline",
      "Assets & Tools": "material-symbols:group-outline",
      "Leave Category": "material-symbols:group-outline",
      "SubCategory": "material-symbols:category-outline",
      "Brand": "material-symbols:library-add-check-outline",
      "Manufacturer": "material-symbols:precision-manufacturing-outline",
      "Product": "material-symbols:garden-cart-outline",
      "Product QA": "material-symbols:stacks-outline",
      "Product QA Out": "material-symbols:garden-cart-outline",
      "Attribute": "material-symbols:stacks-outline",
      "Variant": "material-symbols:blur-linear-outline",
      "Pricing": "material-symbols:price-change-outline",
      "Transport": "material-symbols:transportation-outline",
      "Stock": "material-symbols:stockpot-outline",
      "Order": "material-symbols:quick-reorder-outline",
      "Financial Year": "material-symbols:calendar-month-outline",
      "Currency": "material-symbols:currency-rupee-circle-outline",
      "Ledger": "material-symbols:print-disabled-outline",
      "Group": "material-symbols:group-work-outline",
      "Voucher Group": "material-symbols:background-dot-large-outline",
      "Voucher": "material-symbols:featured-video-outline",
      "Shift": "material-symbols:timer-off-outline",
      "Change Shift": "material-symbols:timer-off",
      "Shift Change Request": "material-symbols:more-time",
      "Department": "material-symbols:batch-prediction",
      "Documents": "material-symbols:docs-outline",
      "Assets & Tools": "material-symbols:service-toolbox-rounded",
      "Leave Category": "material-symbols:holiday-village-outline-rounded",
      "Holiday": "material-symbols:energy-savings-leaf-outline-rounded",
      "Leave Allotment": "material-symbols:assignment-outline",
    };

    const singleChildMenus = new Set([
      "Roles & Permissions",
      "SubCategory",
      "Brand",
      "Manufacturer",
      "Attribute",
      "Pricing",
      "Financial Year",
      "Currency",
      "Purchase Invoices",
      "Payment Out",
      "Purchase Returns",
      "Debit Note",
      "Purchase Order",
      "Sales Invoices",
      "Quotation",
      "Payment In",
      "Sales Returns",
      "Credit Note",
      "Performa Invoice",
      "Delivery Challan",
      "BusinessUnit",
      "Branch",
      "Warehouse",
      "Customer",
      "Supplier",
      "Group",
      "Shift",
      "Department",
      "Documents",
      "Assets & Tools",
      "Leave Category",
      "Leave Allotment",
      "Holiday",
      "Audit Stock",
      "Leave Requests"
    ]);

    const excludedMenus = new Set([
      "Department",
      "Shift",
      "Documents",
      "Assets & Tools",
      "Leave Category",
      "Holiday",
      "Product QA",
      "Product QA Out",
      "Change Shift",
      "Shift Change Request",
      "Leave Allotment",
      "Leave Requests"
    ]);

    const result = [];

    vendorPermissionsList
      .filter((module) => module.access)
      .forEach((module) => {
        // if (module.name !== "Human resources") {
        result.push({ isHeadr: true, title: module.name });
        // }

        module.menu
          .filter((menu) => menu.access && !excludedMenus.has(menu.name))
          .forEach((menu) => {
            const normalizedMenuName = menu.name.toLowerCase().replace(/\s+/g, "-");

            let childItems = [
              {
                childtitle: `${menu.name} List`,
                childlink: toLowerCaseFirstLetter(`${normalizedMenuName}-list`)
              },
              {
                childtitle: `Create ${menu.name}`,
                childlink: toLowerCaseFirstLetter(`create-${normalizedMenuName}`)
              }
            ];

            // If only one child item is allowed
            if (singleChildMenus.has(menu.name)) {
              childItems = childItems.slice(0, 1);
            }

            result.push({
              title: menu.name,
              icon: iconMap[menu.name] || "material-symbols:mobile-arrow-down-outline-rounded",
              child: childItems
            });
          });
      });

    return result;
  };

  // Check if any child item is active for a given menu
  const isParentActive = (item) => {
    if (!item.child) return isLocationMatch(item.link);
    return item.child.some((childItem) =>
      isLocationMatch(childItem.childlink) ||
      (childItem.multi_menu &&
        childItem.multi_menu.some((nestedItem) =>
          isLocationMatch(nestedItem.multiLink)
        ))
    );
  };

  return (
    <ul className="pb-10 pt-5 space-y-1">
      {sideNavItems.map((item, i) => (
        <li
          key={i}
          className={`single-sidebar-menu ${item.child ? "item-has-children" : ""
            } ${activeSubmenu === i ? "open" : ""} ${isParentActive(item) ? "bg-emerald-100 dark:bg-lightBtn" : ""
            } rounded-md`}
        >
          {/* Single menu with no children */}
          {!item.child && !item.isHeadr && (
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `menu-link flex items-center py-0 px-4 rounded-md transition-colors duration-150 ${isActive
                  ? "bg-lightBtn text-white dark:bg-lightBtn"
                  : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`
              }
            >
              <span className="menu-icon flex-shrink-0 mr-3">
                <Icon icon={item.icon} />
              </span>
              <div className="text-box flex-grow">{item.title}</div>
              {item.badge && (
                <span className="menu-badge bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )}

          {/* Menu label (header) */}
          {item.isHeadr && !item.child && (
            <div
              className="menulabel py-0 px-4 text-sm font-semibold text-lightBtn dark:text-emerald-400"
            >
              {item.title}
            </div>
          )}

          {/* Submenu parent */}
          {item.child && (
            <button
              type="button"
              className={`menu-link flex items-center justify-between py-2 px-4 rounded-md w-full text-left transition-colors duration-150 ${isParentActive(item)
                ? "bg-lightBtn text-white dark:bg-emerald-600"
                : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              onClick={() => toggleSubmenu(i)}
              aria-expanded={activeSubmenu === i}
            >
              <div className="flex items-center">
                <span className="menu-icon flex-shrink-0 mr-3">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box">{item.title}</div>
              </div>
              <div
                className={`menu-arrow transform transition-transform duration-300 ${activeSubmenu === i ? "rotate-90" : ""
                  }`}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </div>
            </button>
          )}

          <Submenu
            activeSubmenu={activeSubmenu}
            item={item}
            i={i}
          />
        </li>
      ))}
    </ul>
  );
};

export default Navmenu;











// import React, { useEffect, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { Collapse } from "react-collapse";
// import Icon from "@/components/ui/Icon";
// import useMobileMenu from "@/hooks/useMobileMenu";
// import Submenu from "./Submenu";
// import useDarkmode from "@/hooks/useDarkMode";
// import { lowerCase } from "lodash";

// const Navmenu = ({ menus }) => {
//   const [activeSubmenu, setActiveSubmenu] = useState(null);
//   const [sideNavItems, setSideNavItems] = useState([]);
//   const [isDark] = useDarkmode();
//   const [mobileMenu, setMobileMenu] = useMobileMenu();
//   const location = useLocation();
//   const locationName = location.pathname.replace("/", "");

//   const toggleSubmenu = (index) => {
//     setActiveSubmenu(activeSubmenu === index ? null : index);
//   };

//   const isLocationMatch = (targetLocation) => {
//     return (
//       locationName === targetLocation ||
//       locationName.startsWith(`${targetLocation}/`)
//     );
//   };

//   // Determine active submenu and parent menu based on current location
//   useEffect(() => {
//     let submenuIndex = null;
//     menus.forEach((item, i) => {
//       if (isLocationMatch(item.link)) {
//         submenuIndex = i;
//       }
//       if (item.child) {
//         item.child.forEach((childItem) => {
//           if (
//             isLocationMatch(childItem.childlink) ||
//             (childItem.multi_menu &&
//               childItem.multi_menu.some((nestedItem) =>
//                 isLocationMatch(nestedItem.multiLink)
//               ))
//           ) {
//             submenuIndex = i;
//           }
//         });
//       }
//     });
//     setActiveSubmenu(submenuIndex);
//     // if (mobileMenu) {
//     //   setMobileMenu(false);
//     // }
//   }, [location, menus, mobileMenu, setMobileMenu]);

//   // Transform permissions to generate menu items
//   useEffect(() => {
//     const adminInfo = localStorage.getItem("saas_client_adminInfo");
//     const parseInfo = JSON.parse(adminInfo);
//     const transformedList = transformPermissionsList(parseInfo?.role?.capability || []);
//     // setSideNavItems(transformedList);

//     setSideNavItems([
//       {
//         title: "Dashboard",
//         link: "/dashboard",
//         icon: "heroicons-outline:home",
//       },
//       ...transformedList,
//     ]);
//   }, [menus]);

//   const transformPermissionsList = (vendorPermissionsList) => {
//     const result = [];
//     const toLowerCaseFirstLetter = (str) =>
//       str.charAt(0).toLowerCase() + str.slice(1);

//     const accessedMenu = vendorPermissionsList.filter((module) => module.access);

//     accessedMenu.forEach((module) => {

//       if (module.name !== "Human resources") {
//         result.push({
//           isHeadr: true,
//           title: module.name,
//         });
//       }

//       module.menu
//         .filter((menu) => (menu.access
//           && menu.name !== "Department"
//           && menu.name !== "Shift"
//           && menu.name !== "Documents"
//           && menu.name !== "Assets & Tools"
//           && menu.name !== "Leave Category"
//           && menu.name !== "Holiday"
//           && menu.name !== "Product QA"
//           && menu.name !== "Product QA Out"
//         ))
//         .forEach((menu) => {
//           const normalizedMenuName = lowerCase(menu.name).replace(/\s+/g, "-");
//           let childItems = [
//             {
//               childtitle: `${menu.name} List`,
//               childlink: toLowerCaseFirstLetter(`${normalizedMenuName}-list`),
//             },
//             {
//               childtitle: `Create ${menu.name}`,
//               childlink: toLowerCaseFirstLetter(`create-${normalizedMenuName}`),
//             },
//           ];

//           // Special cases for specific menus
//           const singleChildMenus = [
//             "Roles & Permissions",
//             "SubCategory",
//             "Brand",
//             "Manufacturer",
//             "Attribute",
//             "Pricing",
//             "Financial Year",
//             "Currency",
//             "Purchase Invoices",
//             "Payment Out",
//             "Purchase Returns",
//             "Debit Note",
//             "Purchase Order",
//             "Sales Invoices",
//             "Quotation",
//             "Payment In",
//             "Sales Returns",
//             "Credit Note",
//             "Performa Invoice",
//             "Delivery Challan"

//           ];
//           if (singleChildMenus.includes(menu.name)) {
//             childItems = childItems.slice(0, 1);
//           }

//           result.push({
//             title: menu.name,
//             icon: "material-symbols:mobile-arrow-down-outline-rounded",
//             child: childItems,
//           });
//         });
//     });
//     return result;
//   };

//   // Check if any child item is active for a given menu
//   const isParentActive = (item) => {
//     if (!item.child) return isLocationMatch(item.link);
//     return item.child.some((childItem) =>
//       isLocationMatch(childItem.childlink) ||
//       (childItem.multi_menu &&
//         childItem.multi_menu.some((nestedItem) =>
//           isLocationMatch(nestedItem.multiLink)
//         ))
//     );
//   };

//   return (
//     <ul className="pb-10 pt-5 space-y-1">
//       {sideNavItems.map((item, i) => (
//         <li
//           key={i}
//           className={`single-sidebar-menu ${item.child ? "item-has-children" : ""
//             } ${activeSubmenu === i ? "open" : ""} ${isParentActive(item) ? "bg-emerald-100 dark:bg-lightBtn" : ""
//             } rounded-md`}
//         >
//           {/* Single menu with no children */}
//           {!item.child && !item.isHeadr && (
//             <NavLink
//               to={item.link}
//               className={({ isActive }) =>
//                 `menu-link flex items-center py-0 px-4 rounded-md transition-colors duration-150 ${isActive
//                   ? "bg-lightBtn text-white dark:bg-lightBtn"
//                   : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 }`
//               }
//             >
//               <span className="menu-icon flex-shrink-0 mr-3">
//                 <Icon icon={item.icon} />
//               </span>
//               <div className="text-box flex-grow">{item.title}</div>
//               {item.badge && (
//                 <span className="menu-badge bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
//                   {item.badge}
//                 </span>
//               )}
//             </NavLink>
//           )}

//           {/* Menu label (header) */}
//           {item.isHeadr && !item.child && (
//             <div
//               className="menulabel py-0 px-4 text-sm font-semibold text-lightBtn dark:text-emerald-400"
//             >
//               {item.title}
//             </div>
//           )}

//           {/* Submenu parent */}
//           {item.child && (
//             <button
//               type="button"
//               className={`menu-link flex items-center justify-between py-2 px-4 rounded-md w-full text-left transition-colors duration-150 ${isParentActive(item)
//                   ? "bg-lightBtn text-white dark:bg-emerald-600"
//                   : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 }`}
//               onClick={() => toggleSubmenu(i)}
//               aria-expanded={activeSubmenu === i}
//             >
//               <div className="flex items-center">
//                 <span className="menu-icon flex-shrink-0 mr-3">
//                   <Icon icon={item.icon} />
//                 </span>
//                 <div className="text-box">{item.title}</div>
//               </div>
//               <div
//                 className={`menu-arrow transform transition-transform duration-300 ${activeSubmenu === i ? "rotate-90" : ""
//                   }`}
//               >
//                 <Icon icon="heroicons-outline:chevron-right" />
//               </div>
//             </button>
//           )}

//           <Submenu
//             activeSubmenu={activeSubmenu}
//             item={item}
//             i={i}
//           />
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default Navmenu;