import React, { useState } from 'react';

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    personal: {
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvanan@example.com',
      phone: '0987654321',
      dateOfBirth: '1995-05-15',
      gender: 'male',
      address: '123 Nguyễn Du, Hai Bà Trưng, Hà Nội',
      avatar: null
    },
    professional: {
      title: 'Frontend Developer',
      summary: 'Lập trình viên Frontend với 3 năm kinh nghiệm về React, Vue.js và responsive design. Có kinh nghiệm làm việc với RESTful API và Git.',
      currentPosition: 'Junior Frontend Developer',
      currentCompany: 'ABC Technology',
      expectedSalary: '15000000',
      workPreference: 'hybrid',
      availableFrom: '2024-02-01'
    },
    skills: [
      { name: 'React', level: 4, category: 'frontend' },
      { name: 'Vue.js', level: 3, category: 'frontend' },
      { name: 'JavaScript', level: 4, category: 'programming' },
      { name: 'TypeScript', level: 3, category: 'programming' },
      { name: 'HTML/CSS', level: 5, category: 'frontend' },
      { name: 'Tailwind CSS', level: 4, category: 'frontend' },
      { name: 'Node.js', level: 2, category: 'backend' },
      { name: 'Git', level: 4, category: 'tools' }
    ],
    experience: [
      {
        id: 1,
        position: 'Junior Frontend Developer',
        company: 'ABC Technology',
        startDate: '2022-03-01',
        endDate: 'present',
        description: 'Phát triển và bảo trì ứng dụng web sử dụng React và Vue.js. Tối ưu hóa hiệu suất và đảm bảo tương thích trên nhiều thiết bị.',
        achievements: [
          'Giảm thời gian load trang xuống 40%',
          'Phát triển 5 tính năng mới cho hệ thống CRM',
          'Đào tạo 2 thực tập sinh mới'
        ]
      },
      {
        id: 2,
        position: 'Frontend Intern',
        company: 'XYZ Digital',
        startDate: '2021-09-01',
        endDate: '2022-02-28',
        description: 'Hỗ trợ team phát triển website thương mại điện tử. Học hỏi và áp dụng các công nghệ mới.',
        achievements: [
          'Hoàn thành dự án thực tập với điểm A',
          'Được nhận offer full-time'
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Cử nhân Công nghệ Thông tin',
        school: 'Đại học Bách Khoa Hà Nội',
        startDate: '2017-09-01',
        endDate: '2021-06-30',
        gpa: '3.2',
        description: 'Chuyên ngành Kỹ thuật Phần mềm'
      }
    ],
    certificates: [
      {
        id: 1,
        name: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-05-15',
        expiryDate: '2026-05-15',
        credentialId: 'AWS-CDA-2023-001'
      },
      {
        id: 2,
        name: 'Meta Frontend Developer Certificate',
        issuer: 'Meta',
        issueDate: '2022-12-20',
        expiryDate: null,
        credentialId: 'META-FE-2022-456'
      }
    ]
  });

  const skillCategories = {
    frontend: 'Frontend',
    backend: 'Backend', 
    programming: 'Ngôn ngữ lập trình',
    tools: 'Công cụ',
    database: 'Cơ sở dữ liệu'
  };

  const getSkillLevel = (level) => {
    const levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return levels[level - 1] || 'Unknown';
  };

  const renderSkillBars = (level) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-6 h-2 rounded ${
              i <= level ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: '👤' },
    { id: 'professional', label: 'Thông tin nghề nghiệp', icon: '💼' },
    { id: 'skills', label: 'Kỹ năng', icon: '⚡' },
    { id: 'experience', label: 'Kinh nghiệm', icon: '📋' },
    { id: 'education', label: 'Học vấn', icon: '🎓' },
    { id: 'certificates', label: 'Chứng chỉ', icon: '🏆' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isEditing 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
          </button>
          {isEditing && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Lưu thay đổi
            </button>
          )}
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-blue-900">Độ hoàn thiện hồ sơ</h3>
          <span className="text-2xl font-bold text-blue-600">85%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: '85%' }}></div>
        </div>
        <p className="text-sm text-blue-700">
          Hồ sơ của bạn đã hoàn thiện 85%. Thêm chứng chỉ và dự án để đạt 100%.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {profile.personal.avatar ? (
                    <img src={profile.personal.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-400">👤</span>
                  )}
                </div>
                {isEditing && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Thay đổi ảnh
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.personal.fullName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.personal.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{profile.personal.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.personal.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.personal.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.personal.dateOfBirth}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(profile.personal.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  {isEditing ? (
                    <select
                      value={profile.personal.gender}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.personal.gender === 'male' ? 'Nam' : profile.personal.gender === 'female' ? 'Nữ' : 'Khác'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  {isEditing ? (
                    <textarea
                      value={profile.personal.address}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.personal.address}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Info Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí mong muốn</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.professional.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.professional.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương mong muốn</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.professional.expectedSalary}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{parseInt(profile.professional.expectedSalary).toLocaleString('vi-VN')} VNĐ</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí hiện tại</label>
                  <p className="text-gray-900">{profile.professional.currentPosition}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Công ty hiện tại</label>
                  <p className="text-gray-900">{profile.professional.currentCompany}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức làm việc</label>
                  {isEditing ? (
                    <select
                      value={profile.professional.workPreference}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="onsite">Tại văn phòng</option>
                      <option value="remote">Từ xa</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.professional.workPreference === 'onsite' ? 'Tại văn phòng' : 
                       profile.professional.workPreference === 'remote' ? 'Từ xa' : 'Hybrid'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Có thể bắt đầu từ</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.professional.availableFrom}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(profile.professional.availableFrom).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt nghề nghiệp</label>
                {isEditing ? (
                  <textarea
                    value={profile.professional.summary}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.professional.summary}</p>
                )}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {isEditing && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Thêm kỹ năng mới
                </button>
              )}

              {Object.entries(skillCategories).map(([categoryKey, categoryName]) => {
                const categorySkills = profile.skills.filter(skill => skill.category === categoryKey);
                if (categorySkills.length === 0) return null;

                return (
                  <div key={categoryKey}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{categoryName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorySkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className="text-sm text-gray-500">{getSkillLevel(skill.level)}</span>
                            </div>
                            {renderSkillBars(skill.level)}
                          </div>
                          {isEditing && (
                            <button className="ml-3 text-red-600 hover:text-red-700">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {isEditing && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Thêm kinh nghiệm mới
                </button>
              )}

              {profile.experience.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(exp.startDate).toLocaleDateString('vi-VN')} - {
                          exp.endDate === 'present' ? 'Hiện tại' : new Date(exp.endDate).toLocaleDateString('vi-VN')
                        }
                      </p>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Sửa</button>
                        <button className="text-red-600 hover:text-red-700">Xóa</button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thành tích:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {isEditing && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Thêm học vấn mới
                </button>
              )}

              {profile.education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(edu.startDate).toLocaleDateString('vi-VN')} - {new Date(edu.endDate).toLocaleDateString('vi-VN')}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Sửa</button>
                        <button className="text-red-600 hover:text-red-700">Xóa</button>
                      </div>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              {isEditing && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Thêm chứng chỉ mới
                </button>
              )}

              {profile.certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-blue-600 font-medium">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">
                        Cấp ngày: {new Date(cert.issueDate).toLocaleDateString('vi-VN')}
                        {cert.expiryDate && (
                          <span> - Hết hạn: {new Date(cert.expiryDate).toLocaleDateString('vi-VN')}</span>
                        )}
                      </p>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-600">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Sửa</button>
                        <button className="text-red-600 hover:text-red-700">Xóa</button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Xem chứng chỉ
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                      Xác minh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
