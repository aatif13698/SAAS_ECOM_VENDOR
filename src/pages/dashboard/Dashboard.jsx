import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { faker } from '@faker-js/faker';
import useDarkmode from '@/hooks/useDarkMode';
import { Icon } from '@iconify/react';
import { toast } from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [isDark] = useDarkmode();
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    revenue: 0,
    activeCustomers: 0,
    pendingOrders: 0,
    conversionRate: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // Generate dummy data
  useEffect(() => {
    const generateDummyData = () => {
      setMetrics({
        totalSales: faker.number.int({ min: 1000, max: 5000 }),
        totalOrders: faker.number.int({ min: 200, max: 1000 }),
        revenue: faker.number.int({ min: 50000, max: 200000 }),
        activeCustomers: faker.number.int({ min: 50, max: 500 }),
        pendingOrders: faker.number.int({ min: 10, max: 50 }),
        conversionRate: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
      });

      const orders = Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        customer: faker.person.fullName(),
        amount: faker.number.int({ min: 20, max: 500 }),
        status: faker.helpers.arrayElement(['Pending', 'Shipped', 'Delivered']),
        date: faker.date.recent({ days: 7 }).toLocaleDateString(),
      }));
      setRecentOrders(orders);

      toast.success('Dashboard data loaded!');
    };

    generateDummyData();
  }, []);

  // Chart data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: Array.from({ length: 6 }, () => faker.number.int({ min: 1000, max: 5000 })),
        borderColor: isDark ? '#60a5fa' : '#3b82f6',
        backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  const productData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        label: 'Units Sold',
        data: Array.from({ length: 4 }, () => faker.number.int({ min: 50, max: 200 })),
        backgroundColor: isDark
          ? ['#60a5fa', '#34d399', '#f87171', '#fb923c']
          : ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'],
      },
    ],
  };

  const orderStatusData = {
    labels: ['Pending', 'Shipped', 'Delivered'],
    datasets: [
      {
        data: [metrics.pendingOrders, faker.number.int({ min: 20, max: 100 }), metrics.totalOrders - metrics.pendingOrders],
        backgroundColor: isDark
          ? ['#f87171', '#60a5fa', '#34d399']
          : ['#ef4444', '#3b82f6', '#10b981'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#e5e7eb' : '#1f2937',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? '#e5e7eb' : '#1f2937',
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#e5e7eb' : '#1f2937',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Vendor Dashboard
      </h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total Sales
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalSales}
          </p>
        </div>
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total Orders
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalOrders}
          </p>
        </div>
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${metrics.revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
         
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Active Customers
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.activeCustomers}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Sales Over Time
          </h3>
          <div className="h-64">
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Top Products
          </h3>
          <div className="h-64">
            <Bar data={productData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Order Status
          </h3>
          <div className="h-64">
            <Pie data={orderStatusData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      ${order.amount}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100'
                            : 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-darkSecondary rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Quick Actions
        </h3>
        <div className="flex space-x-4">
          <Link
            to="/create-product"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon icon="heroicons-outline:plus" className="mr-2" />
            Add Product
  </Link>
          <button
            onClick={() => toast.success('Refreshing data...')}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <Icon icon="heroicons-outline:refresh" className="mr-2" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Dashboard);