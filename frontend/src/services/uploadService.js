import apiClient from './apiClient';

class UploadService {
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add options to form data
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined && options[key] !== null) {
        formData.append(key, options[key]);
      }
    });

    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async uploadAvatar(file) {
    return this.uploadFile(file, {
      upload_purpose: 'avatar',
      is_public: true
    });
  }

  async uploadCompanyLogo(file) {
    return this.uploadFile(file, {
      upload_purpose: 'company_logo',
      is_public: true
    });
  }

  async uploadCoverImage(file) {
    return this.uploadFile(file, {
      upload_purpose: 'cover_image',
      is_public: true
    });
  }

  async deleteFile(fileId) {
    return apiClient.delete(`/upload/${fileId}`);
  }

  // Utility function to validate file type and size
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options;

    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return true;
  }

  // Generate preview URL for files
  getFilePreviewUrl(filePath) {
    if (!filePath) return null;
    
    // If it's already a full URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // Otherwise, construct URL from backend
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${filePath}`;
  }
}

export default new UploadService();