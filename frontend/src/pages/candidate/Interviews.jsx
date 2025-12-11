import React, { useState } from 'react';

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      jobTitle: 'React Developer',
      company: 'XYZ Corporation',
      date: '2024-01-20',
      time: '10:00',
      type: 'online',
      status: 'scheduled',
      recruiterName: 'Nguyễn Thị Lan',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Chuẩn bị demo project React và trả lời câu hỏi về hooks'
    },
    {
      id: 2,
      jobTitle: 'Vue.js Developer',
      company: 'Innovation Hub',
      date: '2024-01-22',
      time: '14:00',
      type: 'offline',
      status: 'scheduled',
      recruiterName: 'Trần Văn Minh',
      address: '123 Nguyễn Du, Hai Bà Trưng, Hà Nội',
      notes: 'Mang theo CV và portfolio, phỏng vấn kỹ thuật 1 tiếng'
    },
    {
      id: 3,
      jobTitle: 'Frontend Developer',
      company: 'Tech Solutions',
      date: '2024-01-18',
      time: '15:00',
      type: 'online',
      status: 'completed',
      recruiterName: 'Lê Thị Hương',
      feedback: 'Ứng viên có kiến thức tốt về React, cần cải thiện về TypeScript',
      result: 'passed'
    },
    {
      id: 4,
      jobTitle: 'Full Stack Developer',
      company: 'ABC Tech',
      date: '2024-01-16',
      time: '09:00',
      type: 'offline',
      status: 'completed',
      recruiterName: 'Phạm Văn Đức',
      feedback: 'Ứng viên phù hợp với yêu cầu công việc',
      result: 'passed'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      scheduled: 'Đã lên lịch',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      rescheduled: 'Đổi lịch'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        type === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
      </span>
    );
  };

  const getResultBadge = (result) => {
    if (!result) return null;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        result === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {result === 'passed' ? 'Đậu' : 'Trượt'}
      </span>
    );
  };

  const filteredInterviews = filter === 'all' 
    ? interviews 
    : interviews.filter(interview => interview.status === filter);

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' && new Date(interview.date) > new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lịch phỏng vấn</h1>
        <div className="text-sm text-gray-500">
          {upcomingInterviews.length} cuộc phỏng vấn sắp tới
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Tổng cộng</p>
          <p className="text-2xl font-semibold text-gray-900">{interviews.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đã lên lịch</p>
          <p className="text-2xl font-semibold text-blue-600">
            {interviews.filter(i => i.status === 'scheduled').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
          <p className="text-2xl font-semibold text-green-600">
            {interviews.filter(i => i.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đậu phỏng vấn</p>
          <p className="text-2xl font-semibold text-green-600">
            {interviews.filter(i => i.result === 'passed').length}
          </p>
        </div>
      </div>

      {/* Lịch phỏng vấn sắp tới */}
      {upcomingInterviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Phỏng vấn sắp tới</h3>
          <div className="space-y-3">
            {upcomingInterviews.slice(0, 2).map((interview) => (
              <div key={interview.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{interview.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{interview.company}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      {interview.date} lúc {interview.time}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {getTypeBadge(interview.type)}
                    {getStatusBadge(interview.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Tất cả lịch phỏng vấn</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredInterviews.map((interview) => (
            <div key={interview.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {interview.jobTitle}
                    </h3>
                    <div className="flex space-x-2">
                      {getTypeBadge(interview.type)}
                      {getStatusBadge(interview.status)}
                      {getResultBadge(interview.result)}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{interview.company}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Ngày giờ:</strong> {interview.date} lúc {interview.time}</p>
                      <p><strong>Người phỏng vấn:</strong> {interview.recruiterName}</p>
                    </div>
                    <div>
                      {interview.type === 'online' && interview.meetingLink && (
                        <p><strong>Link meeting:</strong> 
                          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 ml-1">
                            Tham gia phỏng vấn
                          </a>
                        </p>
                      )}
                      {interview.type === 'offline' && interview.address && (
                        <p><strong>Địa chỉ:</strong> {interview.address}</p>
                      )}
                    </div>
                  </div>

                  {interview.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm"><strong>Ghi chú:</strong> {interview.notes}</p>
                    </div>
                  )}

                  {interview.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm"><strong>Phản hồi:</strong> {interview.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {interview.status === 'scheduled' && (
                    <>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Xem chi tiết
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                        Đổi lịch
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Hủy phỏng vấn
                      </button>
                    </>
                  )}
                  {interview.status === 'completed' && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Xem kết quả
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch phỏng vấn</h3>
            <p className="text-gray-500 mb-4">Bạn chưa có lịch phỏng vấn nào hoặc không có lịch nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
