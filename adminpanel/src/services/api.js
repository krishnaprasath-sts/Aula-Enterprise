export const API_HOST_URL = import.meta.env.VITE_API_HOST || 'http://aulaapi.saitechnosolutions.com';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${API_HOST_URL}/api`;

// Helper to retrieve the current JWT token
export const getToken = () => localStorage.getItem('aula_jwt_token');

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('aula_jwt_token', token);
  } else {
    localStorage.removeItem('aula_jwt_token');
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('aula_admin_user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('aula_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('aula_admin_user');
  }
};

// Helper to automatically convert any localhost:5000 or http URLs to live domain
export const sanitizeData = (data) => {
  if (!data) return data;
  if (typeof data === 'string') {
    let sanitized = data.replace(/http:\/\/localhost:5000/g, API_HOST_URL)
                        .replace(/https?:\/\/aulaapi\.saitechnosolutions\.com/g, API_HOST_URL);
    if (sanitized.startsWith('/uploads/')) {
      sanitized = `${API_HOST_URL}${sanitized}`;
    }
    return sanitized;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  if (typeof data === 'object') {
    const sanitized = {};
    for (const key of Object.keys(data)) {
      sanitized[key] = sanitizeData(data[key]);
    }
    return sanitized;
  }
  return data;
};

// Generic authenticated fetch helper using single dynamic base URL
export async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      if (endpoint !== '/auth/login') {
        console.warn('Session expired. Redirecting to login.');
        setToken(null);
        setCurrentUser(null);
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Response is not valid JSON');
    }

    const result = await response.json();
    return sanitizeData(result);
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    throw error;
  }
}

// Auth APIs
export const authApi = {
  login: async (email, password) => {
    return await apiRequest('/auth/login', 'POST', { email, password });
  },
  getMe: async () => {
    return await apiRequest('/auth/me', 'GET');
  }
};

// Upload API
export const uploadApi = {
  uploadFile: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('mediaFile', file);

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${API_BASE_URL}/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload file');
      }
      const result = await response.json();
      return sanitizeData(result);
    } catch (err) {
      console.error('Failed to upload file:', err);
      throw err;
    }
  }
};

// Hero Banner APIs
export const heroApi = {
  getAll: async () => {
    try {
      return await apiRequest('/hero-banners', 'GET');
    } catch (e) {
      throw e;
    }
  },
  create: async (banner) => {
    try {
      return await apiRequest('/hero-banners', 'POST', banner);
    } catch (e) {
      throw e;
    }
  },
  update: async (id, banner) => {
    try {
      return await apiRequest(`/hero-banners/${id}`, 'PUT', banner);
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/hero-banners/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  }
};

// Services APIs
export const servicesApi = {
  getAll: async () => {
    try {
      return await apiRequest('/services', 'GET');
    } catch (e) {
      throw e;
    }
  },
  create: async (service) => {
    try {
      return await apiRequest('/services', 'POST', service);
    } catch (e) {
      throw e;
    }
  },
  update: async (id, service) => {
    try {
      return await apiRequest(`/services/${id}`, 'PUT', service);
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/services/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  }
};

// Permit Types APIs
export const permitTypesApi = {
  getAll: async () => {
    try {
      return await apiRequest('/permit-types', 'GET');
    } catch (e) {
      throw e;
    }
  },
  create: async (permitType) => {
    try {
      return await apiRequest('/permit-types', 'POST', permitType);
    } catch (e) {
      throw e;
    }
  },
  update: async (id, permitType) => {
    try {
      return await apiRequest(`/permit-types/${id}`, 'PUT', permitType);
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/permit-types/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  }
};

// Contact Info APIs
export const contactApi = {
  get: async () => {
    try {
      return await apiRequest('/contact', 'GET');
    } catch (e) {
      throw e;
    }
  },
  update: async (data) => {
    try {
      return await apiRequest('/contact', 'PUT', data);
    } catch (e) {
      throw e;
    }
  }
};

// Enquiries APIs
export const enquiryApi = {
  getAll: async () => {
    try {
      return await apiRequest('/enquiries', 'GET');
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/enquiries/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  },
  updateStatus: async (id, status) => {
    try {
      return await apiRequest(`/enquiries/${id}/status`, 'PUT', { status });
    } catch (e) {
      throw e;
    }
  }
};

// Contact Submissions APIs
export const contactSubmissionsApi = {
  getAll: async () => {
    try {
      return await apiRequest('/contact-submissions', 'GET');
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/contact-submissions/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  },
  updateStatus: async (id, status) => {
    try {
      return await apiRequest(`/contact-submissions/${id}/status`, 'PUT', { status });
    } catch (e) {
      throw e;
    }
  }
};

// Jobs APIs
export const jobsApi = {
  getAll: async () => {
    try {
      return await apiRequest('/jobs/all', 'GET');
    } catch (e) {
      throw e;
    }
  },
  create: async (job) => {
    try {
      return await apiRequest('/jobs', 'POST', job);
    } catch (e) {
      throw e;
    }
  },
  update: async (id, job) => {
    try {
      return await apiRequest(`/jobs/${id}`, 'PUT', job);
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/jobs/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  }
};

// Applications APIs
export const applicationsApi = {
  getAll: async () => {
    try {
      return await apiRequest('/applications', 'GET');
    } catch (e) {
      throw e;
    }
  },
  updateStatus: async (id, status) => {
    try {
      return await apiRequest(`/applications/${id}/status`, 'PUT', { status });
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      return await apiRequest(`/applications/${id}`, 'DELETE');
    } catch (e) {
      throw e;
    }
  }
};
