// import React, { useState } from "react";
// import { Collapse } from "react-collapse";
// import { NavLink } from "react-router-dom";
// import Icon from "@/components/ui/Icon";
// import Multilevel from "./Multi";

// const Submenu = ({
//   activeSubmenu,
//   item,
//   i,
//   toggleMultiMenu,
//   activeMultiMenu,
// }) => {

//   console.log("activeSubmenu",activeSubmenu);
  
//   return (
//     <Collapse isOpened={activeSubmenu === i}>
//       <ul className="sub-menu  space-y-4  ">
//         {item.child?.map((subItem, j) => (
//           <li key={j} className="block pl-4 pr-1 first:pt-4  last:pb-4">
//             {subItem?.multi_menu ? (
//               <div>
//                 <div
//                   onClick={() => toggleMultiMenu(j)}
//                   className={`${
//                     activeMultiMenu
//                       ? " text-slate-600 dark:text-white font-medium"
//                       : "text-slate-600 dark:text-white hover:bg-gradient-to-r hover:text-slate-600 rounded-md py-3 px-1"
//                   } text-sm flex space-x-3 items-center transition-all duration-150 cursor-pointer rtl:space-x-reverse py-3 px-1`}
//                 >
//                   <span
//                     className={`${
//                       activeMultiMenu === j
//                         ? " bg-slate-900 dark:bg-slate-300 ring-4 ring-opacity-[15%] ring-black-500 dark:ring-slate-300 dark:ring-opacity-20"
//                         : ""
//                     } h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none `}
//                   ></span>
//                   <span className="flex-1">{subItem.childtitle}</span>
//                   <span className="flex-none">
//                     <span
//                       className={`menu-arrow transform transition-all duration-300 ${
//                         activeMultiMenu === j ? " rotate-90" : ""
//                       }`}
//                     >
//                       <Icon icon="ph:caret-right" />
//                     </span>
//                   </span>
//                 </div>
//                 <Multilevel
//                   activeMultiMenu={activeMultiMenu}
//                   j={j}
//                   subItem={subItem}
//                 />
//               </div>
//             ) : (
//               <NavLink to={subItem.childlink}>
//                 {({ isActive }) => (
//                   <span
//                     className={`${
//                       isActive
//                         ? " text-black dark:text-white font-medium"
//                         : "text-slate-600 dark:text-slate-300"
//                     } text-sm flex space-x-3 items-center transition-all duration-150 rtl:space-x-reverse`}
//                   >
//                     <span
//                       className={`${
//                         isActive
//                           ? " bg-emerald-500 dark:bg-slate-300 ring-4 ring-opacity-[15%] ring-black-500 dark:ring-slate-300 dark:ring-opacity-20"
//                           : ""
//                       } h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none`}
//                     ></span>
//                     <span className="flex-1">{subItem.childtitle}</span>
//                   </span>
//                 )}
//               </NavLink>
//             )}
//           </li>
//         ))}
//       </ul>
//     </Collapse>
//   );
// };

// export default Submenu;

import React from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const Submenu = ({ activeSubmenu, item, i }) => {
  return (
    <Collapse isOpened={activeSubmenu === i}>
      <ul className="sub-menu space-y-1 pl-4 pr-1 pt-2 pb-2">
        {item.child?.map((subItem, j) => (
          <li key={j} className="block">
            {subItem?.multi_menu ? (
              <div>
                <button
                  type="button"
                  className="flex items-center w-full py-2 px-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                >
                  <span
                    className="h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none mr-2"
                  ></span>
                  <span className="flex-1 text-left">{subItem.childtitle}</span>
                </button>
              </div>
            ) : (
              <NavLink
                to={subItem.childlink}
                className={({ isActive }) =>
                  `flex items-center py-2 px-3 text-sm rounded-md transition-colors duration-150 ${
                    isActive
                      ? "bg-lightBtn text-white dark:bg-emerald-600"
                      : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`h-2 w-2 rounded-full border inline-block flex-none mr-2 ${
                        isActive
                          ? "bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600"
                          : "border-slate-600 dark:border-white"
                      }`}
                    ></span>
                    <span className="flex-1">{subItem.childtitle}</span>
                  </>
                )}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </Collapse>
  );
};

export default Submenu;