import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
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
    tagTypes: ['User'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        getMe: builder.query({
            query: () => '/auth/me',
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = apiSlice;
