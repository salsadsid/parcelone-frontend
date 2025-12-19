import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_PRODUCTION_URL && import.meta.env.VITE_PRODUCTION_URL !== 'undefined')
        ? import.meta.env.VITE_PRODUCTION_URL
        : 'http://localhost:5000/api',
    timeout: 10000, // 10 seconds timeout
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User', 'Parcel', 'Metrics'],
    endpoints: (builder) => ({}),
});
