/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { AuthenticationActions } from '@gridsuite/commons-ui';
import { ComputedLanguageAction, LanguageAction, ThemeAction } from './actions';
import { authReducer } from './slices/authSlice';
import { sessionReducer } from './slices/sessionSlice';
import { settingsReducer } from './slices/settingsSlice';

export type { AppState, AppStateKey, RootState } from './types';

export type Actions = AuthenticationActions | ThemeAction | LanguageAction | ComputedLanguageAction;

export const reducer = combineReducers({
    session: sessionReducer,
    settings: settingsReducer,
    auth: authReducer,
});
