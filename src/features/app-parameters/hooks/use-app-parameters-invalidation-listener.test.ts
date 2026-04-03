/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppParametersInvalidationListener } from './use-app-parameters-invalidation-listener';
import ReconnectingWebSocket from 'reconnecting-websocket';

const { mockUseDispatch, mockUseSelector, mockInvalidateConfigQueries, mockConnectNotificationsWsUpdateConfig } =
    vi.hoisted(() => ({
        mockUseDispatch: vi.fn(),
        mockUseSelector: vi.fn(),
        mockInvalidateConfigQueries: vi.fn(),
        mockConnectNotificationsWsUpdateConfig: vi.fn(),
    }));

vi.mock('react-redux', () => ({
    useDispatch: mockUseDispatch,
    useSelector: mockUseSelector,
}));

vi.mock('shared/api/config-api/config-api', () => ({
    invalidateConfigQueries: mockInvalidateConfigQueries,
}));

vi.mock('shared/api/ws/config-ws', () => ({
    connectNotificationsWsUpdateConfig: mockConnectNotificationsWsUpdateConfig,
}));

const createSocket = (): Partial<ReconnectingWebSocket> => ({
    close: vi.fn(),
    onmessage: null,
    onerror: null,
});

describe('useAppParametersInvalidationListener', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('triggers config invalidation when a notification is received', () => {
        const dispatch = vi.fn();
        const socket = createSocket();

        mockUseDispatch.mockReturnValue(dispatch);
        mockUseSelector.mockReturnValue({
            user: 'userMock',
        });
        mockConnectNotificationsWsUpdateConfig.mockReturnValue(socket);

        renderHook(() => useAppParametersInvalidationListener());

        socket.onmessage?.(
            new MessageEvent('message', {
                data: JSON.stringify({
                    headers: {
                        parameterName: 'theme',
                    },
                }),
            })
        );

        expect(mockConnectNotificationsWsUpdateConfig).toHaveBeenCalledTimes(1);
        expect(mockInvalidateConfigQueries).toHaveBeenCalledWith(dispatch, 'theme');
    });

    it('does nothing when there is no authenticated user', () => {
        mockUseDispatch.mockReturnValue(vi.fn());
        mockUseSelector.mockReturnValue(null);

        renderHook(() => useAppParametersInvalidationListener());

        expect(mockConnectNotificationsWsUpdateConfig).not.toHaveBeenCalled();
        expect(mockInvalidateConfigQueries).not.toHaveBeenCalled();
    });
});
