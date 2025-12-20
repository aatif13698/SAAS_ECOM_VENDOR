



// import Tippy from "@tippyjs/react";
// import "tippy.js/dist/tippy.css";
// import "tippy.js/themes/light.css";
// import "tippy.js/themes/light-border.css";
// import "tippy.js/animations/shift-away.css";
// import "tippy.js/animations/scale-subtle.css";
// import "tippy.js/animations/perspective-extreme.css";
// import "tippy.js/animations/perspective-subtle.css";
// import "tippy.js/animations/perspective.css";
// import "tippy.js/animations/scale-extreme.css";
// import "tippy.js/animations/scale-subtle.css";
// import "tippy.js/animations/scale.css";
// import "tippy.js/animations/shift-away-extreme.css";
// import "tippy.js/animations/shift-away-subtle.css";
// import "tippy.js/animations/shift-away.css";
// import "tippy.js/animations/shift-toward-extreme.css";
// import "tippy.js/animations/shift-toward-subtle.css";
// import "tippy.js/animations/shift-toward.css";

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Icon from "@/components/ui/Icon";

// // import images
// import ProfileImage from "@/assets/images/users/user-1.jpg";
// import { useSelector } from "react-redux";
// import CustomDocumentSubmit from "./customDocumentSubmit";

// const ViewProfile = () => {
//   const navigate = useNavigate();
//   const { profileData: profile } = useSelector((state) => state.profile);
//   const { user: useData } = useSelector((state) => state.auth);

//   console.log("profile", profile);
//   console.log("useData", useData);



//   const [activeTab, setActiveTab] = useState("information");

//   function navigateHandler(e) {
//     e.preventDefault();
//     navigate("/profile");
//   }

//   const tippy = {
//     className: "btn btn-dark",
//     placement: "top",
//     arrow: true,
//     theme: "dark",
//     animation: "shift-away",
//     trigger: "mouseenter focus",
//     interactive: false,
//     allowHTML: false,
//     maxWidth: 300,
//     duration: 200,
//   };
//   const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
//   const roleId = adminInfo?.roleId;

//   return (
//     <div>
//       <div className="space-y-5 profile-page min-h-[80vh] z-0">
//         <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-0">
//           <div className="bg-emerald-400 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
//           <div className="profile-box flex-none md:text-start text-center">
//             <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
//               <div className="flex-none">
//                 <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
//                   <img
//                     src={profile?.profileImage ? profile?.profileImage : ProfileImage}
//                     alt=""
//                     className="w-full h-full object-cover rounded-full"
//                   />
//                   <Link
//                     to="#"
//                     className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
//                   >
//                     <div className="custom-tippy">
//                       <Tippy
//                         content="Edit Profile"
//                         placement={tippy.placement}
//                         arrow={tippy.arrow}
//                         theme={tippy.theme}
//                         animation={tippy.animation}
//                         trigger={tippy.trigger}
//                         interactive={tippy.interactive}
//                         allowHTML={tippy.allowHTML}
//                         maxWidth={tippy.maxWidth}
//                         duration={tippy.duration}
//                       >
//                         <button onClick={navigateHandler}>
//                           <Icon icon="heroicons:pencil-square" />
//                         </button>
//                       </Tippy>
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
//                   {profile && profile?.firstName + " " + profile?.lastName}
//                 </div>
//                 <div className="text-sm font-light text-slate-600 dark:text-slate-400">
//                   {useData?.roleId == 1 ? "Admin" : profile?.roleName}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-12 ">
//           {/* Navigation/Tabs Section */}
//           <div className="col-span-12">
//             <nav
//               className="flex space-x-4  "
//               role="tablist"
//               aria-label="Profile sections"
//             >
//               <button
//                 className={`font-medium text-sm uppercase tracking-wide  ${activeTab === "information"
//                     ? "text-emerald-500 border-2 rounded-2xl rounded-br-none rounded-bl-none px-2 py-2 border-emerald-500 bg-emerald-50"
//                     : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-2 py-2"
//                   }`}
//                 onClick={() => setActiveTab("information")}
//                 role="tab"
//                 aria-selected={activeTab === "information"}
//                 aria-controls="information-tab"
//                 id="information-tab-button"
//               >
//                 Information
//               </button>

//               {
//                 useData?.roleId == 1 ? null :
//                   <button
//                     className={`flex items-center space-x-1 font-medium text-sm uppercase tracking-wide  ${activeTab === "documents"
//                         ? "text-emerald-500 border-2 rounded-2xl rounded-br-none rounded-bl-none px-2 py-2 border-emerald-500 bg-emerald-50"
//                         : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-2 py-2"
//                       }`}
//                     onClick={() => setActiveTab("documents")}
//                     role="tab"
//                     aria-selected={activeTab === "documents"}
//                     aria-controls="documents-tab"
//                     id="documents-tab-button"
//                   >
//                     <Icon icon="heroicons:document-text" className="w-4 h-4" />
//                     <span>Documents</span>
//                   </button>
//               }

//             </nav>
//           </div>

//           {/* Content Section */}
//           <div className="col-span-12">
//             {activeTab === "information" && (
//               <div
//                 className="p-4 bg-white dark:bg-slate-800 rounded-lg rounded-tl-none shadow-md"
//                 role="tabpanel"
//                 aria-labelledby="information-tab-button"
//                 id="information-tab"
//               >
//                 <ul className="space-y-6">
//                   <li className="flex items-start space-x-3 rtl:space-x-reverse">
//                     <div className="flex-none text-2xl text-slate-600 dark:text-slate-300 mt-1">
//                       <Icon icon="heroicons:envelope" aria-hidden="true" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px] font-semibold">
//                         Email
//                       </div>
//                       <a
//                         href={`mailto:${profile?.email}`}
//                         className="text-base text-slate-600 dark:text-slate-50 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         aria-label={`Email ${profile?.email}`}
//                       >
//                         {profile?.email}
//                       </a>
//                     </div>
//                   </li>

//                   <li className="flex items-start space-x-3 rtl:space-x-reverse">
//                     <div className="flex-none text-2xl text-slate-600 dark:text-slate-300 mt-1">
//                       <Icon icon="heroicons:phone-arrow-up-right" aria-hidden="true" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px] font-semibold">
//                         Phone
//                       </div>
//                       <a
//                         href={`tel:${profile?.phone}`}
//                         className="text-base text-slate-600 dark:text-slate-50 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         aria-label={`Call ${profile?.phone}`}
//                       >
//                         {profile?.phone}
//                       </a>
//                     </div>
//                   </li>

//                   <li className="flex items-start space-x-3 rtl:space-x-reverse">
//                     <div className="flex-none text-2xl text-slate-600 dark:text-slate-300 mt-1">
//                       <Icon icon="heroicons:map" aria-hidden="true" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px] font-semibold">
//                         Location
//                       </div>
//                       <div className="text-base text-slate-600 dark:text-slate-50">
//                         {profile?.address}
//                       </div>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             )}
//             {activeTab === "documents" && (
//               <>
//                 {
//                   useData?.roleId == 1 ? null :
//                     <div
//                       className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md"
//                       role="tabpanel"
//                       aria-labelledby="documents-tab-button"
//                       id="documents-tab"
//                     >

//                       {/* <p className="text-slate-600 dark:text-slate-300">Documents content will be displayed here.</p> */}

//                       <CustomDocumentSubmit roleId={useData?.role?._id} userId={useData?._id}  />
//                     </div>
//                 }
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProfile;



// new code 

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/animations/perspective-extreme.css";
import "tippy.js/animations/perspective-subtle.css";
import "tippy.js/animations/perspective.css";
import "tippy.js/animations/scale-extreme.css";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/animations/scale.css";
import "tippy.js/animations/shift-away-extreme.css";
import "tippy.js/animations/shift-away-subtle.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/shift-toward-extreme.css";
import "tippy.js/animations/shift-toward-subtle.css";
import "tippy.js/animations/shift-toward.css";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { useSelector } from "react-redux";
import CustomDocumentSubmit from "./customDocumentSubmit";

// NEW IMPORTS FOR PUNCH IN/OUT (without React Query)
import axios from "axios";
import { Button, Alert, Box, CircularProgress, Tooltip } from "@mui/material";

// import images
import ProfileImage from "@/assets/images/users/user-1.jpg";
import authService from "@/services/authService";
import toast from "react-hot-toast";

const ViewProfile = () => {
  const navigate = useNavigate();
  const { profileData: profile } = useSelector((state) => state.profile);
  const { user: useData } = useSelector((state) => state.auth);

  console.log("profile", profile);
  console.log("useData", useData);

  const [activeTab, setActiveTab] = useState("information");

  // === PUNCH IN/OUT STATES (Fresh check every visit) ===
  const [canPunchIn, setCanPunchIn] = useState(false);
  const [punchMessage, setPunchMessage] = useState("");
  const [checkingPunch, setCheckingPunch] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);
  const [punchSuccess, setPunchSuccess] = useState("");
  const [punchError, setPunchError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch punch-in eligibility every time page loads
  useEffect(() => {
    const checkCanPunchIn = async () => {
      if (useData?.roleId === 1) {
        setCheckingPunch(false);
        return;
      }

      setCheckingPunch(true);
      setPunchSuccess("");
      setPunchError("");

      try {
        const res = await authService.check(useData?._id);
        setCanPunchIn(res.canPunch === true);
        setPunchMessage(res.message || "");
      } catch (err) {
        setPunchError(err.response?.data?.message || "Failed to check punch-in status");
        setCanPunchIn(false);
      } finally {
        setCheckingPunch(false);
      }
    };

    checkCanPunchIn();
  }, [useData?.roleId]); // Re-run if token or role changes

  // Handle punch actions
  const handlePunch = async (type) => {
    setPunchLoading(true);
    setPunchSuccess("");
    setPunchError("");

    try {
      const clientId = localStorage.getItem("saas_client_clientId");
      const dataObject = {
        employeeId: useData?._id, clientId: clientId
      }
      const response = await authService.punch(type, dataObject);

      console.log("resposne attendance", response);

      // const res = await axios.post(`/api/attendance/punch-${type}`, {}, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // setPunchSuccess(res.data.message || "Success!");
      // // Force fresh check after action
      // if (type === "in") {
      //   setCanPunchIn(false);
      //   setPunchMessage("Already punched in today");
      // }
    } catch (err) {
      // setPunchError(err.response?.data?.message || "Action failed");
      toast.error(err.response?.data?.message || "Action failed")
    } finally {
      setPunchLoading(false);
    }
  };

  function navigateHandler(e) {
    e.preventDefault();
    navigate("/profile");
  }

  const tippy = {
    placement: "top",
    arrow: true,
    theme: "dark",
    animation: "shift-away",
  };

  return (
    <div>
      <div className="space-y-5 profile-page min-h-[80vh] z-0">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-0">
          <div className="bg-emerald-400 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>

          {/* Profile Info */}
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                    src={profile?.profileImage ? profile?.profileImage : ProfileImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  <Link
                    to="#"
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  >
                    <div className="custom-tippy">
                      <Tippy content="Edit Profile" {...tippy}>
                        <button onClick={navigateHandler}>
                          <Icon icon="heroicons:pencil-square" />
                        </button>
                      </Tippy>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {profile && profile?.firstName + " " + profile?.lastName}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {useData?.roleId == 1 ? "Admin" : profile?.roleName}
                </div>
              </div>
            </div>
          </div>

          {/* Punch In/Out Buttons - Only for employees */}
          {/* {useData?.roleId !== 1 && (
            <div className="flex-none text-end">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                {checkingPunch ? (
                  <CircularProgress size={40} />
                ) : (
                  <>
                    {
                      canPunchIn ?
                        <Tooltip title={!canPunchIn ? punchMessage : ""} arrow placement="left">
                          <span>
                            <Button
                              variant="contained"
                              color="success"
                              size="large"
                              onClick={() => handlePunch("in")}
                              disabled={!canPunchIn || punchLoading}
                              startIcon={punchLoading ? <CircularProgress size={20} /> : <Icon icon="heroicons:clock" />}
                            >
                              Punch In
                            </Button>
                          </span>
                        </Tooltip> : ""
                    }
                    {
                      canPunchIn ? null :
                        <Button
                          variant="contained"
                          color="warning"
                          size="large"
                          onClick={() => handlePunch("out")}
                          disabled={punchLoading}
                          startIcon={punchLoading ? <CircularProgress size={20} /> : <Icon icon="heroicons:arrow-right-on-rectangle" />}
                        >
                          Punch Out
                        </Button>
                    }
                  </>
                )}

                {punchSuccess && <Alert severity="success">{punchSuccess}</Alert>}
                {punchError && <Alert severity="error">{punchError}</Alert>}
              </Box>
            </div>
          )} */}
        </div>

        {/* Tabs & Content - UNCHANGED */}
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <nav className="flex space-x-4" role="tablist" aria-label="Profile sections">
              <button
                className={`font-medium text-sm uppercase tracking-wide ${activeTab === "information"
                  ? "text-emerald-500 border-2 rounded-2xl rounded-br-none rounded-bl-none px-2 py-2 border-emerald-500 bg-emerald-50"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-2 py-2"
                  }`}
                onClick={() => setActiveTab("information")}
              >
                Information
              </button>

              {useData?.roleId !== 1 && (
                <button
                  className={`flex items-center space-x-1 font-medium text-sm uppercase tracking-wide ${activeTab === "documents"
                    ? "text-emerald-500 border-2 rounded-2xl rounded-br-none rounded-bl-none px-2 py-2 border-emerald-500 bg-emerald-50"
                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-2 py-2"
                    }`}
                  onClick={() => setActiveTab("documents")}
                >
                  <Icon icon="heroicons:document-text" className="w-4 h-4" />
                  <span>Documents</span>
                </button>
              )}
            </nav>
          </div>

          <div className="col-span-12">
            {activeTab === "information" && (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg rounded-tl-none shadow-md">
                <ul className="space-y-6">
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300 mt-1">
                      <Icon icon="heroicons:envelope" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px] font-semibold">
                        Email
                      </div>
                      <a href={`mailto:${profile?.email}`} className="text-base text-slate-600 dark:text-slate-50 hover:underline">
                        {profile?.email}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300 mt-1">
                      <Icon icon="heroicons:phone-arrow-up-right" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px] font-semibold">
                        Phone
                      </div>
                      <a href={`tel:${profile?.phone}`} className="text-base text-slate-600 dark:text-slate-50 hover:underline">
                        {profile?.phone}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300 mt-1">
                      <Icon icon="heroicons:map" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px] font-semibold">
                        Location
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-50">
                        {profile?.address}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "documents" && useData?.roleId !== 1 && (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <CustomDocumentSubmit roleId={useData?.role?._id} userId={useData?._id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;