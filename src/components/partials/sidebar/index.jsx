import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
// import { menuItems } from "@/constant/data";
// import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import svgRabitImage from "@/assets/images/svg/rabit.svg";

const Sidebar = () => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);

  const menuItems = [
    {
      isHeadr: true,
      title: "Menu",
    },
    {
      title: "Dashboard",
      icon: "heroicons-outline:home",
      link: "dashboard",
    },
    {
      isHeadr: true,
      title: "Vendor Management",
    },
    {
      title: "Vendor",
      icon: "material-symbols:supervised-user-circle",
      child: [
        {
          childtitle: "Vendor List ",
          childlink: "vendors-list",
        },
        {
          childtitle: "Create Vendor",
          childlink: "create-vendor",
        },
      ],
    },
    {
      isHeadr: true,
      title: "Category Management",
    },
    {
      title: "Category",
      icon: "material-symbols:supervised-user-circle",
      child: [
        {
          childtitle: "Category List ",
          childlink: "category",
        }
      ],
    },
    {
      title: "Subcategory",
      icon: "material-symbols:supervised-user-circle",
      child: [
        {
          childtitle: "Subcategory List ",
          childlink: "subcategory",
        }
      ],
    },
  ];


  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);

  // semi dark option
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`sidebar-wrapper bg-white dark:bg-darkSecondary     ${collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
          }
      ${menuHover ? "sidebar-hovered" : ""}
      ${skin === "bordered"
            ? "border-r border-slate-200 dark:border-slate-700"
            : "shadow-base"
          }
      `}
        onMouseEnter={() => {
          setMenuHover(true);
        }}
        onMouseLeave={() => {
          setMenuHover(false);
        }}
      >
        <SidebarLogo menuHover={menuHover} />
        {/* <div
          className={`h-[60px]  absolute top-[76px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${scroll ? " opacity-100" : " opacity-0"
            }`}
        ></div> */}

        <SimpleBar
          className="sidebar-menu px-4 h-[calc(100%-80px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={menuItems} />
        </SimpleBar>
      </div>
    </div>
  );
};

export default Sidebar;
