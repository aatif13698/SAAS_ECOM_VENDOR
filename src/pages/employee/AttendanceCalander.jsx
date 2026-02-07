

import React, { useState, useRef, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Listbox, Transition } from '@headlessui/react';
import {
  MdCheckCircle, MdCancel, MdAccessTime, MdTimelapse,
  MdEventNote, MdBeachAccess, MdHome, MdWork
} from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useSelector } from 'react-redux';
import authService from '@/services/authService';

dayjs.extend(isoWeek);

const AttendanceCalendar = ({employee}) => {
    console.log("employee", employee);
    
  const { user } = useSelector((state) => state.auth);
  const calendarRef = useRef(null);

  const [view, setView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentYear = dayjs(currentDate).year();
  const currentMonth = dayjs(currentDate).month() + 1;
  const currentWeek = dayjs(currentDate).isoWeek();

  // Calculate start and end date for current view
  const getDateRange = useCallback(() => {
    if (view === 'dayGridMonth') {
      const start = dayjs(currentDate).startOf('month').format('YYYY-MM-DD');
      const end = dayjs(currentDate).endOf('month').format('YYYY-MM-DD');
      return { start, end };
    } else {
      const start = dayjs(currentDate).startOf('isoWeek').format('YYYY-MM-DD');
      const end = dayjs(currentDate).endOf('isoWeek').format('YYYY-MM-DD');
      return { start, end };
    }
  }, [view, currentDate]);

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    if (!employee?._id) return;

    const { start, end } = getDateRange();

    setLoading(true);
    setError(null);

    try {
      // Update your authService to accept clientId, startDate, endDate
      const response = await authService.getAttendanceData(
        employee._id,
        // user.clientId || 'your-client-id', // ← replace with actual clientId source
        start,
        end
      );

      setAttendanceData(response?.data?.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [employee, getDateRange]);

  // Fetch when view or date changes
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Sync calendar when view/date changes
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.changeView(view);
      api.gotoDate(currentDate);
    }
  }, [view, currentDate]);

  // Map attendance to FullCalendar events
  const events = attendanceData.map((att) => ({
    title: '',
    start: new Date(att.date),
    allDay: true,
    backgroundColor: getColor(att.status),
    textColor: '#fff',
    extendedProps: att,
    borderColor: '#fff',
    classNames: 'rounded-md border-2 border-white',
  }));

  function getColor(status) {
    const colors = {
      present: '#4ade80cc',
      absent: '#f87171cc',
      late: '#fb923ccc',
      half_day: '#facc15cc',
      holiday: '#60a5facc',
      weekend: '#9ca3afcc',
      on_leave: '#a78bfacc',
    };
    return colors[status] || '#6b7280cc';
  }

  function getIcon(status) {
    const icons = {
      present: <MdCheckCircle className="h-8 w-8 text-white" />,
      absent: <MdCancel className="h-8 w-8 text-white" />,
      late: <MdAccessTime className="h-8 w-8 text-white" />,
      half_day: <MdTimelapse className="h-8 w-8 text-white" />,
      holiday: <MdEventNote className="h-8 w-8 text-white" />,
      weekend: <MdBeachAccess className="h-8 w-8 text-white" />,
      on_leave: <MdHome className="h-8 w-8 text-white" />,
    };
    return icons[status] || <MdWork className="h-8 w-8 text-white" />;
  }

  function getTooltipContent(att) {
    console.log("content", att);
    
    return (
      <div className="text-sm p-3 bg-black shadow-xl">
        <p><strong>Status:</strong> {att.status.replace('_', ' ')}</p>
        {att.punchIn && <p><strong>Punch In:</strong> {dayjs(att.punchIn).format('HH:mm')}</p>}
        {att.punchOut && <p><strong>Punch Out:</strong> {dayjs(att.punchOut).format('HH:mm')}</p>}
        {att.lateInMinutes > 0 && <p><strong>Late:</strong> {att.lateInMinutes} min</p>}
        {att.earlyOutMinutes > 0 && <p><strong>Early Out:</strong> {att.earlyOutMinutes} min</p>}
        {att.overtimeMinutes > 0 && <p><strong>Overtime:</strong> {att.overtimeMinutes} min ({att.overtimeType})</p>}
        <p><strong>Worked:</strong> {att.totalWorkedMinutes} min</p>
        {att.notes && <p><strong>Notes:</strong> {att.notes}</p>}
      </div>
    );
  }

  const handleYearChange = (newYear) => {
    setCurrentDate(dayjs(currentDate).year(newYear).toDate());
  };

  const handleMonthChange = (newMonth) => {
    setCurrentDate(dayjs(currentDate).month(newMonth - 1).date(1).toDate());
  };

  const handleWeekChange = (newWeek) => {
    setCurrentDate(dayjs(currentDate).isoWeek(newWeek).startOf('isoWeek').toDate());
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex flex-wrap gap-4 mb-6">
        {/* View Mode */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">View</label>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="dayGridMonth">Month</option>
            <option value="dayGridWeek">Week</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
          <select
            value={currentYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {Array.from({ length: 10 }, (_, i) => 2023 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {view === 'dayGridMonth' ? (
          /* Month */
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
            <select
              value={currentMonth}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        ) : (
          /* Week */
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Week</label>
            <select
              value={currentWeek}
              onChange={(e) => handleWeekChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: 53 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && <div className="text-center py-10 text-gray-500">Loading attendance...</div>}
      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView={view}
        initialDate={currentDate}
        events={events}
        height="auto"
        editable={false}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        eventContent={(arg) => {
          const att = arg.event.extendedProps;
          return (
            <Tippy content={getTooltipContent(att)} interactive={false} placement="top">
              <div className="flex flex-col items-center justify-center py-3 cursor-pointer hover:scale-105 transition-transform">
                {getIcon(att.status)}
                <span className="text-[10px] font-medium text-white mt-1 tracking-wide">
                  {att.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </Tippy>
          );
        }}
        eventClick={(info) => console.log(info.event.extendedProps)}
      />
    </div>
  );
};

export default AttendanceCalendar;