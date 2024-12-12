import axiosLib from 'axios';

export const axios = axiosLib.create({
  baseURL: 'https://vetra-4a1b4efd0f63.herokuapp.com/api',
  withCredentials: true
});
