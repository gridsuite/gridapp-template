/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppState } from 'app/store/store.type';

export const selectAuthentication = (state: AppState) => state.authentication;
export const selectUser = (state: AppState) => selectAuthentication(state).user;
export const selectSignInCallbackError = (state: AppState) => selectAuthentication(state).signInCallbackError;

export const selectAuthenticationRouterError = (state: AppState) =>
    selectAuthentication(state).authenticationRouterError;

export const selectShowAuthenticationRouterLogin = (state: AppState) =>
    selectAuthentication(state).showAuthenticationRouterLogin;
