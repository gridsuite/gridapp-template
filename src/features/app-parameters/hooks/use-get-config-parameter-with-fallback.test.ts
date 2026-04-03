/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetConfigParameterWithFallback } from './use-get-config-parameter-with-fallback';

const { mockUseSelector, mockUseGetConfigParameterQuery } = vi.hoisted(() => ({
    mockUseSelector: vi.fn(),
    mockUseGetConfigParameterQuery: vi.fn(),
}));

vi.mock('react-redux', () => ({
    useSelector: mockUseSelector,
}));

vi.mock('shared/api/config-api/config-api', () => ({
    useGetConfigParameterQuery: mockUseGetConfigParameterQuery,
}));

vi.mock('../store/app-parameters.default', () => ({
    initialAppParametersState: {
        language: 'en',
        computedLanguage: 'en',
        theme: 'Dark',
    },
}));

describe('useGetConfigParameterWithFallback', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return the API value when the user is authenticated and data is available', () => {
        mockUseSelector.mockReturnValue({ id_token: 'token' });
        mockUseGetConfigParameterQuery.mockImplementation((paramName, options) =>
            options.selectFromResult({
                data: {
                    name: paramName,
                    value: 'Light',
                },
                isLoading: false,
            })
        );

        const { result } = renderHook(() => useGetConfigParameterWithFallback('theme'));

        expect(result.current.data).toBe('Light');
        expect(mockUseGetConfigParameterQuery).toHaveBeenCalledWith(
            'theme',
            expect.objectContaining({
                skip: false,
            })
        );
    });

    it('should use the fallback value when the API returns no value', () => {
        mockUseSelector.mockReturnValue({ id_token: 'token' });
        mockUseGetConfigParameterQuery.mockImplementation((_paramName, options) =>
            options.selectFromResult({
                data: undefined,
                isLoading: false,
            })
        );

        const { result } = renderHook(() => useGetConfigParameterWithFallback('theme'));

        expect(result.current.data).toBe('Dark');
    });

    it('should skip the query and use fallback data when there is no authenticated user', () => {
        mockUseSelector.mockReturnValue(null);
        mockUseGetConfigParameterQuery.mockImplementation((_paramName, options) =>
            options.selectFromResult({
                data: undefined,
                isLoading: false,
            })
        );

        const { result } = renderHook(() => useGetConfigParameterWithFallback('language'));

        expect(result.current.data).toBe('en');
        expect(mockUseGetConfigParameterQuery).toHaveBeenCalledWith(
            'language',
            expect.objectContaining({
                skip: true,
            })
        );
    });
});
