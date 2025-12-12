import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const Maintenance = () => {
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    backup: false,
    maintenance: false,
    tasks: {}
  });
  const [systemStatus, setSystemStatus] = useState({
    overall: 'healthy',
    database: 'healthy',
    storage: 'warning',
    email: 'healthy',
    payment: 'healthy',
    ai: 'error'
  });

  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  
  const [systemStats, setSystemStats] = useState({
    uptime: '15 ngày 6 giờ',
    totalUsers: 1250,
    activeJobs: 340,
    storageUsed: '78%',
    memoryUsage: '65%',
    cpuUsage: '42%'
  });

  // Fetch data from backend
  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      
      const [statusResponse, tasksResponse] = await Promise.all([
        adminService.getSystemStatus(),
        adminService.getMaintenanceTasks()
      ]);

      if (statusResponse.data?.success) {
        const data = statusResponse.data.data;
        setSystemStatus(data.systemStatus || systemStatus);
        setSystemStats(data.systemStats || systemStats);
        setMaintenanceMode(data.maintenanceMode || false);
      }

      if (tasksResponse.data?.success) {
        setMaintenanceTasks(tasksResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
      toast.error('Không thể tải dữ liệu hệ thống');
      
      // Fallback to mock data
      setMaintenanceTasks([
        { id: 1, name: 'Dọn dẹp log files', status: 'completed', lastRun: '2024-01-15 02:00', nextRun: '2024-01-16 02:00' },
        { id: 2, name: 'Backup database', status: 'running', lastRun: '2024-01-16 01:00', nextRun: '2024-01-17 01:00' },
        { id: 3, name: 'Optimize database', status: 'pending', lastRun: '2024-01-10 03:00', nextRun: '2024-01-17 03:00' },
        { id: 4, name: 'Clean temporary files', status: 'scheduled', lastRun: '2024-01-15 04:00', nextRun: '2024-01-16 04:00' }
      ]);
        } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const runMaintenanceTask = async (taskId) => {
    try {
      setActionLoading(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: true } }));
      
      const response = await adminService.runMaintenanceTask(taskId);
      
      if (response.data?.success) {
        toast.success('Tác vụ đã được khởi chạy');
        
        // Update local state
        setMaintenanceTasks(maintenanceTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'running', lastRun: new Date().toISOString().slice(0, 16).replace('T', ' ') }
            : task
        ));
        
        // Refresh data after a delay
        setTimeout(() => {
          fetchSystemData();
        }, 3000);
      } else {
        throw new Error('Failed to run maintenance task');
      }
    } catch (error) {
      console.error('Error running maintenance task:', error);
      toast.error('Không thể chạy tác vụ bảo trì');
    } finally {
      setActionLoading(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: false } }));
    }
  };

  const handleMaintenanceMode = async () => {
    try {
      setActionLoading(prev => ({ ...prev, maintenance: true }));
      
      if (maintenanceMode) {
        const response = await adminService.disableMaintenanceMode();
        if (response.data?.success) {
          setMaintenanceMode(false);
          toast.success('Đã tắt chế độ bảo trì');
        }
      } else {
        const response = await adminService.enableMaintenanceMode({
          message: 'Hệ thống đang được bảo trì. Vui lòng quay lại sau.'
        });
        if (response.data?.success) {
          setMaintenanceMode(true);
          toast.success('Đã bật chế độ bảo trì');
        }
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast.error('Không thể thay đổi chế độ bảo trì');
    } finally {
      setActionLoading(prev => ({ ...prev, maintenance: false }));
    }
  };

  const handleFullBackup = async () => {
    try {
      setActionLoading(prev => ({ ...prev, backup: true }));
      
      const response = await adminService.cleanupSystem({
        type: 'full_backup'
      });
      
      if (response.data?.success) {
        toast.success('Backup toàn bộ đã được khởi tạo');
      } else {
        throw new Error('Failed to start backup');
      }
    } catch (error) {
      console.error('Error starting backup:', error);
      toast.error('Không thể khởi tạo backup');
    } finally {
      setActionLoading(prev => ({ ...prev, backup: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bảo trì hệ thống</h1>
        <div className="flex space-x-3">
          <button 
            onClick={handleMaintenanceMode}
            disabled={actionLoading.maintenance}
            className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 ${
              maintenanceMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {actionLoading.maintenance 
              ? 'Đang xử lý...' 
              : (maintenanceMode ? 'Tắt bảo trì' : 'Chế độ bảo trì')
            }
          </button>
          <button 
            onClick={handleFullBackup}
            disabled={actionLoading.backup}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading.backup ? 'Đang backup...' : 'Backup toàn bộ'}
          </button>
        </div>
      </div>

      {/* Tình trạng hệ thống */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Tình trạng hệ thống</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(systemStatus).map(([key, status]) => {
              const labels = {
                overall: 'Tổng quan',
                database: 'Cơ sở dữ liệu',
                storage: 'Lưu trữ',
                email: 'Email',
                payment: 'Thanh toán',
                ai: 'AI Service'
              };
              
              return (
                <div key={key} className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      status === 'healthy' ? 'bg-green-400' :
                      status === 'warning' ? 'bg-yellow-400' :
                      status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    {status === 'healthy' ? 'Tốt' :
                     status === 'warning' ? 'Cảnh báo' :
                     status === 'error' ? 'Lỗi' : 'Bảo trì'}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{labels[key]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thống kê hệ thống */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">{systemStats.uptime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Người dùng</p>
              <p className="text-lg font-semibold text-gray-900">{systemStats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Việc làm</p>
              <p className="text-lg font-semibold text-gray-900">{systemStats.activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0v16a1 1 0 001 1h8a1 1 0 001-1V4M7 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lưu trữ</p>
              <p className="text-lg font-semibold text-gray-900">{systemStats.storageUsed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Memory</p>
              <p className="text-lg font-semibold text-gray-900">{systemStats.memoryUsage}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">CPU</p>
              <p className="text-lg font-semibold text-gray-900">{systemStats.cpuUsage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tác vụ bảo trì */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Tác vụ bảo trì</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              Tạo tác vụ mới
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên tác vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lần cuối chạy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lần chạy tiếp theo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                      {task.status === 'completed' ? 'Hoàn thành' :
                       task.status === 'running' ? 'Đang chạy' :
                       task.status === 'pending' ? 'Chờ thực hiện' :
                       task.status === 'scheduled' ? 'Đã lên lịch' : 'Thất bại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.lastRun}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.nextRun}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {(task.status === 'pending' || task.status === 'scheduled') && (
                      <button
                        onClick={() => runMaintenanceTask(task.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Chạy ngay
                      </button>
                    )}
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Cấu hình
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900">
                      Lịch sử
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Công cụ bảo trì nhanh */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Công cụ bảo trì nhanh</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div>
                  <p className="font-medium">Dọn dẹp cache</p>
                  <p className="text-sm text-gray-500">Xóa cache tạm thời</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <div>
                  <p className="font-medium">Backup database</p>
                  <p className="text-sm text-gray-500">Sao lưu toàn bộ DB</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="font-medium">Restart services</p>
                  <p className="text-sm text-gray-500">Khởi động lại dịch vụ</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <p className="font-medium">Optimize DB</p>
                  <p className="text-sm text-gray-500">Tối ưu cơ sở dữ liệu</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
