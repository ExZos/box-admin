import axios from 'axios';

export const server = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 0,
    withCredentials: false
});

export const api = {
  box: {
    list: '/boxes',
    get: '/boxes',
    create: '/boxes',
    update: '/boxes',
    delete: '/boxes'
  }
};
