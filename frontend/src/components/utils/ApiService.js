
// utils/ApiService.js
import axios from 'axios';

const AxiosService = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust based on your backend
});

export default AxiosService;
