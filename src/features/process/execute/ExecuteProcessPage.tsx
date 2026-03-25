import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ExecuteProcessForm from './components/ExecuteProcessForm';

const ExecuteProcessPage = () => {
    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Execute process
                </Typography>
                <ExecuteProcessForm />
            </Box>
        </Container>
    );
};

export default ExecuteProcessPage;
