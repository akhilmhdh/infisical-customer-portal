"use client"

import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { getAuthToken } from './storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export const apiRequest = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiRequest.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token && config.headers) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
