import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter !== 'all') {
        params.payment_status = filter;
      }
      
      const response = await adminService.getPayments(params);
      
      if (response.data) {
        const paymentsData = response.data || [];
        setPayments(paymentsData);
        
        // Calculate stats
        const completedPayments = paymentsData.filter(p => p.payment_status === 'completed');
        const revenue = completedPayments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
        
        setTotalRevenue(revenue);
        setStats({
          total: paymentsData.length,
          completed: paymentsData.filter(p => p.payment_status === 'completed').length,
          pending: paymentsData.filter(p => p.payment_status === 'pending').length,
          failed: paymentsData.filter(p => p.payment_status === 'failed').length
        });
      } else {
        throw new Error('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Không thể tải danh sách thanh toán');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [paymentId]: true }));
      
      const response = await adminService.updatePaymentStatus(paymentId, {
        payment_status: newStatus
      });
      
      if (response.data?.success) {
        setPayments(payments.map(payment => 
          (payment._id === paymentId || payment.id === paymentId)
            ? { ...payment, payment_status: newStatus }
            : payment
        ));
        
        toast.success('Đã cập nhật trạng thái thanh toán');
        fetchPayments(); // Refresh to update stats
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Không thể cập nhật trạng thái thanh toán');
    } finally {
      setActionLoading(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const handleRefund = async (paymentId, refundAmount) => {
    try {
      setActionLoading(prev => ({ ...prev, [paymentId]: true }));
      
      const response = await adminService.processRefund(paymentId, {
        refund_amount: refundAmount
      });
      
      if (response.data?.success) {
        setPayments(payments.map(payment => 
          (payment._id === paymentId || payment.id === paymentId)
            ? { ...payment, payment_status: 'refunded', refund_amount: refundAmount }
            : payment
        ));
        
        toast.success('Đã xử lý hoàn tiền thành công');
        fetchPayments(); // Refresh to update stats
      } else {
        throw new Error('Failed to process refund');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Không thể xử lý hoàn tiền');
    } finally {
      setActionLoading(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const getPaymentId = (payment) => payment._id || payment.id;

  const getRecruiterInfo = (payment) => {
    if (payment.recruiter_id && typeof payment.recruiter_id === 'object') {
      return {
        name: payment.recruiter_id.company_name || payment.recruiter_id.name || 'N/A',
        email: payment.recruiter_id.email || 'N/A'
      };
    }
    return {
      name: payment.recruiterName || payment.recruiter_name || 'N/A',
      email: payment.recruiter_email || 'N/A'
    };
  };

  const getServicePlanInfo = (payment) => {
    if (payment.service_plan_id && typeof payment.service_plan_id === 'object') {
      return payment.service_plan_id.plan_name || payment.service_plan_id.name || 'N/A';
    }
    return payment.plan || payment.service_plan || 'N/A';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      completed: 'Hoàn thành',
      pending: 'Đang xử lý',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      momo: 'MoMo',
      bank_transfer: 'Chuyển khoản',
      credit_card: 'Thẻ tín dụng',
      paypal: 'PayPal'
    };
    return methods[method] || method;
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
    return `${amount} ${currency}`;
  };

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(payment => (payment.payment_status || payment.status) === filter);

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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thanh toán</h1>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalRevenue, 'VND')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Giao dịch thành công</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đang xử lý</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Thất bại</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.failed}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Lịch sử giao dịch</h3>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Đang xử lý</option>
                <option value="failed">Thất bại</option>
                <option value="refunded">Đã hoàn tiền</option>
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
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày giao dịch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const paymentId = getPaymentId(payment);
                  const isActionLoading = actionLoading[paymentId];
                  const recruiterInfo = getRecruiterInfo(payment);
                  const servicePlan = getServicePlanInfo(payment);
                  
                  return (
                    <tr key={paymentId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {recruiterInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {payment.transaction_id || payment.transactionId || paymentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{servicePlan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency || 'VND')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getPaymentMethodLabel(payment.payment_method || payment.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.payment_date || payment.paymentDate || new Date(payment.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.payment_status || payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Chi tiết
                        </button>
                        {(payment.payment_status === 'completed' || payment.status === 'completed') && (
                          <button
                            onClick={() => handleRefund(paymentId, payment.amount)}
                            disabled={isActionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {isActionLoading ? 'Đang xử lý...' : 'Hoàn tiền'}
                          </button>
                        )}
                        {(payment.payment_status === 'pending' || payment.status === 'pending') && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(paymentId, 'completed')}
                              disabled={isActionLoading}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {isActionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(paymentId, 'failed')}
                              disabled={isActionLoading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {isActionLoading ? 'Đang xử lý...' : 'Từ chối'}
                            </button>
                          </>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-medium">Chưa có giao dịch nào</p>
                      <p className="text-sm">Hệ thống chưa có lịch sử thanh toán</p>
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

export default Payments;
