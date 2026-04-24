import axios from 'axios';

// Change this line to your production backend
const API_URL = 'https://carmax-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;