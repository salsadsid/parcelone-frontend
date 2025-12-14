import { apiSlice } from './authApiSlice';

export const parcelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getParcels: builder.query({
            query: () => '/parcels',
            providesTags: ['Parcel'],
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
    }),
});

export const {
    useGetParcelsQuery,
    useCreateParcelMutation,
    useUpdateParcelStatusMutation,
    useAssignAgentMutation,
    useGetMetricsQuery,
    useGetAgentsQuery,
} = parcelApiSlice;
