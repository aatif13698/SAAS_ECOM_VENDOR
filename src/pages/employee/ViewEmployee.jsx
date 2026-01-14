import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import employeeService from '@/services/employee/employee.service';

// Use environment variable with fallback (but better to enforce in production)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!SECRET_KEY) {
    console.warn('⚠️ VITE_ENCRYPTION_KEY is not set in environment variables');
}

const decryptId = (encryptedId) => {
    if (!encryptedId) return null;
    try {
        const decoded = decodeURIComponent(encryptedId);
        const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || null;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

function ViewEmployee() {
    const { id: encryptedId } = useParams();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('attendance');

    const fetchEmployee = useCallback(async (id) => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await employeeService.getOne(id);
            setEmployee(response?.data ?? null);
        } catch (err) {
            console.error('Failed to fetch employee:', err);
            setError('Failed to load employee data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const decryptedId = decryptId(encryptedId);
        if (decryptedId) {
            fetchEmployee(decryptedId);
        } else {
            setError('Invalid employee link');
            setLoading(false);
        }
    }, [encryptedId, fetchEmployee]);

    const tabs = [
        { id: 'attendance', label: 'Attendance' },
        { id: 'leaves', label: 'Leaves' },
        { id: 'assets', label: 'Assets' },
        { id: 'documents', label: 'Documents' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">!</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="text-center text-gray-600">
                    <h2 className="text-2xl font-semibold mb-2">Employee not found</h2>
                    <p>The requested employee could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                {/* Profile Header */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 px-6 py-10 sm:px-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative flex-shrink-0">
                                <img
                                    src={employee.profileImage || '/default-avatar.png'}
                                    alt={`${employee.firstName} ${employee.lastName}`}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                    onError={(e) => {
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                                <span
                                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-white ${employee.isActive ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                />
                            </div>

                            <div className="text-center sm:text-left text-white">
                                <h1 className="text-3xl font-bold">
                                    {employee.firstName} {employee.lastName}
                                </h1>
                                <p className="text-emerald-100 mt-1 text-lg font-medium">
                                    {employee.role?.name || '—'}
                                </p>

                                <div className="mt-4 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                                    <span className="font-medium">
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span
                                        className={`w-3 h-3 rounded-full ${employee.isActive ? 'bg-green-400' : 'bg-red-400'
                                            } animate-pulse`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoItem label="Email" value={employee.email} />
                        <InfoItem label="Phone" value={employee.phone} />
                        <InfoItem label="Gender" value={employee.gender} />
                        <InfoItem label="Department" value={employee.workingDepartment?.departmentName} />
                        <InfoItem label="Shift" value={employee.shift?.shiftName} />
                        <InfoItem label="Business Unit" value={employee.businessUnit} />
                        <InfoItem
                            label="Address"
                            value={
                                employee.address
                                    ? `${employee.address}, ${employee.city}, ${employee.state} - ${employee.zipCode}`
                                    : '—'
                            }
                            fullWidth
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex-1 min-w-[100px] py-4 px-6 text-center font-medium text-sm sm:text-base
                    border-b-2 transition-all duration-200 whitespace-nowrap
                    ${activeTab === tab.id
                                            ? 'border-emerald-600 text-emerald-700 font-semibold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* You can later extract these into separate components */}
                        {activeTab === 'attendance' && (
                            <TabContent title="Attendance Records">
                                <p className="text-gray-500">No attendance data available yet</p>
                            </TabContent>
                        )}

                        {activeTab === 'leaves' && (
                            <TabContent title="Leave History">
                                <p className="text-gray-500">No leave records found</p>
                            </TabContent>
                        )}

                        {activeTab === 'assets' && (
                            <TabContent title="Assigned Assets">
                                {employee.assignedAssets?.length > 0 ? (
                                    <div>Assets will be shown here...</div>
                                ) : (
                                    <p className="text-gray-500">No assets assigned to this employee</p>
                                )}
                            </TabContent>
                        )}

                        {activeTab === 'documents' && (
                            <TabContent title="Documents">
                                <p className="text-gray-500">No documents uploaded yet</p>
                            </TabContent>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, fullWidth = false }) {
    return (
        <div className={fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}>
            <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
            <dd className="mt-1.5 text-gray-900 font-medium">{value || '—'}</dd>
        </div>
    );
}

function TabContent({ title, children }) {
    return (
        <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                {children}
            </div>
        </>
    );
}

export default ViewEmployee;