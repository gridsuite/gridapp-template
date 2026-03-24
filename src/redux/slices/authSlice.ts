/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft } from '@reduxjs/toolkit';
import {
    AuthenticationRouterErrorAction,
    LOGOUT_ERROR,
    LogoutErrorAction,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SIGNIN_CALLBACK_ERROR,
    SHOW_AUTH_INFO_LOGIN,
    SignInCallbackErrorAction,
    ShowAuthenticationRouterLoginAction,
    UNAUTHORIZED_USER_INFO,
    UnauthorizedUserAction,
    USER_VALIDATION_ERROR,
    UserValidationErrorAction,
} from '@gridsuite/commons-ui';
import { AuthState } from '../types';

const initialState: AuthState = {
    error: null,
    authenticationRouterError: null,
    showLogin: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(SIGNIN_CALLBACK_ERROR, (state: Draft<AuthState>, action: SignInCallbackErrorAction) => {
            state.error = action.signInCallbackError;
        });

        builder.addCase(UNAUTHORIZED_USER_INFO, (state: Draft<AuthState>, action: UnauthorizedUserAction) => {
            state.authenticationRouterError = action.authenticationRouterError;
        });

        builder.addCase(LOGOUT_ERROR, (state: Draft<AuthState>, action: LogoutErrorAction) => {
            state.authenticationRouterError = action.authenticationRouterError;
        });

        builder.addCase(USER_VALIDATION_ERROR, (state: Draft<AuthState>, action: UserValidationErrorAction) => {
            state.authenticationRouterError = action.authenticationRouterError;
        });

        builder.addCase(
            RESET_AUTHENTICATION_ROUTER_ERROR,
            (state: Draft<AuthState>, _action: AuthenticationRouterErrorAction) => {
                state.authenticationRouterError = null;
            }
        );

        builder.addCase(
            SHOW_AUTH_INFO_LOGIN,
            (state: Draft<AuthState>, action: ShowAuthenticationRouterLoginAction) => {
                state.showLogin = action.showAuthenticationRouterLogin;
            }
        );
    },
});

export const authReducer = authSlice.reducer;
