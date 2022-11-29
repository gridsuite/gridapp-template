/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME, getAppName } from './config-params';
import { store } from '../redux/store';
import ReconnectingWebSocket from 'reconnecting-websocket';

const PREFIX_USER_ADMIN_SERVER_QUERIES =
    process.env.REACT_APP_API_GATEWAY + '/user-admin';

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     process.env.REACT_APP_API_PREFIX +
//     (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
//         ? process.env.REACT_APP_API_GATEWAY + '/user-admin'
//         : process.env.REACT_APP_USER_ADMIN_URI);

const PREFIX_CONFIG_QUERIES = process.env.REACT_APP_API_GATEWAY + '/config';
const PREFIX_CONFIG_NOTIFICATION_WS =
    process.env.REACT_APP_WS_GATEWAY + '/config-notification';

function getToken() {
    const state = store.getState();
    return state.user.id_token;
}

export function connectNotificationsWsUpdateConfig() {
    const webSocketBaseUrl = document.baseURI
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl =
        webSocketBaseUrl +
        PREFIX_CONFIG_NOTIFICATION_WS +
        '/notify?appName=' +
        APP_NAME;

    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => webSocketUrl + '&access_token=' + getToken()
    );
    reconnectingWebSocket.onopen = function (event) {
        console.info(
            'Connected Websocket update config ui ' + webSocketUrl + ' ...'
        );
    };
    return reconnectingWebSocket;
}

function handleResponse(response, isJson) {
    if (response.ok) {
        return isJson ? response.json() : response;
    } else {
        return response.text().then((text) => {
            return Promise.reject({
                message: text ? text : response.statusText,
                status: response.status,
                statusText: response.statusText,
            });
        });
    }
}

function backendFetch(url, init, isJson, withAuth = true) {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError(
            'Argument 2 of backendFetch is not an object' + typeof init
        );
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    if (withAuth) {
        initCopy.headers.append('Authorization', 'Bearer ' + getToken());
    }

    return fetch(url, initCopy).then((response) =>
        handleResponse(response, isJson)
    );
}

export function fetchValidateUser(user) {
    const sub = user?.profile?.sub;
    if (!sub)
        return Promise.reject(
            new Error(
                'Error : Fetching access for missing user.profile.sub : ' + user
            )
        );

    console.info(`Fetching access for user...`);
    const CheckAccessUrl =
        PREFIX_USER_ADMIN_SERVER_QUERIES + `/v1/users/${sub}`;
    console.debug(CheckAccessUrl);

    return backendFetch(
        CheckAccessUrl,
        {
            method: 'head',
            headers: {
                Authorization: 'Bearer ' + user?.id_token,
            },
        },
        false,
        false
    )
        .then((response) => {
            if (response.status === 200) return true;
            else if (response.status === 204) return false;
        })
        .catch((error) => {
            if (error.status === 403) return false;
            else throw new Error(error.status + ' ' + error.statusText);
        });
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return backendFetch('env.json', undefined, true).then((res) => {
        return backendFetch(
            res.appsMetadataServerUrl + '/apps-metadata.json',
            undefined,
            true,
            false
        );
    });
}

export function fetchConfigParameters(appName) {
    console.info('Fetching UI configuration params for app : ' + appName);
    const fetchParams =
        PREFIX_CONFIG_QUERIES + `/v1/applications/${appName}/parameters`;
    return backendFetch(fetchParams, undefined, true);
}

export function fetchConfigParameter(name) {
    const appName = getAppName(name);
    console.info(
        "Fetching UI config parameter '%s' for app '%s' ",
        name,
        appName
    );
    const fetchParams =
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}`;
    return backendFetch(fetchParams, undefined, true);
}

export function updateConfigParameter(name, value) {
    const appName = getAppName(name);
    console.info(
        "Updating config parameter '%s=%s' for app '%s' ",
        name,
        value,
        appName
    );
    const updateParams =
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}?value=` +
        encodeURIComponent(value);
    return backendFetch(updateParams, { method: 'put' }, false);
}
