import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState({});
  const [testLoading, setTestLoading] = useState({});
  const [settings, setSettings] = useState({
    general: {
      siteName: 'IT Jobs Platform',
      siteDescription: 'Nền tảng tuyển dụng IT hàng đầu Việt Nam',
      contactEmail: 'contact@itjobs.vn',
      supportEmail: 'support@itjobs.vn',
      maxJobPostingDays: 30,
      maxFreeJobPosts: 3,
      enableRegistration: true,
      enableJobPosting: true,
      enableUserReports: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@itjobs.vn',
      smtpPassword: '********',
      fromEmail: 'noreply@itjobs.vn',
      fromName: 'IT Jobs Platform'
    },
    seo: {
      metaTitle: 'IT Jobs - Việc làm IT hàng đầu',
      metaDescription: 'Tìm kiếm và ứng tuyển các vị trí việc làm IT tốt nhất tại Việt Nam',
      metaKeywords: 'việc làm IT, tuyển dụng IT, jobs, careers',
      ogTitle: 'IT Jobs Platform',
      ogDescription: 'Nền tảng tuyển dụng IT hàng đầu Việt Nam',
      ogImage: '/og-image.jpg'
    },
    payment: {
      enablePayment: true,
      currency: 'VND',
      paymentMethods: ['vnpay', 'momo', 'bank_transfer'],
      taxRate: 10
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      requireEmailVerification: true,
      enableCaptcha: true
    },
    notifications: {
      emailNotifications: true,
      browserNotifications: true,
      smsNotifications: false,
      notifyNewUsers: true,
      notifyNewJobs: true,
      notifyNewApplications: true,
      notifyReports: true
    }
  });

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSettings();
      
      if (response.data) {
        setSettings(response.data || settings);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Không thể tải cài đặt hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (section) => {
    try {
      setSaveLoading(prev => ({ ...prev, [section]: true }));
      
      const response = await adminService.updateSettings(section, settings[section]);
      
      if (response.data?.success) {
        toast.success('Đã lưu cài đặt thành công');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaveLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestLoading(prev => ({ ...prev, email: true }));
      
      const response = await adminService.testEmailSettings({
        ...settings.email,
        testRecipient: settings.general.contactEmail
      });
      
      if (response.data?.success) {
        toast.success('Email test đã được gửi thành công');
      } else {
        throw new Error('Failed to test email');
      }
    } catch (error) {
      console.error('Error testing email:', error);
      toast.error('Không thể test email');
    } finally {
      setTestLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleTestPayment = async () => {
    try {
      setTestLoading(prev => ({ ...prev, payment: true }));
      
      const response = await adminService.testPaymentSettings(settings.payment);
      
      if (response.data?.success) {
        toast.success('Kết nối thanh toán thành công');
      } else {
        throw new Error('Failed to test payment');
      }
    } catch (error) {
      console.error('Error testing payment:', error);
      toast.error('Không thể kết nối thanh toán');
    } finally {
      setTestLoading(prev => ({ ...prev, payment: false }));
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value.split(',').map(item => item.trim())
      }
    }));
  };

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'payment', name: 'Thanh toán', icon: '💳' },
    { id: 'security', name: 'Bảo mật', icon: '🔒' },
    { id: 'notifications', name: 'Thông báo', icon: '🔔' }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-3 h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên website
        </label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả website
        </label>
        <textarea
          rows="3"
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email liên hệ
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email hỗ trợ
          </label>
          <input
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian đăng tối đa (ngày)
          </label>
          <input
            type="number"
            value={settings.general.maxJobPostingDays}
            onChange={(e) => handleInputChange('general', 'maxJobPostingDays', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số bài đăng miễn phí
          </label>
          <input
            type="number"
            value={settings.general.maxFreeJobPosts}
            onChange={(e) => handleInputChange('general', 'maxFreeJobPosts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableRegistration"
            checked={settings.general.enableRegistration}
            onChange={(e) => handleInputChange('general', 'enableRegistration', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-900">
            Cho phép đăng ký mới
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableJobPosting"
            checked={settings.general.enableJobPosting}
            onChange={(e) => handleInputChange('general', 'enableJobPosting', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="enableJobPosting" className="ml-2 block text-sm text-gray-900">
            Cho phép đăng tin tuyển dụng
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableUserReports"
            checked={settings.general.enableUserReports}
            onChange={(e) => handleInputChange('general', 'enableUserReports', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="enableUserReports" className="ml-2 block text-sm text-gray-900">
            Cho phép báo cáo vi phạm
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('general')}
          disabled={saveLoading.general}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {saveLoading.general ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Username
          </label>
          <input
            type="text"
            value={settings.email.smtpUser}
            onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Password
          </label>
          <input
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Email
          </label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Name
          </label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleTestEmail}
          disabled={testLoading.email}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {testLoading.email ? 'Đang test...' : 'Test Email'}
        </button>
        <button
          onClick={() => handleSaveSettings('email')}
          disabled={saveLoading.email}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {saveLoading.email ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enablePayment"
          checked={settings.payment.enablePayment}
          onChange={(e) => handleInputChange('payment', 'enablePayment', e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="enablePayment" className="ml-2 block text-sm text-gray-900">
          Kích hoạt tính năng thanh toán
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đơn vị tiền tệ
          </label>
          <select
            value={settings.payment.currency}
            onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thuế VAT (%)
          </label>
          <input
            type="number"
            value={settings.payment.taxRate}
            onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phương thức thanh toán (phân cách bằng dấu phẩy)
        </label>
        <input
          type="text"
          value={settings.payment.paymentMethods.join(', ')}
          onChange={(e) => handleArrayChange('payment', 'paymentMethods', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="vnpay, momo, bank_transfer"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleTestPayment}
          disabled={testLoading.payment}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {testLoading.payment ? 'Đang test...' : 'Test kết nối'}
        </button>
        <button
          onClick={() => handleSaveSettings('payment')}
          disabled={saveLoading.payment}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {saveLoading.payment ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Title
        </label>
        <input
          type="text"
          value={settings.seo.metaTitle}
          onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          rows="3"
          value={settings.seo.metaDescription}
          onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords (phân cách bằng dấu phẩy)
        </label>
        <input
          type="text"
          value={settings.seo.metaKeywords}
          onChange={(e) => handleInputChange('seo', 'metaKeywords', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Title
        </label>
        <input
          type="text"
          value={settings.seo.ogTitle}
          onChange={(e) => handleInputChange('seo', 'ogTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Description
        </label>
        <textarea
          rows="3"
          value={settings.seo.ogDescription}
          onChange={(e) => handleInputChange('seo', 'ogDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Image URL
        </label>
        <input
          type="text"
          value={settings.seo.ogImage}
          onChange={(e) => handleInputChange('seo', 'ogImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('seo')}
          disabled={saveLoading.seo}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {saveLoading.seo ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Độ dài mật khẩu tối thiểu
          </label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian hết hạn phiên (giờ)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số lần đăng nhập sai tối đa
        </label>
        <input
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableTwoFactor"
            checked={settings.security.enableTwoFactor}
            onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
            Bật xác thực hai yếu tố (2FA)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireEmailVerification"
            checked={settings.security.requireEmailVerification}
            onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
            Yêu cầu xác thực email
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableCaptcha"
            checked={settings.security.enableCaptcha}
            onChange={(e) => handleInputChange('security', 'enableCaptcha', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="enableCaptcha" className="ml-2 block text-sm text-gray-900">
            Bật CAPTCHA
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('security')}
          disabled={saveLoading.security}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {saveLoading.security ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailNotifications"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
            Thông báo qua Email
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="browserNotifications"
            checked={settings.notifications.browserNotifications}
            onChange={(e) => handleInputChange('notifications', 'browserNotifications', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="browserNotifications" className="ml-2 block text-sm text-gray-900">
            Thông báo trên trình duyệt
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsNotifications"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
            Thông báo qua SMS
          </label>
        </div>
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Thông báo tự động</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifyNewUsers"
            checked={settings.notifications.notifyNewUsers}
            onChange={(e) => handleInputChange('notifications', 'notifyNewUsers', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="notifyNewUsers" className="ml-2 block text-sm text-gray-900">
            Thông báo khi có người dùng mới
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifyNewJobs"
            checked={settings.notifications.notifyNewJobs}
            onChange={(e) => handleInputChange('notifications', 'notifyNewJobs', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="notifyNewJobs" className="ml-2 block text-sm text-gray-900">
            Thông báo khi có việc làm mới
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifyNewApplications"
            checked={settings.notifications.notifyNewApplications}
            onChange={(e) => handleInputChange('notifications', 'notifyNewApplications', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="notifyNewApplications" className="ml-2 block text-sm text-gray-900">
            Thông báo khi có đơn ứng tuyển mới
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifyReports"
            checked={settings.notifications.notifyReports}
            onChange={(e) => handleInputChange('notifications', 'notifyReports', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="notifyReports" className="ml-2 block text-sm text-gray-900">
            Thông báo khi có báo cáo vi phạm
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('notifications')}
          disabled={saveLoading.notifications}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {saveLoading.notifications ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'seo':
        return renderSEOSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return <div className="text-center text-gray-500 py-8">Chức năng đang phát triển</div>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-gray-50 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 p-6">
            <div className="max-w-4xl">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
