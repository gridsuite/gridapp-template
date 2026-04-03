/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppState } from 'app/store/reducer';
import { APP_NAME } from '../app/config/config';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { store } from 'app/store/store';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';

export interface ErrorWithStatus extends Error {
    status?: number;
}

export type Url = string | URL;
export type InitRequest = Partial<RequestInit>;
export type Token = string;

// const PREFIX_USER_ADMIN_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/user-admin`;

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     process.env.REACT_APP_API_PREFIX +
//     (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
//         ? `${import.meta.env.VITE_API_GATEWAY}/user-admin`
//         : process.env.REACT_APP_USER_ADMIN_URI);

const PREFIX_CONFIG_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/config-notification`;

function getToken(): Token | null {
    const state: AppState = store.getState();
    return selectAuthentication(state).user?.id_token ?? null;
}

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketBaseUrl = document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
    const webSocketUrl = `${webSocketBaseUrl}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`;

    const reconnectingWebSocket = new ReconnectingWebSocket(() => `${webSocketUrl}&access_token=${getToken()}`);
    reconnectingWebSocket.onopen = function () {
        console.info(`Connected Websocket update config ui ${webSocketUrl} ...`);
    };
    return reconnectingWebSocket;
}
