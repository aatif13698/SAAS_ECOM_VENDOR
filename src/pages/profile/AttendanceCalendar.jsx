import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Listbox, Transition } from '@headlessui/react';
import { MdCheckCircle, MdCancel, MdAccessTime, MdTimelapse, MdEventNote, MdBeachAccess, MdHome, MdWork } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

// Dummy data based on the schema (assuming one employee for simplicity)
const dummyAttendanceData = [
  {
    employeeId: '658b1234567890abcdef1234', // Sample ObjectId
    date: new Date('2025-12-01T00:00:00Z'),
    punchIn: new Date('2025-12-01T09:00:00Z'),
    punchOut: new Date('2025-12-01T17:00:00Z'),
    totalWorkedMinutes: 480,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'present',
    notes: 'On time',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-02T00:00:00Z'),
    punchIn: new Date('2025-12-02T09:15:00Z'),
    punchOut: new Date('2025-12-02T17:00:00Z'),
    totalWorkedMinutes: 465,
    expectedMinutes: 480,
    lateInMinutes: 15,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'late',
    notes: 'Traffic delay',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-03T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'absent',
    notes: 'Sick leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-04T00:00:00Z'),
    punchIn: new Date('2025-12-04T09:00:00Z'),
    punchOut: new Date('2025-12-04T16:45:00Z'),
    totalWorkedMinutes: 465,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 15,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'present',
    notes: 'Left early for appointment',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-05T00:00:00Z'),
    punchIn: new Date('2025-12-05T09:00:00Z'),
    punchOut: new Date('2025-12-05T18:00:00Z'),
    totalWorkedMinutes: 540,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 60,
    overtimeType: 'normal',
    status: 'present',
    notes: 'Overtime work',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-06T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'weekend',
    notes: '',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-07T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'holiday',
    notes: 'Company holiday',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-08T00:00:00Z'),
    punchIn: new Date('2025-12-08T09:00:00Z'),
    punchOut: new Date('2025-12-08T13:00:00Z'),
    totalWorkedMinutes: 240,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 240,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'half_day',
    notes: 'Half day leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-09T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-10T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-11T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-12T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-13T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-14T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-15T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-16T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-17T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-18T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-19T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-20T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-21T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-22T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-23T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  {
    employeeId: '658b1234567890abcdef1234',
    date: new Date('2025-12-24T00:00:00Z'),
    punchIn: null,
    punchOut: null,
    totalWorkedMinutes: 0,
    expectedMinutes: 480,
    lateInMinutes: 0,
    earlyOutMinutes: 0,
    overtimeMinutes: 0,
    overtimeType: 'none',
    status: 'on_leave',
    notes: 'Annual leave',
  },
  
  
  // Add more dummy entries as needed for other days...
];

const views = [
  { value: 'dayGridMonth', label: 'Month' },
  { value: 'dayGridWeek', label: 'Week' },
];

const years = Array.from({ length: 31 }, (_, i) => 2000 + i);
const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];
const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

const AttendanceCalendar = () => {
  const calendarRef = useRef(null);
  const [view, setView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 23));

  const currentYear = dayjs(currentDate).year();
  const currentMonth = dayjs(currentDate).month() + 1;
  const currentWeek = dayjs(currentDate).isoWeek();

  // Map attendance to FullCalendar events
  const events = dummyAttendanceData.map((att) => ({
    title: '', // We'll use custom content
    start: att.date,
    allDay: true,
    backgroundColor: getColor(att.status),
    textColor: '#fff',
    extendedProps: att,
    borderColor: "#fff",
    classNames: "rounded-md border border-2-gray-200"
  }));

  // Function to get background color based on status
  function getColor(status) {
    switch (status) {
      case 'present': return '#58db5ebd'; // Green
      case 'absent': return '#f44336cc'; // Red
      case 'late': return '#ffbc5ad4'; // Orange
      case 'half_day': return '#ffd558cc'; // Yellow
      case 'holiday': return '#5db7ffd6'; // Blue
      case 'weekend': return '#9e9e9e'; // Gray
      case 'on_leave': return '#c09dffd6'; // Purple
      default: return '#757575'; // Dark gray
    }
  }

  // Function to get icon based on status
  function getIcon(status) {
    switch (status) {
      case 'present': return <MdCheckCircle className="h-8 w-8 text-white" />;
      case 'absent': return <MdCancel className="h-8 w-8 text-white" />;
      case 'late': return <MdAccessTime className="h-8 w-8 text-white" />;
      case 'half_day': return <MdTimelapse className="h-8 w-8 text-white" />;
      case 'holiday': return <MdEventNote className="h-8 w-8 text-white" />;
      case 'weekend': return <MdBeachAccess className="h-8 w-8 text-white" />;
      case 'on_leave': return <MdHome className="h-8 w-8 text-white" />;
      default: return <MdWork className="h-8 w-8 text-white" />;
    }
  }

  // Function to get tooltip content
  function getTooltipContent(att) {
    return (
      <div className="p-2 text-sm">
        <p><strong>Status:</strong> {att.status.charAt(0).toUpperCase() + att.status.slice(1)}</p>
        {att.lateInMinutes > 0 && <p><strong>Late In:</strong> {att.lateInMinutes} minutes</p>}
        {att.earlyOutMinutes > 0 && <p><strong>Early Out:</strong> {att.earlyOutMinutes} minutes</p>}
        {att.overtimeMinutes > 0 && <p><strong>Overtime:</strong> {att.overtimeMinutes} minutes ({att.overtimeType})</p>}
        <p><strong>Total Worked:</strong> {att.totalWorkedMinutes} minutes</p>
        {att.notes && <p><strong>Notes:</strong> {att.notes}</p>}
      </div>
    );
  }

  // Handle year change
  const handleYearChange = (newYear) => {
    let newDate;
    if (view === 'dayGridMonth') {
      newDate = dayjs(currentDate).year(newYear).toDate();
    } else {
      newDate = dayjs(currentDate).year(newYear).isoWeek(currentWeek).startOf('isoWeek').toDate();
    }
    setCurrentDate(newDate);
  };

  // Handle month change
  const handleMonthChange = (newMonthValue) => {
    const newDate = dayjs(currentDate).month(newMonthValue - 1).date(1).toDate();
    setCurrentDate(newDate);
  };

  // Handle week change
  const handleWeekChange = (newWeek) => {
    const newDate = dayjs(currentDate).isoWeek(newWeek).startOf('isoWeek').toDate();
    setCurrentDate(newDate);
  };

  // Update calendar when view or date changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      calendarApi.gotoDate(currentDate);
    }
  }, [view, currentDate]);

  return (
    <div className="p-4 max-w-full mx-auto bg-white rounded-md">
      {/* <h2 className="text-2xl font-bold mb-4">Attendance Calendar</h2> */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            {views.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={currentYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {view === 'dayGridMonth' ? (
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={currentMonth}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Week</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              value={currentWeek}
              onChange={(e) => handleWeekChange(parseInt(e.target.value))}
            >
              {weeks.map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView={view}
        initialDate={currentDate}
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
        editable={false}
        eventContent={(arg) => {
          const att = arg.event.extendedProps;
          return (
            <Tippy content={getTooltipContent(att)} interactive={false}>
              <div className="flex flex-col items-center justify-center py-4  cursor-pointer">
                {getIcon(att.status)}
                <span className="text-xs text-black-900 font-medium mt-1">
                  {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                </span>
              </div>
            </Tippy>
          );
        }}
        eventClick={(info) => {
          console.log('Event details:', info.event.extendedProps);
        }}
      />
    </div>
  );
};

export default AttendanceCalendar;