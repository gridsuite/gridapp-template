/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppParameterState } from './use-app-parameter-state';

const { mockUseSnackMessage, mockUseUpdateConfigParameterMutation, mockUseGetConfigParameterWithFallback } = vi.hoisted(
    () => ({
        mockUseSnackMessage: vi.fn(),
        mockUseUpdateConfigParameterMutation: vi.fn(),
        mockUseGetConfigParameterWithFallback: vi.fn(),
    })
);

vi.mock('@gridsuite/commons-ui', () => ({
    useSnackMessage: mockUseSnackMessage,
}));

vi.mock('shared/api/config-api/config-api', () => ({
    useUpdateConfigParameterMutation: mockUseUpdateConfigParameterMutation,
}));

vi.mock('./use-get-config-parameter-with-fallback', () => ({
    useGetConfigParameterWithFallback: mockUseGetConfigParameterWithFallback,
}));

describe('useAppParameterState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should optimistically update the value and persist it successfully', async () => {
        const snackError = vi.fn();
        const unwrap = vi.fn().mockResolvedValue(undefined);
        const updateConfigParameter = vi.fn(() => ({ unwrap }));

        mockUseSnackMessage.mockReturnValue({ snackError });
        mockUseUpdateConfigParameterMutation.mockReturnValue([updateConfigParameter]);
        mockUseGetConfigParameterWithFallback.mockReturnValue({ data: 'Dark' });

        const { result } = renderHook(() => useAppParameterState('theme'));

        await act(async () => {
            await result.current[1]('Light');
        });

        expect(result.current[0]).toBe('Light');
        expect(updateConfigParameter).toHaveBeenCalledWith({
            name: 'theme',
            value: 'Light',
        });
        expect(snackError).not.toHaveBeenCalled();
    });

    it('should restore the previous value and report an error when the update fails', async () => {
        const snackError = vi.fn();
        const unwrap = vi.fn().mockRejectedValue(new Error('request failed'));
        const updateConfigParameter = vi.fn(() => ({ unwrap }));

        mockUseSnackMessage.mockReturnValue({ snackError });
        mockUseUpdateConfigParameterMutation.mockReturnValue([updateConfigParameter]);
        mockUseGetConfigParameterWithFallback.mockReturnValue({ data: 'Dark' });

        const { result } = renderHook(() => useAppParameterState('theme'));

        await act(async () => {
            await result.current[1]('Light');
        });

        expect(result.current[0]).toBe('Dark');
        expect(snackError).toHaveBeenCalledWith({
            messageTxt: 'request failed',
            headerId: 'paramsChangingError',
        });
    });

    it('should sync the local value when the remote parameter changes', async () => {
        const snackError = vi.fn();
        const updateConfigParameter = vi.fn();
        let currentValue = 'Dark';

        mockUseSnackMessage.mockReturnValue({ snackError });
        mockUseUpdateConfigParameterMutation.mockReturnValue([updateConfigParameter]);
        mockUseGetConfigParameterWithFallback.mockImplementation(() => ({
            data: currentValue,
        }));

        const { result, rerender } = renderHook(() => useAppParameterState('theme'));

        expect(result.current[0]).toBe('Dark');

        currentValue = 'Light';
        rerender();

        await waitFor(() => {
            expect(result.current[0]).toBe('Light');
        });

        expect(snackError).not.toHaveBeenCalled();
    });
});
