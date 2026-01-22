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

function Leave({empId}) {


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
    if (empId) {
      getLeavesAvailable(empId);
      getLeavesHistory(empId);
    }
  }, [empId]);


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
    <div className=" bg-gray-50 pb-12 rounded-lg">
      {/* Header - Leave Balances */}
      <div className="bg-white border-b shadow-sm rounded-lg">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Leave Management</h1> */}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            { leaveBalance && leaveBalance?.map((leave) => (
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
      <div className=" mx-auto text-left py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="">
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
                    {leaveHistory && leaveHistory.map((leave) => (
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

export default Leave;