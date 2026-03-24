/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import {
    AuthenticationRouter,
    CardErrorBoundary,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { selectComputedLanguage, selectLanguage, selectTheme } from '../features/settings/model/actions';
import {
    ConfigParameters,
    connectNotificationsWsUpdateConfig,
    fetchConfigParameter,
    fetchConfigParameters,
    fetchIdpSettings,
    fetchValidateUser,
} from '../shared/lib/rest-api';
import { APP_NAME, COMMON_APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../shared/lib/config-params';
import { getComputedLanguage } from '../shared/lib/language';
import AppTopBar, { AppTopBarProps } from '../app/layout/AppTopBar';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getErrorMessage } from '../shared/lib/error';
import { AppDispatch } from '../app/store';
import { selectAuth, selectUser } from '../features/auth/model/selectors';
import AppLayout from '../app/layout/AppLayout';
import AppRouter from '../app/router/AppRouter';

const App: FunctionComponent = () => {
    const { snackError } = useSnackMessage();

    const user = useSelector(selectUser);
    const auth = useSelector(selectAuth);
    const signInCallbackError = auth.error;
    const authenticationRouterError = auth.authenticationRouterError;
    const showAuthenticationRouterLogin = auth.showLogin;

    const [userManager, setUserManager] = useState<AppTopBarProps['userManager']>({ instance: null, error: null });

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
                        dispatch(selectComputedLanguage(getComputedLanguage(param.value)));
                        break;
                    default:
                        break;
                }
            });
        },
        [dispatch]
    );

    const connectNotificationsUpdateConfig = useCallback((): ReconnectingWebSocket => {
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
                console.debug(`auth dev mode: ${import.meta.env.VITE_USE_AUTHENTICATION}`);
                const initAuth =
                    import.meta.env.VITE_USE_AUTHENTICATION === 'true'
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
    }, [initialMatchSigninCallbackUrl, initialMatchSilentRenewCallbackUrl, dispatch]);

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
    }, [user, dispatch, updateParams, snackError, connectNotificationsUpdateConfig]);

    return (
        <AppLayout topBar={<AppTopBar user={user} userManager={userManager} />}>
            <CardErrorBoundary>
                {user !== null ? (
                    <AppRouter />
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={signInCallbackError}
                        authenticationRouterError={authenticationRouterError}
                        showAuthenticationRouterLogin={showAuthenticationRouterLogin}
                        dispatch={dispatch}
                        navigate={navigate}
                        location={location}
                    />
                )}
            </CardErrorBoundary>
        </AppLayout>
    );
};
export default App;

function validateUserDev(): Promise<boolean> {
    return new Promise((resolve) => window.setTimeout(() => resolve(true), 500));
}
