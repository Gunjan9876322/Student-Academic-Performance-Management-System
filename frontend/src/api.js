import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';

export const createApiClient = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
};

export const authApi = {
  login: async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return res.data;
  }
};

export const studentsApi = {
  getAll: async (token) => {
    const client = createApiClient(token);
    const res = await client.get('/students');
    return res.data;
  },
  getById: async (token, id) => {
    const client = createApiClient(token);
    const res = await client.get(`/students/${id}`);
    return res.data;
  },
  create: async (token, studentData) => {
    const client = createApiClient(token);
    const res = await client.post('/students', studentData);
    return res.data;
  },
  update: async (token, id, studentData) => {
    const client = createApiClient(token);
    const res = await client.put(`/students/${id}`, studentData);
    return res.data;
  },
  delete: async (token, id) => {
    const client = createApiClient(token);
    const res = await client.delete(`/students/${id}`);
    return res.data;
  }
};

export const attendanceApi = {
  getAll: async (token, studentId = null) => {
    const client = createApiClient(token);
    const url = studentId ? `/attendance?student=${studentId}` : '/attendance';
    const res = await client.get(url);
    return res.data;
  },
  create: async (token, attendanceData) => {
    const client = createApiClient(token);
    const res = await client.post('/attendance', attendanceData);
    return res.data;
  }
};

export const marksApi = {
  getAll: async (token, studentId = null) => {
    const client = createApiClient(token);
    const url = studentId ? `/marks?student=${studentId}` : '/marks';
    const res = await client.get(url);
    return res.data;
  },
  create: async (token, markData) => {
    const client = createApiClient(token);
    const res = await client.post('/marks', markData);
    return res.data;
  }
};
