import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_GATEWAY,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as any;

            const token = state?.authentication?.user?.id_token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Config'],
    endpoints: () => ({}),
});
