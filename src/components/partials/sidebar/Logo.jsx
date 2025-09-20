import React from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import logo from "../../../assets/images/logo/logo.png"
import logoDark from "../../../assets/images/logo/aestree-logo-dark.png"
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";


const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-darkSecondary z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
        }
      
      `}
    >
      <Link to="/dashboard">
        <div className="flex justify-center items-center space-x-4">
          <div className="logo-icon flex justify-center ">
            {!isDark && !isSemiDark ? (
              <img src={logo} alt="" className="w-[90%] h-10 object-contain" />
            ) : (
              <img src={logoDark} alt="" className="w-[90%] h-6 object-contain" />
            )}
          </div>
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className="cursor-pointer"
        >

          {
            collapsed ?
              <FaLongArrowAltRight size={24} /> :

              <FaLongArrowAltLeft size={24} />
          }

        </div>
      )}
    </div>
  );
};

export default SidebarLogo;
