/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';
import { baseApi } from 'shared/api/rtk-query/base-api';
import { useDispatch, useSelector } from 'react-redux';
import { listenerMiddleware } from './rtk-query-listener-middleware';
import './rtk-query-error-listener'; // start error listener by importing it here

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware).prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

if (import.meta.env.DEV && import.meta.hot) {
    import.meta.hot.accept('./reducer', () => {
        store.replaceReducer(reducer);
    });
}
