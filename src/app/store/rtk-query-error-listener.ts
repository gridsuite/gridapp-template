/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { isRejectedWithValue } from '@reduxjs/toolkit';
import { getErrorMessage } from 'shared/lib/error';
import { listenerMiddleware } from './rtk-query-listener-middleware';
import { snackRef } from 'shared/lib/snack-ref';

const unsubscribe = listenerMiddleware.startListening({
    matcher: isRejectedWithValue,
    effect: (action) => {
        snackRef.error({ messageTxt: getErrorMessage(action.payload) ?? undefined });
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
