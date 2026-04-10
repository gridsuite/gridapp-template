/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SnackInputs, useSnackMessage } from '@gridsuite/commons-ui';
import { useAppDispatch, useAppSelector } from 'app/store/store';
import { useEffect, useMemo } from 'react';
import { selectNotificationQueue } from 'shared/store/notifications/notifications.selectors';
import { NotificationType, shiftNotification } from 'shared/store/notifications/notifications.slice';

export function NotificationsListener() {
    const dispatch = useAppDispatch();
    const notificationQueue = useAppSelector(selectNotificationQueue);
    const { snackError, snackInfo, snackSuccess, snackWarning } = useSnackMessage();

    const lastNotification = useMemo(() => notificationQueue[0], [notificationQueue]);

    const snackMethod: Record<NotificationType, (snackInput: SnackInputs) => void> = useMemo(
        () => ({
            error: snackError,
            info: snackInfo,
            success: snackSuccess,
            warning: snackWarning,
        }),
        [snackError, snackInfo, snackSuccess, snackWarning]
    );

    useEffect(() => {
        if (!lastNotification) return;

        const payload: SnackInputs = {
            headerId: lastNotification.messageId,
            messageTxt: lastNotification.message ?? undefined,
        };

        const snack = snackMethod[lastNotification.type];

        snack(payload);

        dispatch(shiftNotification());
    }, [lastNotification, snackMethod, dispatch]);

    return null;
}
