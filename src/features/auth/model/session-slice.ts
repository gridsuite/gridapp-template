/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft } from '@reduxjs/toolkit';
import { USER, UserAction } from '@gridsuite/commons-ui';
import { SessionState } from './types';

const initialState: SessionState = {
    user: null,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(USER, (state: Draft<SessionState>, action: UserAction) => {
            state.user = action.user;
        });
    },
});

export const sessionReducer = sessionSlice.reducer;
