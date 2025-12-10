import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserAvatar from "@/assets/images/all-img/user.png";
import ProfileImage from "@/assets/images/users/user-1.jpg";

import { logOut } from "@/store/api/auth/authSlice";
import authService from "../../../../services/authService";
import { setProfile, removeProfile } from "@/store/api/auth/peofileSlice";
import {
  ViewParticularAuth,
  ViewParticularOrganiser,
} from "@/redux/slices/Auth/Auth";
import { resetStore } from "@/redux/slices/Auth/Logout"
import { removeAuth } from "@/redux/slices/Auth/Auth";
import { removeNotification } from "@/redux/slices/Notification/SuperAdminNotification";


const profileLabel = () => {
  const { profileData: profile, profileExists } = useSelector(
    (state) => state.profile
  );

  const { viewParticularOrganiser, viewParticularAuth } = useSelector((state) => state.Auth);
  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState({});
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const roleId = adminInfo?.roleId;
  // console.log("aatif roleId",roleId);
  
  const id = adminInfo?.id
  const [data, setData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
  });
  useEffect(() => {
    if (profile) {
      setCurrentUser(profile);
      setProfileImgPreview(`${profile?.profileImage}`);
    } else {
    }
  }, [profile]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (roleId == 1 || roleId == 2) {
      
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

  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            // src={data && data?.profileImage}
            src={profile?.profileImage ??  ProfileImage}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        {/* <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {roleId == 1 || roleId == 2 ? viewParticularAuth?.data?.firstName ? viewParticularAuth?.data?.firstName : "Admin" : viewParticularOrganiser?.data?.firstName ? viewParticularOrganiser?.data?.firstName : "Organiser"}
        </span> */}
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adminId, setAdminId] = useState(null);

  const adminInfo = useSelector((state) => state?.auth);
   
  
  
  const { profileData: profile, profileExists } = useSelector(
    (state) => state.profile
  );

  // console.log("adminInfo",profile);
  


  // console.log("profileExists",profileExists);
  

  const handleLogout = () => {
    // const lng = localStorage.getItem("selectedLanguage")
    // const index = localStorage.getItem("languageIndex")
    const lng = localStorage.removeItem("selectedLanguage")
    const index = localStorage.removeItem("languageIndex")
    localStorage.removeItem("saas_client_token")
    localStorage.removeItem("saas_client_adminInfo")
    localStorage.removeItem("saas_client_expiryTime")
    localStorage.removeItem("saas_client_clientId")
    // localStorage.clear();
    dispatch(logOut());
    dispatch(resetStore())
    dispatch(removeProfile());
    dispatch(removeAuth())
    dispatch(removeNotification())
    navigate("/signIn");
    // localStorage.setItem("selectedLanguage", lng)
    // localStorage.setItem("languageIndex", index)

    // window.location.reload();

  };

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        if (profileExists) {
          navigate("/viewProfile");
        } else {
          navigate("/profile");
        }
      },
    },

    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        handleLogout();
      },
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${active
                ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                : "text-slate-600 dark:text-slate-300"
                } block     ${item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
                }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
