/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppState } from 'app/store/store.type';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invalidateConfigQueries } from 'shared/api/config-api/config-api';
import { connectNotificationsWsUpdateConfig } from 'shared/api/ws/config-ws';

type ConfigNotificationData = {
    headers?: {
        parameterName?: string;
    };
};

export const useAppParametersInvalidationListener = () => {
    const user = useSelector((state: AppState) => selectAuthentication(state).user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user === null) {
            return undefined;
        }

        const ws = connectNotificationsWsUpdateConfig();
        ws.onmessage = function (event) {
            const eventData = JSON.parse(event.data) as ConfigNotificationData;
            if (eventData.headers?.parameterName) {
                invalidateConfigQueries(dispatch, eventData.headers.parameterName);
            }
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };

        return () => ws.close();
    }, [dispatch, user]);
};
