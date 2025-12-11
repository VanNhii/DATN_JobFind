import LoadingSpinner from '@/components/common/LoadingSpinner';
import candidateService from '@/services/candidateService';
import jobService from '@/services/jobService';
import { formatLocation, formatSalary } from '@/utils/formatters';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
    experience_level: '',
    salary_min: '',
    salary_max: '',
    category: ''
  });

  const [sortBy, setSortBy] = useState('-created_at');

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
    fetchApplications();
    // eslint-disable-next-line
  }, [pagination.page, sortBy]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    // eslint-disable-next-line
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        status: 'active',
        ...filters
      };

      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === '') delete params[key];
      });

      const response = await jobService.getJobs(params);
      
      if (response.success) {
        setJobs(response.data.data || response.data || []);
        
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total || 0,
            totalPages: response.data.pagination.totalPages || 0,
            page: response.data.pagination.page || prev.page
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Không thể tải danh sách công việc');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await candidateService.getSavedJobs();
      if (response.success && response.data) {
        const savedIds = new Set(response.data.map(item => item.job?._id || item.job_id));
        setSavedJobIds(savedIds);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await candidateService.getCandidateApplications();
      if (response.success && response.data) {
        const appliedIds = new Set(response.data.map(item => item.job?._id || item.job_id));
        setAppliedJobIds(appliedIds);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const toggleBookmark = async (jobId) => {
    try {
      const isSaved = savedJobIds.has(jobId);
      
      if (isSaved) {
        await candidateService.unsaveJob(jobId);
        setSavedJobIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success('Đã bỏ lưu công việc');
      } else {
        await candidateService.saveJob(jobId);
        setSavedJobIds(prev => new Set(prev).add(jobId));
        toast.success('Đã lưu công việc');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(error.response?.data?.message || 'Không thể thực hiện thao tác');
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await candidateService.applyForJob(jobId, {
        cover_letter: ''
      });
      setAppliedJobIds(prev => new Set(prev).add(jobId));
      toast.success('Ứng tuyển thành công!');
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error(error.response?.data?.message || 'Không thể ứng tuyển');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      job_type: '',
      experience_level: '',
      salary_min: '',
      salary_max: '',
      category: ''
    });
  };

  const getJobTypeBadge = (type) => {
    const badges = {
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-yellow-100 text-yellow-800',
      'Contract': 'bg-purple-100 text-purple-800',
      'Remote': 'bg-blue-100 text-blue-800',
      'Internship': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 'Không giới hạn';
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Đã hết hạn';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Còn 1 ngày';
    return `Còn ${diffDays} ngày`;
  };

  const jobStats = {
    total: pagination.total,
    applied: appliedJobIds.size,
    bookmarked: savedJobIds.size,
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tìm việc làm</h1>
        <div className="text-sm text-gray-500">
          {jobs.length} / {pagination.total} việc làm
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Tổng việc làm</p>
          <p className="text-2xl font-semibold text-gray-900">{jobStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đã ứng tuyển</p>
          <p className="text-2xl font-semibold text-blue-600">{jobStats.applied}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đã lưu</p>
          <p className="text-2xl font-semibold text-yellow-600">{jobStats.bookmarked}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Tìm theo tên công việc, công ty..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <select
              value={filters.job_type}
              onChange={(e) => handleFilterChange('job_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả loại hình</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="-created_at">Mới nhất</option>
              <option value="created_at">Cũ nhất</option>
              <option value="-salary_max">Lương cao nhất</option>
              <option value="salary_min">Lương thấp nhất</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isBookmarked = savedJobIds.has(job._id);
            const isApplied = appliedJobIds.has(job._id);

            return (
              <div key={job._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.recruiter?.company_logo ? (
                        <img 
                          src={job.recruiter.company_logo} 
                          alt={job.recruiter?.company_name} 
                          className="w-full h-full object-contain rounded-lg" 
                        />
                      ) : (
                        <span className="text-xl text-gray-400">🏢</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {job.title}
                        </Link>
                        <button
                          onClick={() => toggleBookmark(job._id)}
                          className={`p-1 rounded ml-2 ${
                            isBookmarked
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                        >
                          <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-blue-600 font-medium mb-2">
                        {job.recruiter?.company_name || 'Công ty'}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {formatLocation(job.location)}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6a2 2 0 00-2 2v6.002" />
                          </svg>
                          {job.experience_level || 'Không yêu cầu'}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getDaysRemaining(job.application_deadline)}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {getJobTypeBadge(job.job_type)}
                          {job.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{job.skills.length - 3} khác
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                          >
                            Xem chi tiết
                          </Link>
                          {isApplied ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                              Đã ứng tuyển
                            </span>
                          ) : (
                            <button
                              onClick={() => applyToJob(job._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Ứng tuyển
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy việc làm phù hợp</h3>
              <p className="text-gray-500 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          
          <div className="flex space-x-1">
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNum = index + 1;
              if (
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 border rounded-lg ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === pagination.page - 2 ||
                pageNum === pagination.page + 2
              ) {
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      )}
      
      <div className="text-sm text-gray-600">Xem danh sách việc làm phù hợp với hồ sơ của bạn</div>
    </div>
  );
};

export default CandidateJobs;
