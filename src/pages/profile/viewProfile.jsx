


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

// import images
import ProfileImage from "@/assets/images/users/user-1.jpg";
import authService from "@/services/authService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AttendanceCalendar from "./AttendanceCalendar";
import Leaves from "./LeaveApplication";
import LeaveApplication from "./LeaveApplication";

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
  const [isPunchDay, setIsPunchDay] = useState(false);

  const [todayAttendanceData, setTodayAttendanceData] = useState(null);

  console.log("todayAttendanceData", todayAttendanceData);

  // Current time state for live clock
  const [currentTime, setCurrentTime] = useState(formatTime12HourLocal(new Date().toISOString()));

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime12HourLocal(new Date().toISOString()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        if (res.canPunch === false) {
          setIsPunchDay(false)
        } else {
          setIsPunchDay(true)
        }

        if (res.canPunchIn === false) {
          setCanPunchIn(false);
          setTodayAttendanceData(res?.attendance);
        } else if (res.canPunchIn === true) {
          setCanPunchIn(true);
        }
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

  function formatTime12HourLocal(isoString) {
    const date = new Date(isoString);

    let hours = date.getHours();     // Uses local timezone (IST in your case)
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;      // 0 should be 12

    // Add leading zero to minutes
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  }


  const handlePunchOut = () => {

    Swal.fire({
      title: `Are you Sure Want to punch-out`,
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handlePunch("out")
      }
    });
  };

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


      setTodayAttendanceData(response?.attendance)

      console.log("resposne attendance", response);
      setCanPunchIn(false);

      toast.success(response?.message);
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
      <div className=" profile-page min-h-[80vh] z-0">
        <div className=" profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg rounded-br-none rounded-bl-none bg-white dark:bg-slate-800 lg:flex lg:space-y-0 mb-0 justify-between items-end relative z-0">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>

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




        </div>
        {/* Punch In/Out Section - Only for employees */}
        {useData?.roleId !== 1 && (
          <div className="flex-none bg-white text-end rounded-lg mb-5">
            <div className="flex flex-col items-start gap-2 p-4  rounded-tr-md ">
              {checkingPunch ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-emerald-500 border-opacity-25 border-t-emerald-700"></div>
                </div>
              ) : (
                <div className="flex md:flex-row flex-col gap-2 justify-between w-full items-start">
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Icon icon="heroicons:clock" className="w-5 h-5" />
                      <span>Current Time: {currentTime}</span>
                    </div>
                    {todayAttendanceData && todayAttendanceData?.punchIn && (
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">PUNCH-IN:</span>{" "}
                        <span>{formatTime12HourLocal(todayAttendanceData?.punchIn)}</span>
                      </div>
                    )}
                    {todayAttendanceData && (
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">PUNCH-OUT:</span>{" "}
                        <span>{todayAttendanceData?.punchOut ? formatTime12HourLocal(todayAttendanceData?.punchOut) : "NOT YET"}</span>
                      </div>
                    )}
                  </div>

                  <div>

                    {
                      isPunchDay ?
                        <>
                          {canPunchIn ? (
                            <button
                              className={`flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-lg shadow-md transition-all duration-200 ${!canPunchIn || punchLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                                }`}
                              onClick={() => handlePunch("in")}
                              disabled={!canPunchIn || punchLoading}
                            >
                              {punchLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-25 border-t-white"></div>
                              ) : (
                                <Icon icon="heroicons:clock" className="w-5 h-5" />
                              )}
                              Punch In
                            </button>
                          ) : (
                            ""
                          )}
                          {!canPunchIn && (
                            <button
                              className={`flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-lg shadow-md transition-all duration-200 ${punchLoading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                                }`}
                              onClick={() => handlePunchOut()}
                              disabled={punchLoading}
                            >
                              {punchLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-25 border-t-white"></div>
                              ) : (
                                <Icon icon="heroicons:arrow-right-on-rectangle" className="w-5 h-5" />
                              )}
                              Punch Out
                            </button>
                          )}

                        </> :

                        <div>
                          Holiday Today !
                        </div>
                    }

                  </div>
                </div>


              )}

              {punchSuccess && (
                <div className="p-2 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                  {punchSuccess}
                </div>
              )}
              {punchError && (
                <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                  {punchError}
                </div>
              )}
            </div>
          </div>
        )}
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

               {useData?.roleId !== 1 && (
                <button
                  className={`flex items-center space-x-1 font-medium text-sm uppercase tracking-wide ${activeTab === "attendance"
                    ? "text-emerald-500 border-2 rounded-2xl rounded-br-none rounded-bl-none px-2 py-2 border-emerald-500 bg-emerald-50"
                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-2 py-2"
                    }`}
                  onClick={() => setActiveTab("attendance")}
                >
                  <Icon icon="heroicons:document-text" className="w-4 h-4" />
                  <span>Attendance</span>
                </button>
              )}

              {useData?.roleId !== 1 && (
                <button
                  className={`flex items-center space-x-1 font-medium text-sm uppercase tracking-wide ${activeTab === "leaves"
                    ? "text-emerald-500 border-2 rounded-2xl rounded-br-none rounded-bl-none px-2 py-2 border-emerald-500 bg-emerald-50"
                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-2 py-2"
                    }`}
                  onClick={() => setActiveTab("leaves")}
                >
                  <Icon icon="heroicons:document-text" className="w-4 h-4" />
                  <span>Leaves</span>
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

             {activeTab === "attendance" && useData?.roleId !== 1 && (
              <AttendanceCalendar />
            )}

             {activeTab === "leaves" && useData?.roleId !== 1 && (
              <LeaveApplication />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;