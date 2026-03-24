/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AuthenticationRouterErrorState, CommonStoreState, GsLang, GsLangUser, GsTheme } from '@gridsuite/commons-ui';

export type SessionState = {
    user: CommonStoreState['user'];
};

export type SettingsState = {
    language: GsLang;
    computedLanguage: GsLangUser;
    theme: GsTheme;
};

export type AuthState = {
    error: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showLogin: boolean;
};

export type RootState = {
    session: SessionState;
    settings: SettingsState;
    auth: AuthState;
};

export type AppState = RootState;
export type AppStateKey = keyof SettingsState;
