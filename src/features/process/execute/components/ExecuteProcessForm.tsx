import React, { SubmitEventHandler, useState } from 'react';
import { Alert, Box, Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import { ExecuteProcessParams } from '../types/execute-process.types';
import { useExecuteProcessMutation } from '@/shared/api/rtk-generated/api';

const initialFormValues: ExecuteProcessParams = {
    caseUuid: '',
    parameterUuid: '',
    isDebug: false,
    userId: '',
};

const ExecuteProcessForm = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<ExecuteProcessParams>(initialFormValues);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [executeProcess, { isLoading: isSubmitting }] = useExecuteProcessMutation();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setErrorMessage(null);

        try {
            const executionId = await executeProcess({
                caseUuid: formValues.caseUuid,
                processConfigUuid: formValues.parameterUuid,
                isDebug: formValues.isDebug,
                userId: formValues.userId,
            }).unwrap();
            navigate(`/process-result/${executionId}`);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Process execution failed');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    label="caseUuid"
                    value={formValues.caseUuid}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, caseUuid: event.target.value }))}
                    required
                />
                <TextField
                    label="parameterUuid"
                    value={formValues.parameterUuid}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, parameterUuid: event.target.value }))}
                    required
                />
                <TextField
                    label="userId"
                    value={formValues.userId}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, userId: event.target.value }))}
                    required
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={formValues.isDebug}
                            onChange={(event) => setFormValues((prev) => ({ ...prev, isDebug: event.target.checked }))}
                        />
                    }
                    label="isDebug"
                />
                {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? 'Executing...' : 'Execute process'}
                </Button>
            </Stack>
        </Box>
    );
};

export default ExecuteProcessForm;
