import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse } from "react-collapse";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import useMobileMenu from "@/hooks/useMobileMenu";
import Submenu from "./Submenu";
import useDarkmode from "@/hooks/useDarkMode";
import { string } from "i/lib/util";
import { lowerCase } from "lodash";


const Navmenu = ({ menus }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [sideNavItems, setSideNavItems] = useState([]);
  const [isDark] = useDarkmode();
  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const location = useLocation();
  const locationName = location.pathname.replace("/", "");
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const [activeMultiMenu, setMultiMenu] = useState(null);
  const dispatch = useDispatch();
  const toggleMultiMenu = (j) => {
    if (activeMultiMenu === j) {
      setMultiMenu(null);
    } else {
      setMultiMenu(j);
    }
  };

  const isLocationMatch = (targetLocation) => {
    return (
      locationName === targetLocation ||
      locationName.startsWith(`${targetLocation}/`)
    );
  };

  useEffect(() => {
    let submenuIndex = null;
    let multiMenuIndex = null;
    menus.forEach((item, i) => {
      if (isLocationMatch(item.link)) {
        submenuIndex = i;
      }
      if (item.child) {
        item.child.forEach((childItem, j) => {
          if (isLocationMatch(childItem.childlink)) {
            submenuIndex = i;
          }
          if (childItem.multi_menu) {
            childItem.multi_menu.forEach((nestedItem) => {
              if (isLocationMatch(nestedItem.multiLink)) {
                submenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });
    // document.title = `SAAS ECOM | ${locationName}`;

    setActiveSubmenu(submenuIndex);
    setMultiMenu(multiMenuIndex);
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [location]);

  useEffect(() => {
    const adminInfo = localStorage.getItem("saas_client_adminInfo");
    const parseInfo = JSON.parse(adminInfo);

    // console.log("capability", parseInfo?.role?.capability);

    const transformedList = transformPermissionsList(parseInfo?.role?.capability);
    // console.log("transformedList", transformedList);
    setSideNavItems(transformedList)
  }, [menus]);

  // function transformPermissionsList(vendorPermissionsList) {
  //   const result = [];

  //   vendorPermissionsList.forEach((menu) => {
  //     if (menu.access) {

  //       console.log("menu", menu);

  //       let childItems = [
  //         {
  //           childtitle: `${menu.name} List `,
  //           childlink: `${ lowerCase(menu.name)}-list`,
  //         },
  //         {
  //           childtitle: `Create ${menu.name}`,
  //           childlink: `create-${menu.name}`,
  //         },
  //       ]


  //       if (menu.name == "Roles&Permissions") {
  //         childItems = childItems.slice(0,1)
  //       }

  //       result.push({
  //         title: menu.name,
  //         icon: "material-symbols:supervised-user-circle", // You can customize icons based on the menu name
  //         child: childItems,
  //       });
  //     }
  //   });

  //   return result;
  // }

  function transformPermissionsList(vendorPermissionsList) {
    const result = [];

    // Helper function to lowercase the first letter
    const toLowerCaseFirstLetter = (str) => str.charAt(0).toLowerCase() + str.slice(1);



    let accessedMenu = [];

    vendorPermissionsList.forEach((module) => {

      if (module.access) {
        accessedMenu.push(module)
      }


      // if (menu.access) {
      //   console.log("menu", menu);

      //   // Normalize the menu name for use in links
      //   const normalizedMenuName = lowerCase(menu.name).replace(/\s+/g, "-");

      //   // Define child items
      //   let childItems = [
      //     {
      //       childtitle: `${menu.name} List`,
      //       childlink: toLowerCaseFirstLetter(`${normalizedMenuName}-list`),
      //     },
      //     {
      //       childtitle: `Create ${menu.name}`,
      //       childlink: toLowerCaseFirstLetter(`create-${normalizedMenuName}`),
      //     },
      //   ];

      //   // Special case for "Roles&Permissions"
      //   if (menu.name === "Roles&Permissions") {
      //     childItems = childItems.slice(0, 1); // Only include the first child item
      //   }

      //   if (menu.name === "SubCategory") {
      //     childItems = childItems.slice(0, 1); // Only include the first child item
      //   }

      //   if (menu.name === "Brand") {
      //     childItems = childItems.slice(0, 1); // Only include the first child item
      //   }

      //   if (menu.name === "Manufacturer") {
      //     childItems = childItems.slice(0, 1); // Only include the first child item
      //   }

      //   // Add the menu item to the result
      //   result.push({
      //     title: menu.name,
      //     icon: "material-symbols:supervised-user-circle", // Customize icons if needed
      //     child: childItems,
      //   });
      // }
    });


    accessedMenu.forEach((module) => {

      result.push({
        isHeadr: true,
        title: module.name,
      })

      // console.log("menu", module);

      module.menu.forEach((menu) => {
        if (menu.access) {
          // console.log("menu", menu);

          // Normalize the menu name for use in links
          const normalizedMenuName = lowerCase(menu.name).replace(/\s+/g, "-");

          // Define child items
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

          // Special case for "Roles&Permissions"
          if (menu.name === "Roles & Permissions") {
            childItems = childItems.slice(0, 1); // Only include the first child item
          }

          if (menu.name === "SubCategory") {
            childItems = childItems.slice(0, 1); // Only include the first child item
          }

          if (menu.name === "Brand") {
            childItems = childItems.slice(0, 1); // Only include the first child item
          }

          if (menu.name === "Manufacturer") {
            childItems = childItems.slice(0, 1); // Only include the first child item
          }

          if (menu.name === "Attribute") {
            childItems = childItems.slice(0, 1); // Only include the first child item
          }

          if (menu.name === "Pricing") {
            childItems = childItems.slice(0, 1); // Only include the first child item
          }


          // Add the menu item to the result
          result.push({
            title: menu.name,
            icon: "material-symbols:mobile-arrow-down-outline-rounded", // Customize icons if needed
            child: childItems,
          });
        }

      })


    })





    // console.log("accessedMenu", accessedMenu);


    return result;

  }




  return (
    <>
      <ul className="pb-10 pt-5">
        {sideNavItems.map((item, i) => (
          <li
            key={i}
            className={` single-sidebar-menu 
              ${item.child ? "item-has-children" : ""}
              ${activeSubmenu === i ? "open" : ""}
              ${locationName === item.link ? "menu-item-active" : ""}`}
          >
            {/* single menu with no childred*/}
            {!item.child && !item.isHeadr && (
              <NavLink className="menu-link" to={item.link}>
                <span className="menu-icon flex-grow-0">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box flex-grow">{item.title}</div>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </NavLink>
            )}
            {/* only for menulabel */}
            {item.isHeadr && !item.child && (
              <div style={{ color: isDark ? "white" : "#019B88" }} className="menulabel">{item.title}</div>
            )}
            {/*    !!sub menu parent   */}
            {item.child && (
              <div
                className={`menu-link ${activeSubmenu === i
                  ? "parent_active not-collapsed"
                  : "collapsed"
                  }`}
                onClick={() => toggleSubmenu(i)}
              >
                <div className="flex-1 flex items-start">
                  <span className="menu-icon">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-0">
                  <div
                    className={`menu-arrow transform transition-all duration-300 ${activeSubmenu === i ? " rotate-90" : ""
                      }`}
                  >
                    <Icon icon="heroicons-outline:chevron-right" />
                  </div>
                </div>
              </div>
            )}

            <Submenu
              activeSubmenu={activeSubmenu}
              item={item}
              i={i}
              toggleMultiMenu={toggleMultiMenu}
              activeMultiMenu={activeMultiMenu}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Navmenu;
