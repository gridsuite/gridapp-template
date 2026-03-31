import React from 'react';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/store';
import {
    invalidateExecutionResultCache,
    useGetExecutionResultsQuery,
} from '@/features/process/result/api/execution-result-cache.api';
import { selectCurrentExecutionId } from '@/features/process/result/store/execution-result.slice';

const RawJsonPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const executionId = useSelector(selectCurrentExecutionId);
    const { data, isLoading, isFetching, isSuccess } = useGetExecutionResultsQuery(
        { executionId: executionId ?? '' },
        {
            skip: !executionId,
        }
    );

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Raw JSON
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    {isLoading || isFetching
                        ? 'Fetching from network...'
                        : isSuccess
                        ? 'Loaded from cache'
                        : 'No cached data'}
                </Alert>
                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={!executionId}
                    onClick={() => executionId && dispatch(invalidateExecutionResultCache(executionId))}
                >
                    Invalidate cache
                </Button>
                {data ? (
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                ) : (
                    <Typography>No cached execution result.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default RawJsonPage;
