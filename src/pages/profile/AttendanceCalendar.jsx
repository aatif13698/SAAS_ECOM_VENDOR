// import React, { useState, useRef, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import { Listbox, Transition } from '@headlessui/react';
// import { MdCheckCircle, MdCancel, MdAccessTime, MdTimelapse, MdEventNote, MdBeachAccess, MdHome, MdWork } from 'react-icons/md';
// import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css';
// import dayjs from 'dayjs';
// import isoWeek from 'dayjs/plugin/isoWeek';
// import authService from '@/services/authService';
// import { useSelector } from 'react-redux';

// dayjs.extend(isoWeek);

// // Dummy data based on the schema (assuming one employee for simplicity)
// const dummyAttendanceData = [
//   {
//     employeeId: '658b1234567890abcdef1234', // Sample ObjectId
//     date: new Date('2025-12-01T00:00:00Z'),
//     punchIn: new Date('2025-12-01T09:00:00Z'),
//     punchOut: new Date('2025-12-01T17:00:00Z'),
//     totalWorkedMinutes: 480,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'present',
//     notes: 'On time',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-02T00:00:00Z'),
//     punchIn: new Date('2025-12-02T09:15:00Z'),
//     punchOut: new Date('2025-12-02T17:00:00Z'),
//     totalWorkedMinutes: 465,
//     expectedMinutes: 480,
//     lateInMinutes: 15,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'late',
//     notes: 'Traffic delay',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-03T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'absent',
//     notes: 'Sick leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-04T00:00:00Z'),
//     punchIn: new Date('2025-12-04T09:00:00Z'),
//     punchOut: new Date('2025-12-04T16:45:00Z'),
//     totalWorkedMinutes: 465,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 15,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'present',
//     notes: 'Left early for appointment',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-05T00:00:00Z'),
//     punchIn: new Date('2025-12-05T09:00:00Z'),
//     punchOut: new Date('2025-12-05T18:00:00Z'),
//     totalWorkedMinutes: 540,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 60,
//     overtimeType: 'normal',
//     status: 'present',
//     notes: 'Overtime work',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-06T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'weekend',
//     notes: '',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-07T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'holiday',
//     notes: 'Company holiday',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-08T00:00:00Z'),
//     punchIn: new Date('2025-12-08T09:00:00Z'),
//     punchOut: new Date('2025-12-08T13:00:00Z'),
//     totalWorkedMinutes: 240,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 240,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'half_day',
//     notes: 'Half day leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-09T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-10T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-11T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-12T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-13T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-14T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-15T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-16T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-17T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-18T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-19T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-20T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-21T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-22T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-23T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },
//   {
//     employeeId: '658b1234567890abcdef1234',
//     date: new Date('2025-12-24T00:00:00Z'),
//     punchIn: null,
//     punchOut: null,
//     totalWorkedMinutes: 0,
//     expectedMinutes: 480,
//     lateInMinutes: 0,
//     earlyOutMinutes: 0,
//     overtimeMinutes: 0,
//     overtimeType: 'none',
//     status: 'on_leave',
//     notes: 'Annual leave',
//   },


//   // Add more dummy entries as needed for other days...
// ];

// const views = [
//   { value: 'dayGridMonth', label: 'Month' },
//   { value: 'dayGridWeek', label: 'Week' },
// ];

// const years = Array.from({ length: 31 }, (_, i) => 2000 + i);
// const months = [
//   { value: 1, label: 'January' },
//   { value: 2, label: 'February' },
//   { value: 3, label: 'March' },
//   { value: 4, label: 'April' },
//   { value: 5, label: 'May' },
//   { value: 6, label: 'June' },
//   { value: 7, label: 'July' },
//   { value: 8, label: 'August' },
//   { value: 9, label: 'September' },
//   { value: 10, label: 'October' },
//   { value: 11, label: 'November' },
//   { value: 12, label: 'December' },
// ];
// const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

// const AttendanceCalendar = () => {

//   const { user: useData } = useSelector((state) => state.auth);

//   const calendarRef = useRef(null);
//   const [view, setView] = useState('dayGridMonth');
//   const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 23));

//   const currentYear = dayjs(currentDate).year();
//   const currentMonth = dayjs(currentDate).month() + 1;
//   const currentWeek = dayjs(currentDate).isoWeek();

//   // Map attendance to FullCalendar events
//   const events = dummyAttendanceData.map((att) => ({
//     title: '', // We'll use custom content
//     start: att.date,
//     allDay: true,
//     backgroundColor: getColor(att.status),
//     textColor: '#fff',
//     extendedProps: att,
//     borderColor: "#fff",
//     classNames: "rounded-md border border-2-gray-200"
//   }));

//   // Function to get background color based on status
//   function getColor(status) {
//     switch (status) {
//       case 'present': return '#58db5ebd'; // Green
//       case 'absent': return '#f44336cc'; // Red
//       case 'late': return '#ffbc5ad4'; // Orange
//       case 'half_day': return '#ffd558cc'; // Yellow
//       case 'holiday': return '#5db7ffd6'; // Blue
//       case 'weekend': return '#9e9e9e'; // Gray
//       case 'on_leave': return '#c09dffd6'; // Purple
//       default: return '#757575'; // Dark gray
//     }
//   }

//   // Function to get icon based on status
//   function getIcon(status) {
//     switch (status) {
//       case 'present': return <MdCheckCircle className="h-8 w-8 text-white" />;
//       case 'absent': return <MdCancel className="h-8 w-8 text-white" />;
//       case 'late': return <MdAccessTime className="h-8 w-8 text-white" />;
//       case 'half_day': return <MdTimelapse className="h-8 w-8 text-white" />;
//       case 'holiday': return <MdEventNote className="h-8 w-8 text-white" />;
//       case 'weekend': return <MdBeachAccess className="h-8 w-8 text-white" />;
//       case 'on_leave': return <MdHome className="h-8 w-8 text-white" />;
//       default: return <MdWork className="h-8 w-8 text-white" />;
//     }
//   }

//   // Function to get tooltip content
//   function getTooltipContent(att) {
//     return (
//       <div className="p-2 text-sm">
//         <p><strong>Status:</strong> {att.status.charAt(0).toUpperCase() + att.status.slice(1)}</p>
//         {att.lateInMinutes > 0 && <p><strong>Late In:</strong> {att.lateInMinutes} minutes</p>}
//         {att.earlyOutMinutes > 0 && <p><strong>Early Out:</strong> {att.earlyOutMinutes} minutes</p>}
//         {att.overtimeMinutes > 0 && <p><strong>Overtime:</strong> {att.overtimeMinutes} minutes ({att.overtimeType})</p>}
//         <p><strong>Total Worked:</strong> {att.totalWorkedMinutes} minutes</p>
//         {att.notes && <p><strong>Notes:</strong> {att.notes}</p>}
//       </div>
//     );
//   }

//   // Handle year change
//   const handleYearChange = (newYear) => {
//     let newDate;
//     if (view === 'dayGridMonth') {
//       newDate = dayjs(currentDate).year(newYear).toDate();
//     } else {
//       newDate = dayjs(currentDate).year(newYear).isoWeek(currentWeek).startOf('isoWeek').toDate();
//     }
//     setCurrentDate(newDate);
//   };

//   // Handle month change
//   const handleMonthChange = (newMonthValue) => {
//     const newDate = dayjs(currentDate).month(newMonthValue - 1).date(1).toDate();
//     setCurrentDate(newDate);
//   };

//   // Handle week change
//   const handleWeekChange = (newWeek) => {
//     const newDate = dayjs(currentDate).isoWeek(newWeek).startOf('isoWeek').toDate();
//     setCurrentDate(newDate);
//   };

//   // Update calendar when view or date changes
//   useEffect(() => {
//     if (calendarRef.current) {
//       const calendarApi = calendarRef.current.getApi();
//       calendarApi.changeView(view);
//       calendarApi.gotoDate(currentDate);
//     }
//   }, [view, currentDate]);


//   useEffect(() => {

//     if (useData?._id) {
//       getAttendanceOfEmployee(useData?._id);
//     }

//   }, [useData]);


//   async function getAttendanceOfEmployee(id) {

//     try {

//       const response = await authService.getAttendanceData(id);

//       console.log("attendance ", response?.data?.data);

//     } catch (error) {

//       console.log("error while getting attendance record", error);


//     }

//   }

//   return (
//     <div className="p-4 max-w-full mx-auto bg-white rounded-md">
//       {/* <h2 className="text-2xl font-bold mb-4">Attendance Calendar</h2> */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//         <div className="w-full sm:w-auto">
//           <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
//           <select
//             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={view}
//             onChange={(e) => setView(e.target.value)}
//           >
//             {views.map((v) => (
//               <option key={v.value} value={v.value}>
//                 {v.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="w-full sm:w-auto">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
//           <select
//             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={currentYear}
//             onChange={(e) => handleYearChange(parseInt(e.target.value))}
//           >
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//         {view === 'dayGridMonth' ? (
//           <div className="w-full sm:w-auto">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
//             <select
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               value={currentMonth}
//               onChange={(e) => handleMonthChange(parseInt(e.target.value))}
//             >
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ) : (
//           <div className="w-full sm:w-auto">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Week</label>
//             <select
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
//               value={currentWeek}
//               onChange={(e) => handleWeekChange(parseInt(e.target.value))}
//             >
//               {weeks.map((week) => (
//                 <option key={week} value={week}>
//                   Week {week}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin]}
//         initialView={view}
//         initialDate={currentDate}
//         events={events}
//         headerToolbar={{
//           left: 'prev,next today',
//           center: 'title',
//           right: '',
//         }}
//         height="auto"
//         editable={false}
//         eventContent={(arg) => {
//           const att = arg.event.extendedProps;
//           return (
//             <Tippy content={getTooltipContent(att)} interactive={false}>
//               <div className="flex flex-col items-center justify-center py-4  cursor-pointer">
//                 {getIcon(att.status)}
//                 <span className="text-xs text-black-900 font-medium mt-1">
//                   {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
//                 </span>
//               </div>
//             </Tippy>
//           );
//         }}
//         eventClick={(info) => {
//           console.log('Event details:', info.event.extendedProps);
//         }}
//       />
//     </div>
//   );
// };

// export default AttendanceCalendar;




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

const AttendanceCalendar = () => {
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
    if (!user?._id) return;

    const { start, end } = getDateRange();

    setLoading(true);
    setError(null);

    try {
      // Update your authService to accept clientId, startDate, endDate
      const response = await authService.getAttendanceData(
        user._id,
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
  }, [user, getDateRange]);

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