// import React, { useEffect, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { Collapse } from "react-collapse";
// import Icon from "@/components/ui/Icon";
// import { useDispatch } from "react-redux";
// import useMobileMenu from "@/hooks/useMobileMenu";
// import Submenu from "./Submenu";
// import useDarkmode from "@/hooks/useDarkMode";
// import { string } from "i/lib/util";
// import { lowerCase } from "lodash";


// const Navmenu = ({ menus }) => {
//   const [activeSubmenu, setActiveSubmenu] = useState(null);
//   const [sideNavItems, setSideNavItems] = useState([]);
//   const [isDark] = useDarkmode();
//   const toggleSubmenu = (i) => {
//     if (activeSubmenu === i) {
//       setActiveSubmenu(null);
//     } else {
//       setActiveSubmenu(i);
//     }
//   };

//   const location = useLocation();
//   const locationName = location.pathname.replace("/", "");
//   const [mobileMenu, setMobileMenu] = useMobileMenu();
//   const [activeMultiMenu, setMultiMenu] = useState(null);
//   const dispatch = useDispatch();
//   const toggleMultiMenu = (j) => {
//     if (activeMultiMenu === j) {
//       setMultiMenu(null);
//     } else {
//       setMultiMenu(j);
//     }
//   };

//   const isLocationMatch = (targetLocation) => {
//     return (
//       locationName === targetLocation ||
//       locationName.startsWith(`${targetLocation}/`)
//     );
//   };

//   useEffect(() => {
//     let submenuIndex = null;
//     let multiMenuIndex = null;
//     menus.forEach((item, i) => {
//       if (isLocationMatch(item.link)) {
//         submenuIndex = i;
//       }
//       if (item.child) {
//         item.child.forEach((childItem, j) => {
//           if (isLocationMatch(childItem.childlink)) {
//             submenuIndex = i;
//           }
//           if (childItem.multi_menu) {
//             childItem.multi_menu.forEach((nestedItem) => {
//               if (isLocationMatch(nestedItem.multiLink)) {
//                 submenuIndex = i;
//                 multiMenuIndex = j;
//               }
//             });
//           }
//         });
//       }
//     });
//     setActiveSubmenu(submenuIndex);
//     setMultiMenu(multiMenuIndex);
//     if (mobileMenu) {
//       setMobileMenu(false);
//     }
//   }, [location]);

//   useEffect(() => {
//     const adminInfo = localStorage.getItem("saas_client_adminInfo");
//     const parseInfo = JSON.parse(adminInfo);
//     const transformedList = transformPermissionsList(parseInfo?.role?.capability);
//     setSideNavItems(transformedList)
//   }, [menus]);

//   function transformPermissionsList(vendorPermissionsList) {
//     const result = [];
//     // Helper function to lowercase the first letter
//     const toLowerCaseFirstLetter = (str) => str.charAt(0).toLowerCase() + str.slice(1);
//     let accessedMenu = [];
//     vendorPermissionsList.forEach((module) => {
//       if (module.access) {
//         accessedMenu.push(module)
//       }
//     });
//     accessedMenu.forEach((module) => {
//       result.push({
//         isHeadr: true,
//         title: module.name,
//       })
//       module.menu.forEach((menu) => {
//         if (menu.access) {
//           // Normalize the menu name for use in links
//           const normalizedMenuName = lowerCase(menu.name).replace(/\s+/g, "-");
//           // Define child items
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
//           // Special case for "Roles&Permissions"
//           if (menu.name === "Roles & Permissions") {
//             childItems = childItems.slice(0, 1); // Only include the first child item
//           }
//           if (menu.name === "SubCategory") {
//             childItems = childItems.slice(0, 1); // Only include the first child item
//           }
//           if (menu.name === "Brand") {
//             childItems = childItems.slice(0, 1); // Only include the first child item
//           }
//           if (menu.name === "Manufacturer") {
//             childItems = childItems.slice(0, 1); // Only include the first child item
//           }
//           if (menu.name === "Attribute") {
//             childItems = childItems.slice(0, 1); // Only include the first child item
//           }
//           if (menu.name === "Pricing") {
//             childItems = childItems.slice(0, 1); // Only include the first child item
//           }
//           // Add the menu item to the result
//           result.push({
//             title: menu.name,
//             icon: "material-symbols:mobile-arrow-down-outline-rounded", // Customize icons if needed
//             child: childItems,
//           });
//         }
//       })
//     })
//     return result;
//   }




//   return (
//     <>
//       <ul className="pb-10 pt-5">
//         {sideNavItems.map((item, i) => (
//           <li
//             key={i}
//             className={` single-sidebar-menu 
//               ${item.child ? "item-has-children" : ""}
//               ${activeSubmenu === i ? "open" : ""}
//               ${locationName === item.link ? "menu-item-active" : ""}`}
//           >
//             {/* single menu with no childred*/}
//             {!item.child && !item.isHeadr && (
//               <NavLink className="menu-link" to={item.link}>
//                 <span className="menu-icon flex-grow-0">
//                   <Icon icon={item.icon} />
//                 </span>
//                 <div className="text-box flex-grow">{item.title}</div>
//                 {item.badge && <span className="menu-badge">{item.badge}</span>}
//               </NavLink>
//             )}
//             {/* only for menulabel */}
//             {item.isHeadr && !item.child && (
//               <div style={{ color: isDark ? "white" : "#019B88" }} className="menulabel">{item.title}</div>
//             )}
//             {/*    !!sub menu parent   */}
//             {item.child && (
//               <div
//                 className={`menu-link ${activeSubmenu === i
//                   ? "parent_active not-collapsed"
//                   : "collapsed"
//                   }`}
//                 onClick={() => toggleSubmenu(i)}
//               >
//                 <div className="flex-1 flex items-start">
//                   <span className="menu-icon">
//                     <Icon icon={item.icon} />
//                   </span>
//                   <div className="text-box">{item.title}</div>
//                 </div>
//                 <div className="flex-0">
//                   <div
//                     className={`menu-arrow transform transition-all duration-300 ${activeSubmenu === i ? " rotate-90" : ""
//                       }`}
//                   >
//                     <Icon icon="heroicons-outline:chevron-right" />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <Submenu
//               activeSubmenu={activeSubmenu}
//               item={item}
//               i={i}
//               toggleMultiMenu={toggleMultiMenu}
//               activeMultiMenu={activeMultiMenu}
//             />
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// export default Navmenu;

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
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [location, menus, mobileMenu, setMobileMenu]);

  // Transform permissions to generate menu items
  useEffect(() => {
    const adminInfo = localStorage.getItem("saas_client_adminInfo");
    const parseInfo = JSON.parse(adminInfo);
    const transformedList = transformPermissionsList(parseInfo?.role?.capability || []);
    setSideNavItems(transformedList);
  }, [menus]);

  const transformPermissionsList = (vendorPermissionsList) => {
    const result = [];
    const toLowerCaseFirstLetter = (str) =>
      str.charAt(0).toLowerCase() + str.slice(1);

    const accessedMenu = vendorPermissionsList.filter((module) => module.access);

    accessedMenu.forEach((module) => {
      result.push({
        isHeadr: true,
        title: module.name,
      });

      module.menu
        .filter((menu) => menu.access)
        .forEach((menu) => {
          const normalizedMenuName = lowerCase(menu.name).replace(/\s+/g, "-");
          let childItems = [
            {
              childtitle: `${menu.name} List`,
              childlink: toLowerCaseFirstLetter(`${normalizedMenuName}-list`),
            },
            {
              childtitle: `Create ${menu.name}`,
              childlink: toLowerCaseFirstLetter(`create-${normalizedMenuName}`),
            },
          ];

          // Special cases for specific menus
          const singleChildMenus = [
            "Roles & Permissions",
            "SubCategory",
            "Brand",
            "Manufacturer",
            "Attribute",
            "Pricing",
          ];
          if (singleChildMenus.includes(menu.name)) {
            childItems = childItems.slice(0, 1);
          }

          result.push({
            title: menu.name,
            icon: "material-symbols:mobile-arrow-down-outline-rounded",
            child: childItems,
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
          className={`single-sidebar-menu ${
            item.child ? "item-has-children" : ""
          } ${activeSubmenu === i ? "open" : ""} ${
            isParentActive(item) ? "bg-emerald-100 dark:bg-lightBtn" : ""
          } rounded-md`}
        >
          {/* Single menu with no children */}
          {!item.child && !item.isHeadr && (
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `menu-link flex items-center py-2 px-4 rounded-md transition-colors duration-150 ${
                  isActive
                    ? "bg-red-500 text-white dark:bg-lightBtn"
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
              className="menulabel py-2 px-4 text-sm font-semibold text-lightBtn dark:text-emerald-400"
            >
              {item.title}
            </div>
          )}

          {/* Submenu parent */}
          {item.child && (
            <button
              type="button"
              className={`menu-link flex items-center justify-between py-2 px-4 rounded-md w-full text-left transition-colors duration-150 ${
                isParentActive(item)
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
                className={`menu-arrow transform transition-transform duration-300 ${
                  activeSubmenu === i ? "rotate-90" : ""
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