/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { AuthenticationActions } from '@gridsuite/commons-ui';
import { authReducer } from '@/features/auth/model/auth-slice';
import { sessionReducer } from '@/features/auth/model/session-slice';
import { ComputedLanguageAction, LanguageAction, ThemeAction } from '@/features/app-settings/store/actions';
import { settingsReducer } from '@/features/app-settings/store/settings-slice';
import { AuthState, SessionState } from '@/features/auth/model/types';
import { SettingsState } from '@/features/app-settings/store/types';
import executionResultReducer from '@/features/process/result/store/execution-result.slice';
import { monitorApi } from '@/shared/api/monitor-api/monitor.generated';

export type RootState = {
    session: SessionState;
    settings: SettingsState;
    auth: AuthState;
    executionResult: ReturnType<typeof executionResultReducer>;
    [monitorApi.reducerPath]: ReturnType<typeof monitorApi.reducer>;
};

export type AppState = RootState;
export type Actions = AuthenticationActions | ThemeAction | LanguageAction | ComputedLanguageAction;

export const reducer = combineReducers({
    session: sessionReducer,
    settings: settingsReducer,
    auth: authReducer,
    executionResult: executionResultReducer,
    [monitorApi.reducerPath]: monitorApi.reducer,
});
