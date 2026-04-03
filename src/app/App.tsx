/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useMatch, useNavigate } from 'react-router';
import {
    AuthenticationRouter,
    CardErrorBoundary,
    initializeAuthenticationProd,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { connectNotificationsWsUpdateConfig } from '../utils/rest-api';
import AppTopBar, { AppTopBarProps } from '../features/top-bar/components/app-top-bar';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getErrorMessage } from '../shared/lib/error';
import { AppRouter } from 'app/router/AppRouter';
import { AppState } from './store/reducer';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';
import { invalidateConfigQueries } from 'shared/api/config-api/config-api';
import { fetchIdpSettings } from 'shared/config/idp-settings';

const App: FunctionComponent = () => {
    const user = useSelector((state: AppState) => selectAuthentication(state).user);

    const signInCallbackError = useSelector((state: AppState) => selectAuthentication(state).signInCallbackError);
    const authenticationRouterError = useSelector(
        (state: AppState) => selectAuthentication(state).authenticationRouterError
    );
    const showAuthenticationRouterLogin = useSelector(
        (state: AppState) => selectAuthentication(state).showAuthenticationRouterLogin
    );

    const [userManager, setUserManager] = useState<AppTopBarProps['userManager']>({ instance: null, error: null });

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const location = useLocation();

    const connectNotificationsUpdateConfig = useCallback((): ReconnectingWebSocket => {
        const ws = connectNotificationsWsUpdateConfig();
        ws.onmessage = function (event) {
            let eventData = JSON.parse(event.data);
            if (eventData.headers?.parameterName) {
                invalidateConfigQueries(dispatch, eventData.headers?.parameterName);
            }
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };
        return ws;
    }, []);

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
                setUserManager({
                    instance: await initializeAuthenticationProd(
                        dispatch,
                        initialMatchSilentRenewCallbackUrl != null,
                        fetchIdpSettings,
                        initialMatchSigninCallbackUrl != null
                    ),
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
            const ws = connectNotificationsUpdateConfig();
            return () => ws.close();
        }
    }, [user, connectNotificationsUpdateConfig]);

    return (
        <>
            <AppTopBar user={user} userManager={userManager} />
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
        </>
    );
};
export default App;
