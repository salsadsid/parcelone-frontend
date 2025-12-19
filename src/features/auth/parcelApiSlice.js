import { apiSlice } from './apiSlice';

import { io } from 'socket.io-client';

export const parcelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getParcels: builder.query({
            query: () => '/parcels',
            providesTags: ['Parcel'],
            async onCacheEntryAdded(arg, { cacheDataLoaded, cacheEntryRemoved, dispatch }) {
                try {
                    await cacheDataLoaded;
                    const socket = io('http://localhost:5000');

                    socket.on('parcelUpdated', () => {
                        dispatch(apiSlice.util.invalidateTags(['Parcel', 'Metrics']));
                    });

                    await cacheEntryRemoved;
                    socket.close();
                } catch {
                    // no-op
                }
            },
        }),
        createParcel: builder.mutation({
            query: (parcelData) => ({
                url: '/parcels',
                method: 'POST',
                body: parcelData,
            }),
            invalidatesTags: ['Parcel'],
        }),
        updateParcelStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/parcels/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Parcel'],
        }),
        assignAgent: builder.mutation({
            query: ({ id, agentId }) => ({
                url: `/parcels/${id}/assign`,
                method: 'PUT',
                body: { agentId },
            }),
            invalidatesTags: ['Parcel'],
        }),
        getMetrics: builder.query({
            query: () => '/parcels/metrics',
            providesTags: ['Metrics'],
        }),
        getAgents: builder.query({
            query: () => '/parcels/agents',
        }),
        updateLocation: builder.mutation({
            query: ({ id, location }) => ({
                url: `/parcels/${id}/location`,
                method: 'PUT',
                body: { location },
            }),
        }),
    }),
});

export const {
    useGetParcelsQuery,
    useCreateParcelMutation,
    useUpdateParcelStatusMutation,
    useAssignAgentMutation,
    useGetMetricsQuery,
    useGetAgentsQuery,
    useUpdateLocationMutation,
} = parcelApiSlice;
