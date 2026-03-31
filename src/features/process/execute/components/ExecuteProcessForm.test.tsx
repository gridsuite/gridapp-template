import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setCurrentExecutionId } from '@/features/process/result/store/execution-result.slice';
import ExecuteProcessForm from './ExecuteProcessForm';

const mocks = vi.hoisted(() => ({
    dispatch: vi.fn(),
    navigate: vi.fn(),
    executeProcess: vi.fn(),
}));

vi.mock('react-redux', () => ({
    useDispatch: () => mocks.dispatch,
    useSelector: (selector: (state: { executionResult: { currentExecutionId: string | null } }) => unknown) =>
        selector({
            executionResult: {
                currentExecutionId: null,
            },
        }),
}));

vi.mock('react-router', () => ({
    useNavigate: () => mocks.navigate,
}));

vi.mock('@/shared/api/monitor-api/monitor.generated', async () => {
    const actual = await vi.importActual<typeof import('@/shared/api/monitor-api/monitor.generated')>(
        '@/shared/api/monitor-api/monitor.generated'
    );

    return { ...actual, useExecuteProcessMutation: () => [mocks.executeProcess, { isLoading: false }] };
});

const validFormValues = {
    caseUuid: '11111111-1111-4111-8111-111111111111',
    parameterUuid: '22222222-2222-4222-8222-222222222222',
    userId: 'user-123',
};

const renderComponent = () => render(<ExecuteProcessForm />);

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('caseUuid'), validFormValues.caseUuid);
    await user.type(screen.getByLabelText('parameterUuid'), validFormValues.parameterUuid);
    await user.type(screen.getByLabelText('userId'), validFormValues.userId);
};

describe('ExecuteProcessForm', () => {
    beforeEach(() => {
        mocks.dispatch.mockReset();
        mocks.navigate.mockReset();
        mocks.executeProcess.mockReset();
    });

    it('shows validation errors and does not call the API when the form is invalid', async () => {
        const user = userEvent.setup();

        renderComponent();

        await user.click(screen.getByRole('button', { name: /execute process/i }));

        expect(await screen.findAllByText('Invalid UUID')).toHaveLength(2);
        expect(mocks.executeProcess).not.toHaveBeenCalled();
    });

    it('calls executeProcess with the right params, dispatches the result and redirects to /raw', async () => {
        const user = userEvent.setup();

        const executionId = '33333333-3333-4333-8333-333333333333';
        const unwrap = vi.fn().mockResolvedValue(executionId);
        mocks.executeProcess.mockReturnValue({ unwrap });

        renderComponent();
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: /execute process/i }));

        await waitFor(() =>
            expect(mocks.executeProcess).toHaveBeenCalledWith({
                caseUuid: validFormValues.caseUuid,
                processConfigUuid: validFormValues.parameterUuid,
                isDebug: false,
                userId: validFormValues.userId,
            })
        );

        await waitFor(() => {
            expect(mocks.dispatch).toHaveBeenCalledWith(setCurrentExecutionId(executionId));
            expect(mocks.navigate).toHaveBeenCalledWith('/raw');
        });
    });

    it('shows the API error and does not redirect when execution fails', async () => {
        const user = userEvent.setup();

        const unwrap = vi.fn().mockRejectedValue(new Error('API failed'));
        mocks.executeProcess.mockReturnValue({ unwrap });

        renderComponent();
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: /execute process/i }));

        expect(await screen.findByText('API failed')).toBeInTheDocument();

        expect(mocks.navigate).not.toHaveBeenCalled();
    });

    it('does not submit twice when the user clicks twice quickly', async () => {
        const user = userEvent.setup();

        let resolveExecution: (value: string) => void = () => undefined;

        const unwrap = vi.fn(
            () =>
                new Promise<string>((resolve) => {
                    resolveExecution = resolve;
                })
        );

        mocks.executeProcess.mockReturnValue({ unwrap });

        renderComponent();
        await fillValidForm(user);

        const submitButton = screen.getByRole('button', {
            name: /execute process/i,
        });

        await user.click(submitButton);

        // attendre que l'UI bloque
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

        expect(mocks.executeProcess).toHaveBeenCalledTimes(1);

        resolveExecution('44444444-4444-4444-8444-444444444444');

        await waitFor(() => {
            expect(mocks.navigate).toHaveBeenCalledWith('/raw');
        });
    });
});
