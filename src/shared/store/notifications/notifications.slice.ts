/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackBarNotification } from './notifications.type';

const initialState: NotificationsState = {
    queue: [],
};

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        pushNotification(state, action: PayloadAction<SnackBarNotification>) {
            state.queue.push(action.payload);
        },
        shiftNotification(state) {
            state.queue.shift();
        },
    },
});

export type NotificationsState = {
    queue: SnackBarNotification[];
};

export const { pushNotification, shiftNotification } = notificationsSlice.actions;

export const notificationsSliceReducer = notificationsSlice.reducer;
