/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createStore, Store } from 'redux';
import { Actions, AppState, reducer } from './reducer';

export const store: Store<AppState, Actions> = createStore(reducer);
export type AppDispatch = typeof store.dispatch;
