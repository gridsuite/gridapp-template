import { monitorApi } from '@/shared/api/monitor-api/monitor.generated';

const executionResultCacheApi = monitorApi.enhanceEndpoints({
    addTagTypes: ['ExecutionResultCache'],
    endpoints: {
        getExecutionResults: {
            providesTags: (_result, _error, params) => [{ type: 'ExecutionResultCache', id: params.executionId }],
        },
    },
});

export const { useLazyGetExecutionResultsQuery, useGetExecutionResultsQuery } = executionResultCacheApi;

export const invalidateExecutionResultCache = (executionId: string) =>
    executionResultCacheApi.util.invalidateTags([{ type: 'ExecutionResultCache', id: executionId }]);
