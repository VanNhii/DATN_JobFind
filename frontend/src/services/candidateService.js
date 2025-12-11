import apiClient from './apiClient';

const candidateService = {
  // Search candidates (for recruiters)
  searchCandidates: async (params = {}) => {
    return await apiClient.get('/recruiters/candidates/search', params);
  },

  // Get candidate profile by ID (for recruiters)
  getCandidateProfile: async (candidateId) => {
    return await apiClient.get(`/recruiters/candidates/${candidateId}`);
  },

  // Download candidate CV (for recruiters with permission)
  downloadCandidateCV: async (candidateId) => {
    return await apiClient.get(`/recruiters/candidates/${candidateId}/cv`, {}, {
      responseType: 'blob'
    });
  },

  // Get all candidates (admin only)
  getAllCandidates: async (params = {}) => {
    return await apiClient.get('/candidates', params);
  },

  // Get candidate by ID (admin/recruiter)
  getCandidateById: async (candidateId) => {
    return await apiClient.get(`/candidates/${candidateId}`);
  },

  // Candidate profile management (for candidates themselves)
  getCandidateProfile: async () => {
    return await apiClient.get('/candidates/profile');
  },

  updateCandidateProfile: async (profileData) => {
    return await apiClient.put('/candidates/profile', profileData);
  },

  // Dashboard data
  getCandidateDashboard: async () => {
    return await apiClient.get('/candidates/dashboard');
  },

  // Applications
  getCandidateApplications: async (params = {}) => {
    return await apiClient.get('/candidates/applications', params);
  },

  applyForJob: async (jobId, applicationData) => {
    return await apiClient.post(`/candidates/jobs/${jobId}/apply`, applicationData);
  },

  withdrawApplication: async (applicationId) => {
    return await apiClient.delete(`/candidates/applications/${applicationId}`);
  },

  // Saved jobs
  getSavedJobs: async (params = {}) => {
    return await apiClient.get('/candidates/saved-jobs', params);
  },

  saveJob: async (jobId) => {
    return await apiClient.post(`/candidates/jobs/${jobId}/save`);
  },

  unsaveJob: async (jobId) => {
    return await apiClient.delete(`/candidates/jobs/${jobId}/save`);
  },

  // Interviews
  getCandidateInterviews: async (params = {}) => {
    return await apiClient.get('/candidates/interviews', params);
  },

  // Experience management
  getCandidateExperiences: async () => {
    return await apiClient.get('/candidates/experiences');
  },

  addCandidateExperience: async (experienceData) => {
    return await apiClient.post('/candidates/experiences', experienceData);
  },

  updateCandidateExperience: async (experienceId, experienceData) => {
    return await apiClient.put(`/candidates/experiences/${experienceId}`, experienceData);
  },

  deleteCandidateExperience: async (experienceId) => {
    return await apiClient.delete(`/candidates/experiences/${experienceId}`);
  },

  // Education management
  getCandidateEducations: async () => {
    return await apiClient.get('/candidates/educations');
  },

  addCandidateEducation: async (educationData) => {
    return await apiClient.post('/candidates/educations', educationData);
  },

  updateCandidateEducation: async (educationId, educationData) => {
    return await apiClient.put(`/candidates/educations/${educationId}`, educationData);
  },

  deleteCandidateEducation: async (educationId) => {
    return await apiClient.delete(`/candidates/educations/${educationId}`);
  },

  // Skills management
  getCandidateSkills: async () => {
    return await apiClient.get('/candidates/skills');
  },

  addCandidateSkill: async (skillData) => {
    return await apiClient.post('/candidates/skills', skillData);
  },

  updateCandidateSkill: async (skillId, skillData) => {
    return await apiClient.put(`/candidates/skills/${skillId}`, skillData);
  },

  deleteCandidateSkill: async (skillId) => {
    return await apiClient.delete(`/candidates/skills/${skillId}`);
  },

  // Job search for candidates
  searchJobs: async (params = {}) => {
    return await apiClient.get('/candidates/jobs/search', params);
  }
};

export default candidateService;