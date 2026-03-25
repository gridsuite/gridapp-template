/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLangUser, GsTheme } from '@gridsuite/commons-ui';
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { store } from '../../app/store';
import { APP_NAME, getAppName } from '../../app/config/app';
import { PARAM_LANGUAGE, PARAM_THEME } from '../config/parameters';
import { backendFetch, backendFetchJson } from './http';

const PREFIX_CONFIG_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/config`;
const PREFIX_CONFIG_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/config-notification`;

function getToken(): string | null {
    return store.getState().session.user?.id_token ?? null;
}

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketBaseUrl = document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
    const webSocketUrl = `${webSocketBaseUrl}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`;

    const reconnectingWebSocket = new ReconnectingWebSocket(() => `${webSocketUrl}&access_token=${getToken()}`);
    reconnectingWebSocket.onopen = function (event: Event) {
        console.info(`Connected Websocket update config ui ${webSocketUrl} ...`);
    };
    return reconnectingWebSocket;
}

// https://github.com/gridsuite/config-server/blob/main/src/main/java/org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter =
    | {
          readonly name: typeof PARAM_LANGUAGE;
          value: GsLangUser;
      }
    | {
          readonly name: typeof PARAM_THEME;
          value: GsTheme;
      };
export type ConfigParameters = ConfigParameter[];

export function fetchConfigParameters(appName: string = APP_NAME): Promise<ConfigParameters> {
    console.info(`Fetching UI configuration params for app : ${appName}`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters`;
    return backendFetchJson(fetchParams) as Promise<ConfigParameters>;
}

export function fetchConfigParameter(name: string): Promise<ConfigParameter> {
    const appName = getAppName(name);
    console.info(`Fetching UI config parameter '${name}' for app '${appName}'`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}`;
    return backendFetchJson(fetchParams) as Promise<ConfigParameter>;
}

export function updateConfigParameter(name: string, value: Parameters<typeof encodeURIComponent>[0]): Promise<never> {
    const appName = getAppName(name);
    console.info(`Updating config parameter '${name}=${value}' for app '${appName}'`);
    const updateParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}?value=${encodeURIComponent(
        value
    )}`;
    return backendFetch(updateParams, { method: 'put' }).then();
}
