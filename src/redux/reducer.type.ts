/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    AuthenticationRouterErrorState,
    CommonStoreState,
    GsLang,
    GsLangUser,
    GsTheme,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '@gridsuite/commons-ui';

export type AppState = CommonStoreState & {
    computedLanguage: GsLangUser;
    [PARAM_THEME]: GsTheme;
    [PARAM_LANGUAGE]: GsLang;

    signInCallbackError: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showAuthenticationRouterLogin: boolean;
};
