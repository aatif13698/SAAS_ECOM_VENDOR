import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { notifications } from "@/constant/data";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  UnreadNotification,
  UnreadNotificationCount,
  ViewParticularNotification,
} from "@/redux/slices/Notification/SuperAdminNotification";
import UserAvatar from "@/assets/images/all-img/user.png";

const Notification = () => {
  const { unreadNotificationList, unreadNotificationCount } = useSelector(
    (state) => state.SuperAdminNotification
  );
  const [refresh, setRefresh] = useState(0);
  const dispatch = useDispatch();
  const notifyLabel = () => {
    return (
      <span className="relative lg:h-[32px] lg:w-[32px] lg:bg-slate-100 text-slate-900 lg:dark:bg-slate-900 dark:text-white cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center">
        <Icon icon="heroicons-outline:bell" className="animate-tada" />
        <span className="absolute lg:right-0 lg:top-0 -top-2 -right-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
          {unreadNotificationCount?.count}
        </span>
      </span>
    );
  };
  useEffect(() => {
    // dispatch(UnreadNotification())
    // dispatch(UnreadNotificationCount());
    // dispatch(ViewParticularUser());
  }, [refresh]);
  // comment out this
  useEffect(() => {
    const interval = setInterval(() => {
      // dispatch(UnreadNotification());
      // dispatch(UnreadNotificationCount());
    }, 10000); // This interval will run every 10 seconds (10000 milliseconds)

    return () => clearInterval(interval); // Cleanup function to clear the interval
  }, [dispatch]);



  function timeAgo(createdAt) {
    const date = new Date(createdAt);
    const localTime = date.toLocaleString();
    const createdAtDate = new Date(localTime).getTime();
    const now = Date.now();
    const timeDifference = now - createdAtDate;
    const seconds = Math.floor(timeDifference / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year ${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month ${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
      return `${weeks} week ${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} days ${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour ${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second ${seconds > 1 ? 's' : ''} ago`;
    }
  }








  const navigate = useNavigate();
  const handleNotification = (item) => {
    dispatch(ViewParticularNotification(item._id)).then((res) =>
      setRefresh((prev) => prev + 1)
    );
    if (item?.notificationType == 1) {
      const stringifyId = JSON.parse(item?.importantId);
      const id = stringifyId?.userId;
      navigate("/view-vehicles", { state: { id } });
    }
    if (item?.notificationType == 2) {
      const stringifyId = JSON.parse(item?.importantId);
      const id = stringifyId?.id;

      navigate("/users-query", { state: { id } });
    }
    if (item?.notificationType == 3) {
      const stringifyId = JSON.parse(item?.importantId);
      const id = stringifyId?.id;

      navigate("/unknown-events", { state: { id } });
    }
    if (item?.notificationType == 4) {
      const stringifyId = JSON.parse(item?.importantId);
      const id = stringifyId?.id;

      navigate("/create-event", { state: { id } });
    }
    if (item?.notificationType == 5) {
      const stringifyId = JSON.parse(item?.importantId);
      const id = stringifyId?.withdrawRequestId;

      navigate("/withdraw-request", { state: { id } });
    }
    if (item?.notificationType == 6) {
      const stringifyId = JSON.parse(item?.importantId);
      const id = stringifyId?.id;

      navigate("/event-list", { state: { id } });
    }
  };

  return (
    <Dropdown
      classMenuItems="md:w-[300px] top-[58px] h-[500px] overflow-y-auto"
      label={notifyLabel()}
    >
      <div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
        <div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
          Notification
        </div>
        <div className="text-slate-800 dark:text-slate-200 text-xs md:text-right">
          <Link to="/notification-list" className="underline">
           View All
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {unreadNotificationList?.List?.slice()?.reverse()?.map((item, i) => (
          < Menu.Item key={i} >
            {({ active }) => (
              <div
                className={`${active
                  ? "bg-slate-100 dark:bg-slate-700 dark:bg-opacity-70 text-slate-800"
                  : "text-slate-600 dark:text-slate-300"
                  } block w-full px-4 py-2 text-sm  cursor-pointer `}
              >
                <div
                  className="flex ltr:text-left rtl:text-right"
                  onClick={() => handleNotification(item)}
                >
                  <div className="flex-none ltr:mr-3 rtl:ml-3">
                    <div className="h-8 w-8 bg-white rounded-full">
                      <img
                        src={item?.clinetId?.profileImage ? item?.clinetId?.profileImage : UserAvatar}
                        alt="img"
                        className={`${active ? " border-white" : " border-transparent"
                          } block w-full h-full object-cover rounded-full border`}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div
                      className={`${active
                        ? "text-slate-600 dark:text-slate-300"
                        : " text-slate-600 dark:text-slate-300"
                        } text-sm`}
                    >
                      {item.header}
                    </div>
                    <div
                      className={`${active
                        ? "text-slate-500 dark:text-slate-200"
                        : " text-slate-600 dark:text-slate-300"
                        } text-xs leading-4`}
                    >
                      {item.subHeader}
                    </div>
                    <div className="text-slate-400 dark:text-slate-400 text-xs mt-1">

                      {timeAgo(item.createdAt)}

                    </div>
                  </div>
                  {item.unread && (
                    <div className="flex-0">
                      <span className="h-[10px] w-[10px] bg-danger-500 border border-white dark:border-slate-400 rounded-full inline-block"></span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
      </div>
    </Dropdown >
  );
};

export default Notification;
