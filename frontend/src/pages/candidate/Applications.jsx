import React, { useState } from 'react';

const CandidateApplications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'ABC Tech Company',
      appliedDate: '2024-01-15',
      status: 'pending',
      salary: '20-25 triệu',
      location: 'Hà Nội',
      jobType: 'Full-time'
    },
    {
      id: 2,
      jobTitle: 'React Developer',
      company: 'XYZ Corporation',
      appliedDate: '2024-01-14',
      status: 'interview',
      salary: '22-28 triệu',
      location: 'TP.HCM',
      jobType: 'Full-time'
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      company: 'Tech Solutions Ltd',
      appliedDate: '2024-01-13',
      status: 'rejected',
      salary: '25-30 triệu',
      location: 'Đà Nẵng',
      jobType: 'Remote'
    },
    {
      id: 4,
      jobTitle: 'Vue.js Developer',
      company: 'Innovation Hub',
      appliedDate: '2024-01-12',
      status: 'offer',
      salary: '18-22 triệu',
      location: 'Hà Nội',
      jobType: 'Part-time'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-blue-100 text-blue-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      pending: 'Chờ duyệt',
      interview: 'Phỏng vấn',
      offer: 'Nhận offer',
      rejected: 'Từ chối',
      withdrawn: 'Đã rút'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statsData = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Tìm việc làm mới
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Tổng cộng</p>
          <p className="text-2xl font-semibold text-gray-900">{statsData.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Chờ duyệt</p>
          <p className="text-2xl font-semibold text-yellow-600">{statsData.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Phỏng vấn</p>
          <p className="text-2xl font-semibold text-blue-600">{statsData.interview}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Nhận offer</p>
          <p className="text-2xl font-semibold text-green-600">{statsData.offer}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Từ chối</p>
          <p className="text-2xl font-semibold text-red-600">{statsData.rejected}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Danh sách đơn ứng tuyển</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="interview">Phỏng vấn</option>
              <option value="offer">Nhận offer</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredApplications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {application.jobTitle}
                    </h3>
                    {getStatusBadge(application.status)}
                  </div>
                  <p className="text-gray-600 mt-1">{application.company}</p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {application.salary}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {application.location}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                      </svg>
                      {application.jobType}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                      </svg>
                      Ứng tuyển: {application.appliedDate}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem chi tiết
                  </button>
                  {application.status === 'pending' && (
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Rút đơn
                    </button>
                  )}
                  {application.status === 'offer' && (
                    <>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Chấp nhận
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn ứng tuyển</h3>
            <p className="text-gray-500 mb-4">Bạn chưa ứng tuyển công việc nào hoặc không có đơn nào phù hợp với bộ lọc.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Tìm việc làm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;
