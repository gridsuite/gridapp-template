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
