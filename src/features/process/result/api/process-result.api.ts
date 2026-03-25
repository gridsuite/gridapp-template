import { createApi } from '@reduxjs/toolkit/query/react';
import { ProcessResult } from '../types/process-result.types';
import { baseQueryWithAuth } from '@/shared/api/base-query';

export const processResultApi = createApi({
    reducerPath: 'processResultApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getProcessResult: builder.query<ProcessResult, string>({
            query: (executionId) => `/api/monitor/v1/executions/${executionId}/results`,
        }),
    }),
});

export const { useGetProcessResultQuery } = processResultApi;
