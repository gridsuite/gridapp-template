import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppState } from 'app/store/reducer';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_GATEWAY,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as AppState;

            const token = state.authentication?.user?.id_token; // adapte selon ton store

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Config'],
    endpoints: () => ({}),
});
