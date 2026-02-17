
import React, { useEffect, useState, useRef } from "react";
import Icon from "@/components/ui/Icon";
import SwitchDark from "./Tools/SwitchDark";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useNavbarType from "@/hooks/useNavbarType";
import useMenulayout from "@/hooks/useMenulayout";
import useSkin from "@/hooks/useSkin";
import SearchModal from "./Tools/SearchModal";
import Profile from "./Tools/Profile";
import Notification from "./Tools/Notification";
import useRtl from "@/hooks/useRtl";
import useMobileMenu from "@/hooks/useMobileMenu";
import MonoChrome from "./Tools/MonoChrome";
import GoogleLanguage from "./Tools/GoogleLanguage";
import logo from "../../../assets/images/logo/logo.png"
import { FiAlignJustify } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import financialYearService from "@/services/financialYear/financialYear.service";
import { setIncreaseCount } from "@/store/slices/financialYearChange/financialYearChangeSlice";
import { useDispatch } from "react-redux";


const Header = ({ className = "custom-class" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [currentFy, setCurrentFy] = useState(null);
  const [allFyies, setAllFyies] = useState([]);
  const [fyLoading, setFyLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const popupRef = useRef(null);
  const triggerRef = useRef(null);


  const [collapsed, setMenuCollapsed] = useSidebar();
  const { width, breakpoints } = useWidth();
  const [navbarType] = useNavbarType();
  const navbarTypeClass = () => {
    switch (navbarType) {
      case "floating":
        return "floating  has-sticky-header";
      case "sticky":
        return "sticky top-0 z-[999]";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
      default:
        return "sticky top-0";
    }
  };
  const [menuType] = useMenulayout();
  const [skin] = useSkin();
  const [isRtl] = useRtl();

  const [mobileMenu, setMobileMenu] = useMobileMenu();

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const borderSwicthClass = () => {
    if (skin === "bordered" && navbarType !== "floating") {
      return "border-b border-slate-200 dark:border-slate-700";
    } else if (skin === "bordered" && navbarType === "floating") {
      return "border border-slate-200 dark:border-slate-700";
    } else {
      return "dark:border-b dark:border-slate-700 dark:border-opacity-60";
    }
  };


  useEffect(() => {

    getWorkingFy();
    getAllFyies()

  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  async function getWorkingFy() {
    try {
      setFyLoading(true);
      const response = await financialYearService.getWorkingFy();
      setCurrentFy(response?.data);
      setFyLoading(false);
    } catch (error) {
      setFyLoading(false);
      console.log("error", error);
    }
  }

  async function getAllFyies() {
    try {
      const response = await financialYearService.allFyies();
      setAllFyies(response?.data);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function handleFySelect(fy) {
    if (fy._id === currentFy?._id) {
      setIsPopupOpen(false);
      return;
    }

    try {
      setFyLoading(true);
      // Assuming financialYearService has a setWorkingFy method that takes fy.id
      // If not, implement it in the service as per your API (e.g., POST /set-working-fy with { id: fy.id });

      const dataObject = {
        id : fy?._id, status : "1",
      }


      await financialYearService.setWorking(dataObject);
      await getWorkingFy(); // Refresh current FY after update
      setIsPopupOpen(false);
      dispatch(setIncreaseCount());
      
    } catch (error) {
      console.error("Error setting working FY:", error);
      // Optionally, show a toast or error message to the user
    } finally {
      setFyLoading(false);
    }
  }

  return (
    <header className={className + " " + navbarTypeClass()}>
      <div
        className={` app-header md:px-6 px-[15px]  dark:bg-darkSecondary shadow-base dark:shadow-base3 bg-white
        ${borderSwicthClass()}
             ${menuType === "horizontal" && width > breakpoints.xl
            ? "py-1"
            : " py-3"
          }
        `}
      >
        <div className="flex justify-between items-center h-full">
          {/* For Vertical  */}

          {menuType === "vertical" && (
            <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
              {collapsed && width >= breakpoints.xl && (
                <button
                  className="text-xl text-slate-900 dark:text-white"
                  onClick={() => setMenuCollapsed(!collapsed)}
                >
                  {isRtl ? (
                    <Icon icon="akar-icons:arrow-left" />
                  ) : (
                    <Icon icon="akar-icons:arrow-right" />
                  )}
                </button>
              )}
              {width < breakpoints.xl && (
                <img src={logo} alt="logo" className="w-12" />
              )}
              {/* {width < breakpoints.xl && <Logo />} */}
              {/* open mobile menu handlaer*/}
              {width < breakpoints.xl && width >= breakpoints.md && (
                <div
                  className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                  onClick={handleOpenMobileMenu}
                >
                  {/* <Icon icon="heroicons-outline:menu-alt-3" /> */}
                  <FiAlignJustify />

                </div>
              )}
              <SearchModal />
            </div>
          )}
          {/* For Horizontal  */}
          {menuType === "horizontal" && (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">

              <img src={logo} alt="" className="w-10" />
              {/* open mobile menu handlaer*/}
              {width <= breakpoints.xl && (
                <div
                  className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                  onClick={handleOpenMobileMenu}
                >
                  {/* <Icon icon="heroicons-outline:menu-alt-3" /> */}
                  <FiAlignJustify />

                </div>
              )}
            </div>
          )}



          {/* Nav Tools  */}
          <div className="nav-tools flex items-center lg:space-x-6 space-x-3 rtl:space-x-reverse">

            <div className="relative">
              <div
                ref={triggerRef}
                className="bg-emerald-500 h-8 p-2 flex items-center rounded-lg cursor-pointer"
                onClick={() => setIsPopupOpen(!isPopupOpen)}
              >
                {fyLoading ? (
                  <div className="flex gap-1 items-center">
                    <div
                      className="w-4 h-4 rounded-full animate-spin
                      border-2 border-solid border-white dark:border-slate-200 border-t-transparent"
                    ></div>
                    <span className="text-white">Loading..</span>
                  </div>
                ) : (
                  <>
                    {currentFy ? (
                      <span className="text-white"> FY: {currentFy?.name}</span>
                    ) : (
                      <span className="text-white"> Set Current FY</span>
                    )}
                  </>
                )}
              </div>

              {isPopupOpen && (
                <div
                  ref={popupRef}
                  className="absolute top-full h-[12rem] left-0 mt-2 bg-white dark:bg-darkSecondary shadow-lg rounded-lg p-2 z-50 min-w-[200px] max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700"
                >
                  <ul className="list-none m-0 p-0">
                    {allFyies.map((fy) => (
                      <li
                        key={fy.id}
                        className={`p-2 my-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between rounded-md ${
                          fy.id === currentFy?.id ? "bg-slate-200 dark:bg-slate-600" : ""
                        }`}
                        onClick={() => handleFySelect(fy)}
                      >
                        <span>{fy.name}</span>
                        {fy._id === currentFy?._id && (
                          <Icon icon="heroicons:check" className="text-emerald-500 ml-2" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>



            <GoogleLanguage />
            {/* <SwitchDark /> */}
            <MonoChrome />
            <span>
              <div
                className="lg:h-[32px] lg:w-[32px]  dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
                onClick={() => navigate("/system/settings")}
              >
                {/* <Icon icon="mdi:palette-outline" /> */}
                <IoIosSettings />
              </div>
            </span>
            {width >= breakpoints.md && <Notification />}
            {width >= breakpoints.md && <Profile />}
            {width <= breakpoints.md && (
              <div
                className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                onClick={handleOpenMobileMenu}
              >
                {/* <Icon icon="heroicons-outline:menu-alt-3" /> */}
                <FiAlignJustify />
              </div>
            )}




          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
