import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://vetra-4a1b4efd0f63.herokuapp.com/api',
  withCredentials: true
});
