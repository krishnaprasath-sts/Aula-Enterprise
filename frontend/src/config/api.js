export const API_HOST_URL = import.meta.env.VITE_API_HOST || 'http://aulaapi.saitechnosolutions.com';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.location.hostname.includes('saitechnosolutions.com') || window.location.protocol === 'https:') ? '/api' : `${API_HOST_URL}/api`);

// Automatically converts any localhost:5000, /src/assets/ or relative upload URLs to live domain
export const sanitizeData = (data) => {
  if (!data) return data;
  if (typeof data === 'string') {
    let sanitized = data.replace(/http:\/\/localhost:5000/g, API_HOST_URL)
                        .replace(/\/src\/assets\//g, '/assets/');
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

export const formatImageUrl = (url) => {
  if (!url) return '';
  let formatted = url.replace(/http:\/\/localhost:5000/g, API_HOST_URL)
                     .replace(/https?:\/\/aulaapi\.saitechnosolutions\.com/g, API_HOST_URL)
                     .replace(/\/src\/assets\//g, '/assets/');
  if (formatted.startsWith('/uploads/')) {
    return `${API_HOST_URL}${formatted}`;
  }
  return formatted;
};

// Resilient API fetch using the single dynamic base URL
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return sanitizeData(data);
      }
      return null;
    } else {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
  } catch (err) {
    console.error(`Failed to fetch ${endpoint}:`, err);
    throw err;
  }
};
