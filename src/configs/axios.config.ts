import axios from 'axios';

const api = axios.create({
    baseURL: 'http://wallet-api:3001',
});

export default api;
