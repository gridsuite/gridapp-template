/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useMatch,
    useNavigate,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { UserManager } from 'oidc-client';
import {
    AuthenticationRouter,
    CardErrorBoundary,
    getPreLoginPath,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import {
    selectComputedLanguage,
    selectLanguage,
    selectTheme,
} from '../redux/actions';
import { AppState } from '../redux/reducer';
import {
    ConfigParameters,
    connectNotificationsWsUpdateConfig,
    fetchConfigParameter,
    fetchConfigParameters,
    fetchIdpSettings,
    fetchValidateUser,
} from '../utils/rest-api';
import {
    APP_NAME,
    COMMON_APP_NAME,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '../utils/config-params';
import { getComputedLanguage } from '../utils/language';
import AppTopBar, { AppTopBarProps } from './app-top-bar';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getErrorMessage } from '../utils/error';
import { AppDispatch } from '../redux/store';

const App: FunctionComponent = () => {
    const { snackError } = useSnackMessage();

    const user = useSelector((state: AppState) => state.user);

    const signInCallbackError = useSelector(
        (state: AppState) => state.signInCallbackError
    );
    const authenticationRouterError = useSelector(
        (state: AppState) => state.authenticationRouterError
    );
    const showAuthenticationRouterLogin = useSelector(
        (state: AppState) => state.showAuthenticationRouterLogin
    );

    const [userManager, setUserManager] = useState<
        AppTopBarProps['userManager']
    >({ instance: null, error: null });

    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    const location = useLocation();

    const updateParams = useCallback(
        (params: ConfigParameters) => {
            console.debug('received UI parameters : ', params);
            params.forEach((param) => {
                switch (param.name) {
                    case PARAM_THEME:
                        dispatch(selectTheme(param.value));
                        break;
                    case PARAM_LANGUAGE:
                        dispatch(selectLanguage(param.value));
                        dispatch(
                            selectComputedLanguage(
                                getComputedLanguage(param.value)
                            )
                        );
                        break;
                    default:
                        break;
                }
            });
        },
        [dispatch]
    );

    const connectNotificationsUpdateConfig =
        useCallback((): ReconnectingWebSocket => {
            const ws = connectNotificationsWsUpdateConfig();
            ws.onmessage = function (event) {
                let eventData = JSON.parse(event.data);
                if (eventData.headers?.parameterName) {
                    fetchConfigParameter(eventData.headers.parameterName)
                        .then((param) => updateParams([param]))
                        .catch((error) =>
                            snackError({
                                messageTxt: error.message,
                                headerId: 'paramsRetrievingError',
                            })
                        );
                }
            };
            ws.onerror = function (event) {
                console.error('Unexpected Notification WebSocket error', event);
            };
            return ws;
        }, [updateParams, snackError]);

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );

    const [initialMatchSigninCallbackUrl] = useState(
        useMatch({
            path: '/sign-in-callback',
        })
    );

    useEffect(() => {
        // need subfunction when async as suggested by rule react-hooks/exhaustive-deps
        (async function initializeAuthentication() {
            try {
                console.debug(
                    `auth dev mode: ${process.env.REACT_APP_USE_AUTHENTICATION}`
                );
                const initAuth =
                    process.env.REACT_APP_USE_AUTHENTICATION === 'true'
                        ? initializeAuthenticationProd(
                              dispatch,
                              initialMatchSilentRenewCallbackUrl != null,
                              fetchIdpSettings,
                              fetchValidateUser,
                              initialMatchSigninCallbackUrl != null
                          )
                        : initializeAuthenticationDev(
                              dispatch,
                              initialMatchSilentRenewCallbackUrl != null,
                              validateUserDev,
                              initialMatchSigninCallbackUrl != null
                          );
                setUserManager({
                    instance: (await initAuth) ?? null,
                    error: null,
                });
            } catch (error) {
                setUserManager({
                    instance: null,
                    error: getErrorMessage(error),
                });
            }
        })();
        // Note: dispatch and initialMatchSilentRenewCallbackUrl won't change
    }, [
        initialMatchSigninCallbackUrl,
        initialMatchSilentRenewCallbackUrl,
        dispatch,
    ]);

    useEffect(() => {
        if (user !== null) {
            fetchConfigParameters(COMMON_APP_NAME)
                .then((params) => updateParams(params))
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    })
                );

            fetchConfigParameters(APP_NAME)
                .then((params) => updateParams(params))
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    })
                );

            const ws = connectNotificationsUpdateConfig();
            return () => ws.close();
        }
    }, [
        user,
        dispatch,
        updateParams,
        snackError,
        connectNotificationsUpdateConfig,
    ]);

    return (
        <>
            <AppTopBar user={user} userManager={userManager} />
            <CardErrorBoundary>
                {user !== null ? (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Box mt={20}>
                                    <Typography
                                        variant="h3"
                                        color="textPrimary"
                                        align="center"
                                    >
                                        Connected
                                    </Typography>
                                </Box>
                            }
                        />
                        <Route
                            path="/sign-in-callback"
                            element={
                                <Navigate
                                    replace
                                    to={getPreLoginPath() || '/'}
                                />
                            }
                        />
                        <Route
                            path="/logout-callback"
                            element={
                                <h1>
                                    Error: logout failed; you are still logged
                                    in.
                                </h1>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <h1>
                                    <FormattedMessage id="PageNotFound" />
                                </h1>
                            }
                        />
                    </Routes>
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={signInCallbackError}
                        authenticationRouterError={authenticationRouterError}
                        showAuthenticationRouterLogin={
                            showAuthenticationRouterLogin
                        }
                        dispatch={dispatch}
                        navigate={navigate}
                        location={location}
                    />
                )}
            </CardErrorBoundary>
        </>
    );
};
export default App;

function validateUserDev() {
    return new Promise((resolve) =>
        window.setTimeout(() => resolve(true), 500)
    );
}
