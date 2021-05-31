import axios from 'axios';

export default {
  endpoint1: axios.create({
    withCredentials: true,
    baseURL: 'endpoint1-url',
    headers: { 'Content-Type': 'application/json' },
  }),
  endpoint2: axios.create({
    withCredentials: true,
    baseURL: 'endpoint1-url',
    headers: { 'Content-Type': 'application/json' },
  }),
};
