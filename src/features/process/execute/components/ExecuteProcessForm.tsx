import React, { useState } from 'react';
import { Alert, Box, Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { AppDispatch } from '@/app/store';
import { useExecuteProcessMutation } from '@/shared/api/monitor-api/monitor.generated';
import {
    invalidateExecutionResultCache,
    useLazyGetExecutionResultsQuery,
} from '@/features/process/result/api/execution-result-cache.api';
import {
    selectCurrentExecutionId,
    setCurrentExecutionId,
} from '@/features/process/result/store/execution-result.slice';

const schema = z.object({
    caseUuid: z.uuid(),
    parameterUuid: z.uuid(),
    userId: z.string().min(1),
    isDebug: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
    caseUuid: '',
    parameterUuid: '',
    isDebug: false,
    userId: '',
};

const ExecuteProcessForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [executeProcess, { isLoading: isSubmitting }] = useExecuteProcessMutation();
    const executionId = useSelector(selectCurrentExecutionId);
    const { control, handleSubmit } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const onSubmit = handleSubmit(async (values) => {
        setErrorMessage(null);

        try {
            const newExecutionId = await executeProcess({
                caseUuid: values.caseUuid,
                processConfigUuid: values.parameterUuid,
                isDebug: values.isDebug,
                userId: values.userId,
            }).unwrap();
            dispatch(setCurrentExecutionId(newExecutionId));
            navigate(`/raw`);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Process execution failed');
        }
    });

    return (
        <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
                <Controller
                    name="caseUuid"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="caseUuid"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            required
                        />
                    )}
                />
                <Controller
                    name="parameterUuid"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="parameterUuid"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            required
                        />
                    )}
                />
                <Controller
                    name="userId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="userId"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            required
                        />
                    )}
                />
                <FormControlLabel
                    control={
                        <Controller
                            name="isDebug"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    inputRef={field.ref}
                                    onBlur={field.onBlur}
                                    onChange={(_, checked) => field.onChange(checked)}
                                />
                            )}
                        />
                    }
                    label="isDebug"
                />
                {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? 'Executing...' : 'Execute process'}
                </Button>
                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={!executionId}
                    onClick={() => executionId && dispatch(invalidateExecutionResultCache(executionId))}
                >
                    Invalidate cache
                </Button>
            </Stack>
        </Box>
    );
};

export default ExecuteProcessForm;
