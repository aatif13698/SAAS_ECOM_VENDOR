import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FooterAvatar from "@/assets/images/users/user-1.jpg";
import {
  ViewParticularAuth,
  ViewParticularOrganiser,
} from "@/redux/slices/Auth/Auth";
import {
  UnreadNotification,
  UnreadNotificationCount,
  ViewParticularNotification,
} from "@/redux/slices/Notification/SuperAdminNotification";
const MobileFooter = () => {

  const dispatch = useDispatch();
  const { viewParticularOrganiser, viewParticularAuth } = useSelector((state) => state.Auth);
  const { unreadNotificationList, unreadNotificationCount } = useSelector(
    (state) => state.SuperAdminNotification
  );
  const [refresh, setRefresh] = useState(0);
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const roleId = adminInfo?.roleId;
  const id = adminInfo?._id

  const [data,setData]=useState()

  useEffect(() => {
    if (roleId == 1) {
      dispatch(ViewParticularAuth()).then((res) => {
        setRefresh((prev) => prev + 1);
        setData((prev) => ({
          ...prev,
          firstName: res?.payload?.data?.firstName,
          lastName: res?.payload?.data?.lastName,
          profileImage: res?.payload?.data?.profileImage,
        }));
      });
    } else {
      dispatch(ViewParticularOrganiser()).then((res) => {
        setRefresh((prev) => prev + 1);

        setData((prev) => ({
          ...prev,
          firstName: res?.payload?.data?.firstName,
          lastName: res?.payload?.data?.lastName,
          profileImage: res?.payload?.data?.profileImage,
        }));
      });
    }
  }, [id,]);
  useEffect(()=>{
    dispatch(UnreadNotificationCount());

  },[refresh])
  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-darkSecondary flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <NavLink to="/event-list">
        {({ isActive }) => (
          <div>
            <span
              className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${isActive ? "text-primary-500" : "dark:text-white text-slate-900"}
          `}
            >
              <Icon icon="heroicons-outline:collection" />
              {/* <span className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                10
              </span> */}
            </span>
            <span
              className={` block text-[11px]
          ${isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"
                }
          `}
            >
              Category
            </span>
          </div>
        )}
      </NavLink>
      <NavLink
        to="/viewProfile"
        className="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        {({ isActive }) => (
          <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
            <img
              src={roleId == 1 ? viewParticularAuth ?.data?.profileImage? viewParticularAuth?.data?.profileImage : FooterAvatar : viewParticularOrganiser ?.data?.profileImage? viewParticularOrganiser?.data?.profileImage : FooterAvatar}

              alt=""
              className={` w-full h-full rounded-full
          ${isActive
                  ? "border-2 border-primary-500"
                  : "border-2 border-slate-100"
                }
              `}
            />
          </div>
        )}
      </NavLink>
      <NavLink to="/notification-list">
        {({ isActive }) => (
          <div>
            <span
              className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
      ${isActive ? "text-primary-500" : "dark:text-white text-slate-900"}
          `}
            >
              <Icon icon="heroicons-outline:bell" />
              <span className="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
              {unreadNotificationCount?.count}
              </span>
            </span>
            <span
              className={` block text-[11px]
         ${isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"}
        `}
            >
              Notifications
            </span>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default MobileFooter;
