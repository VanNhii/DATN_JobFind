const CandidateDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Chào mừng bạn quay trở lại! Theo dõi hoạt động ứng tuyển của bạn.</p>
      </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-primary-600">12</div>
            <div className="text-gray-600">Đơn ứng tuyển</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-gray-600">Được phỏng vấn</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-gray-600">Việc làm đã lưu</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">25</div>
            <div className="text-gray-600">Profile views</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Đơn ứng tuyển gần đây</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((app) => (
                  <div key={app} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Frontend Developer</h3>
                      <p className="text-gray-600 text-sm">FPT Software</p>
                      <p className="text-gray-500 text-xs">Ứng tuyển 2 ngày trước</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Đang xem xét
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Việc làm được đề xuất</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((job) => (
                  <div key={job} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900">React Developer</h3>
                    <p className="text-gray-600 text-sm">VNG Corporation</p>
                    <p className="text-gray-600 text-sm">Hồ Chí Minh • $1,800 - $2,500</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Xem chi tiết
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm">
                        Lưu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CandidateDashboard;
