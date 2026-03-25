import { RootState } from '@/app/store/reducer';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
        try {
            const state = getState() as RootState;

            const token = typeof state.session?.user === 'object' ? state.session.user?.id_token : null;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        } catch (e) {
            console.warn('Failed to read token', e);
        }

        return headers;
    },
});
