/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { isRejectedWithValue } from '@reduxjs/toolkit';
import { pushNotification } from 'shared/store/notifications/notifications.slice';
import { getErrorMessage } from 'shared/lib/error';
import { listenerMiddleware } from './rtk-query-listener-middleware';
import { NotificationType } from 'shared/store/notifications/notifications.type';

type RtkQueryRejectedMetadataArgs = {
    endpointName?: string;
    originalArgs?: unknown;
    type?: 'query' | 'mutation';
};

const unsubscribe = listenerMiddleware.startListening({
    matcher: isRejectedWithValue,
    effect: (action, api) => {
        const message = getErrorMessage(action.payload);
        const actionMetadata = action.meta.arg as RtkQueryRejectedMetadataArgs;
        api.dispatch(
            pushNotification({
                messageId: actionMetadata.endpointName,
                message,
                type: NotificationType.error,
            })
        );
    },
});

// listenerMiddleware.startListening is ran on each vite HMR
// this makes the obsolete listener unsubscribe
if (import.meta.env.DEV && import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
        unsubscribe();
    });
}
