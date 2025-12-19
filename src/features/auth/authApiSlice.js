import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
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
        getUsers: builder.query({
            query: () => '/auth/users',
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useGetUsersQuery } = authApiSlice;
