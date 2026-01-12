import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import leaveCategoryService from '@/services/leaveCategory/leaveCategory.service';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);



const LeaveStatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    withdrawn: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'
        }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

function LeaveApplication() {


  const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);

  console.log("leaveHistory", leaveHistory);



  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    halfDaySession: 'first_half',
    reason: '',
    attachment: null,
  });

  console.log("formData", formData);

  const [calculatedDays, setCalculatedDays] = useState(0);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = dayjs(formData.startDate);
      const end = dayjs(formData.endDate);

      if (end.isSameOrAfter(start)) {
        let days = end.diff(start, 'day') + 1;

        if (formData.isHalfDay) {
          days -= 0.5;
        }

        setCalculatedDays(days > 0 ? days : 0);
      } else {
        setCalculatedDays(0);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate, formData.isHalfDay]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calculatedDays <= 0) {
      alert('Please select valid start and end dates');
      return;
    }
    const clientId = localStorage.getItem("saas_client_clientId");
    const dataObject = {
      ...formData,
      totalDays: calculatedDays,
      clientId: clientId,
      employeeId: currentUser?._id
    };
    try {
      const response = await leaveCategoryService.applyLeave(dataObject);
      toast.success("Applied successfully");
      setFormData({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        halfDaySession: 'first_half',
        reason: '',
        attachment: null,
      });
      getLeavesAvailable(currentUser._id);
      getLeavesHistory(currentUser._id);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getLeavesAvailable(currentUser._id);
      getLeavesHistory(currentUser._id);
    }
  }, [currentUser]);


  async function getLeavesAvailable(id) {
    try {
      const response = await leaveCategoryService.getAllLeaveAvailable(id);
      setLeaveBalance(response?.data?.leaveBalance?.leaveCategories)
    } catch (error) {
      console.log("error", error);
    }
  }

  async function getLeavesHistory(id) {
    try {
      const response = await leaveCategoryService.getAllLeaveHistory(id);
      setLeaveHistory(response?.data?.leaveHistory)
      // setLeaveBalance(response?.data?.leaveBalance?.leaveCategories)
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 rounded-lg">
      {/* Header - Leave Balances */}
      <div className="bg-white border-b shadow-sm rounded-lg">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Leave Management</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {leaveBalance.map((leave) => (
              <div
                key={leave._id}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">{leave?.id?.name}</h3>
                  {/* <div className={`w-3 h-3 rounded-full ${leave.color}`}></div> */}
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">{Number(leave?.allocated) - Number(leave?.taken)}</span>
                  <span className="text-sm text-gray-500"> / {leave?.allocated}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Available</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Apply for Leave</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="leaveTypeId" className="block text-sm font-medium text-gray-700">
                      Leave Type *
                    </label>
                    <select
                      id="leaveTypeId"
                      name="leaveTypeId"
                      value={formData.leaveTypeId}
                      onChange={handleChange}
                      required
                      className="form-control py-2"
                    >
                      <option value="">Select leave type</option>
                      {leaveBalance.map((leave) => (
                        <option key={leave?._id} value={leave?.id?._id}>
                          {leave?.id?.name} ({Number(leave?.allocated) - Number(leave?.taken)} available)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Days</label>
                    <div className="form-control py-2"
                    >
                      {calculatedDays > 0 ? `${calculatedDays} day${calculatedDays !== 1 ? 's' : ''}` : '—'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="form-control py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate}
                      required
                      className="form-control py-2"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="isHalfDay"
                    name="isHalfDay"
                    type="checkbox"
                    checked={formData.isHalfDay}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isHalfDay" className="ml-2 block text-sm text-gray-700">
                    This is a half-day leave
                  </label>
                </div>

                {formData.isHalfDay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Session *</label>
                    <div className="mt-2 space-x-4">
                      {['first_half', 'second_half'].map((session) => (
                        <label key={session} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="halfDaySession"
                            value={session}
                            checked={formData.halfDaySession === session}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {session === 'first_half' ? 'First Half' : 'Second Half'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Reason *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="form-control py-2"
                    placeholder="Please provide a detailed reason for your leave request..."
                  />
                </div>

                {/* File upload - placeholder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attachment (Medical certificate, etc.)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right - History Table */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Leave History</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dates
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Days
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveHistory.map((leave) => (
                      <tr key={leave._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {leave?.leaveTypeId?.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {dayjs(leave.startDate).format('DD MMM')} — {dayjs(leave.endDate).format('DD MMM')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {leave.totalDays}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <LeaveStatusBadge status={leave.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leaveHistory.length === 0 && (
                <div className="py-12 text-center text-gray-500">No leave requests found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApplication;