import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    active: 0,
    expired: 0,
    autoRenewal: 0,
    total: 0
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSubscriptions();
      
      if (response.data) {
        const subscriptionsData = response.data || [];
        setSubscriptions(subscriptionsData);
      } else {
        throw new Error('Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Không thể tải danh sách subscription');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getSubscriptionStats();
      
      if (response.data?.success) {
        setStats(response.data.data || {
          active: 0,
          expired: 0,
          autoRenewal: 0,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
    }
  };

  const updateSubscriptionStatus = async (subscriptionId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
      
      const response = await adminService.updateSubscriptionStatus(subscriptionId, {
        status: newStatus
      });
      
      if (response.data?.success) {
        setSubscriptions(subscriptions.map(sub => 
          (sub._id === subscriptionId || sub.id === subscriptionId)
            ? { ...sub, status: newStatus }
            : sub
        ));
        toast.success('Cập nhật trạng thái subscription thành công');
        fetchStats(); // Refresh stats
      } else {
        throw new Error('Failed to update subscription status');
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      toast.error('Không thể cập nhật trạng thái subscription');
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const getSubscriptionId = (subscription) => subscription._id || subscription.id;
  
  const getRecruiterInfo = (subscription) => {
    if (subscription.recruiter_id && typeof subscription.recruiter_id === 'object') {
      return {
        name: subscription.recruiter_id.company_name || subscription.recruiter_id.name || 'N/A',
        email: subscription.recruiter_id.email || 'N/A'
      };
    }
    return {
      name: subscription.recruiterName || subscription.recruiter_name || 'N/A',
      email: subscription.email || subscription.recruiter_email || 'N/A'
    };
  };

  const getServicePlanInfo = (subscription) => {
    if (subscription.service_plan_id && typeof subscription.service_plan_id === 'object') {
      return subscription.service_plan_id.plan_name || subscription.service_plan_id.name || 'N/A';
    }
    return subscription.planName || subscription.plan_name || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Đang hoạt động',
      expired: 'Hết hạn',
      cancelled: 'Đã hủy',
      pending: 'Chờ kích hoạt'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      paid: 'Đã thanh toán',
      unpaid: 'Chưa thanh toán',
      partial: 'Thanh toán một phần'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredSubscriptions = filter === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.status === filter);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Subscription</h1>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hết hạn</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tự động gia hạn</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.autoRenewal}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng subscription</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Danh sách Subscription</h3>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="cancelled">Đã hủy</option>
                <option value="pending">Chờ kích hoạt</option>
              </select>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhà tuyển dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tự động gia hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => {
                  const subscriptionId = getSubscriptionId(subscription);
                  const isActionLoading = actionLoading[subscriptionId];
                  const recruiterInfo = getRecruiterInfo(subscription);
                  const servicePlan = getServicePlanInfo(subscription);
                  
                  return (
                    <tr key={subscriptionId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {recruiterInfo.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {recruiterInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {recruiterInfo.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{servicePlan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(subscription.start_date || subscription.startDate)} - {formatDate(subscription.end_date || subscription.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(subscription.payment_status || subscription.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (subscription.auto_renewal !== undefined ? subscription.auto_renewal : subscription.autoRenewal)
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {(subscription.auto_renewal !== undefined ? subscription.auto_renewal : subscription.autoRenewal) ? 'Bật' : 'Tắt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Chi tiết
                        </button>
                        {subscription.status === 'expired' && (
                          <button 
                            onClick={() => updateSubscriptionStatus(subscriptionId, 'active')}
                            disabled={isActionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {isActionLoading ? 'Đang xử lý...' : 'Gia hạn'}
                          </button>
                        )}
                        {subscription.status === 'active' && (
                          <button 
                            onClick={() => updateSubscriptionStatus(subscriptionId, 'cancelled')}
                            disabled={isActionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {isActionLoading ? 'Đang xử lý...' : 'Hủy'}
                          </button>
                        )}
                        {subscription.status === 'cancelled' && (
                          <button 
                            onClick={() => updateSubscriptionStatus(subscriptionId, 'active')}
                            disabled={isActionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {isActionLoading ? 'Đang xử lý...' : 'Kích hoạt'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-lg font-medium">Chưa có subscription nào</p>
                      <p className="text-sm">Hệ thống chưa có đăng ký dịch vụ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
