import React from 'react';
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useGetProcessResultQuery } from './api/process-result.api';

const ProcessResultPage = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { data, error, isLoading } = useGetProcessResultQuery(uuid ?? '', {
        pollingInterval: 2000,
        skip: !uuid,
    });

    console.log('uuid', uuid);

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Process result
                </Typography>
                {!uuid ? <Alert severity="error">Missing uuid</Alert> : null}
                {isLoading ? <CircularProgress /> : null}
                {error ? <Alert severity="error">{JSON.stringify(error, null, 2)}</Alert> : null}
                {!isLoading && !error && uuid ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
            </Box>
        </Container>
    );
};

export default ProcessResultPage;
