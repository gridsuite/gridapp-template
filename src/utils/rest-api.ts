/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME, getAppName } from './config-params';
import { store } from '../redux/store';
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { AppState } from '../redux/reducer';
import { User } from './auth';

export interface ErrorWithStatus extends Error {
    status?: number;
}

export type Url = string | URL;
export type InitRequest = Partial<RequestInit>;
export type Token = string;

const PREFIX_USER_ADMIN_SERVER_QUERIES = `${process.env.REACT_APP_API_GATEWAY}/user-admin`;

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     process.env.REACT_APP_API_PREFIX +
//     (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
//         ? `${process.env.REACT_APP_API_GATEWAY}/user-admin`
//         : process.env.REACT_APP_USER_ADMIN_URI);

const PREFIX_CONFIG_QUERIES = `${process.env.REACT_APP_API_GATEWAY}/config`;
const PREFIX_CONFIG_NOTIFICATION_WS = `${process.env.REACT_APP_WS_GATEWAY}/config-notification`;

function getToken(): Token | null {
    const state: AppState = store.getState();
    return state.user?.id_token ?? null;
}

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketBaseUrl = document.baseURI
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl = `${webSocketBaseUrl}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`;

    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => `${webSocketUrl}&access_token=${getToken()}`
    );
    reconnectingWebSocket.onopen = function (event: Event) {
        console.info(
            `Connected Websocket update config ui ${webSocketUrl} ...`
        );
    };
    return reconnectingWebSocket;
}

function parseError(text: string) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function handleError(response: Response): Promise<never> {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        let error: ErrorWithStatus;
        const errorJson = parseError(text);
        if (errorJson?.status && errorJson?.error && errorJson?.message) {
            error = new Error(
                `${errorName}${errorJson.status} ${errorJson.error}, message : ${errorJson.message}`
            ) as ErrorWithStatus;
            error.status = errorJson.status;
        } else {
            error = new Error(
                `${errorName}${response.status} ${response.statusText}`
            ) as ErrorWithStatus;
            error.status = response.status;
        }
        throw error;
    });
}

function prepareRequest(init?: InitRequest, token?: Token): RequestInit {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError(
            `Argument 2 of backendFetch is not an object ${typeof init}`
        );
    }
    const initCopy: RequestInit = { ...init };
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token || getToken();
    initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
    return initCopy;
}

function safeFetch(url: Url, initCopy?: InitRequest) {
    return fetch(url, initCopy).then((response: Response) =>
        response.ok ? response : handleError(response)
    );
}

export function backendFetch(
    url: Url,
    init?: InitRequest,
    token?: Token
): Promise<Response> {
    return safeFetch(url, prepareRequest(init, token));
}

export function backendFetchText(
    url: Url,
    init?: InitRequest,
    token?: Token
): Promise<string> {
    return backendFetch(url, init, token).then((safeResponse: Response) =>
        safeResponse.text()
    );
}

export function backendFetchJson(
    url: Url,
    init?: InitRequest,
    token?: Token
): Promise<unknown> {
    return backendFetch(url, init, token).then((safeResponse: Response) =>
        safeResponse.json()
    );
}

export function fetchValidateUser(user: User): Promise<boolean> {
    const sub = user?.profile?.sub;
    if (!sub) {
        return Promise.reject(
            new Error(
                `Error : Fetching access for missing user.profile.sub : ${user}`
            )
        );
    }

    console.info(`Fetching access for user...`);
    const CheckAccessUrl = `${PREFIX_USER_ADMIN_SERVER_QUERIES}/v1/users/${sub}`;
    console.debug(CheckAccessUrl);

    return backendFetch(CheckAccessUrl, { method: 'head' }, user?.id_token)
        .then((response: Response) => {
            //if the response is ok, the responseCode will be either 200 or 204 otherwise it's a Http error and it will be caught
            return response.status === 200;
        })
        .catch((error) => {
            if (error.status === 403) {
                return false;
            } else {
                throw error;
            }
        });
}

export type EnvJson = typeof import('../../public/env.json') & {
    // https://github.com/gridsuite/deployment/blob/main/docker-compose/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-dev/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-integ/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/local/env.json
    appsMetadataServerUrl?: Url;
    mapBoxToken?: string;
    //[key: string]: string;
};

function fetchEnv(): Promise<EnvJson> {
    return fetch('env.json').then((res: Response) => res.json());
}

export function fetchAuthorizationCodeFlowFeatureFlag(): Promise<boolean> {
    console.info(`Fetching authorization code flow feature flag...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/authentication.json`)
        )
        .then((res: Response) => res.json())
        .then((res: { authorizationCodeFlowFeatureFlag: boolean }) => {
            console.log(
                `Authorization code flow is ${
                    res.authorizationCodeFlowFeatureFlag
                        ? 'enabled'
                        : 'disabled'
                }`
            );
            return res.authorizationCodeFlowFeatureFlag || false;
        })
        .catch((error) => {
            console.error(error);
            console.warn(
                `Something wrong happened when retrieving authentication.json: authorization code flow will be disabled`
            );
            return false;
        });
}

export type VersionJson = {
    deployVersion?: string;
};

export function fetchVersion(): Promise<VersionJson> {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/version.json`)
        )
        .then((response: Response) => response.json())
        .catch((error) => {
            console.error(`Error while fetching the version : ${error}`);
            throw error;
        });
}

export type MetadataCommon = {
    name: string;
    url: Url;
    appColor: string;
    hiddenInAppsMenu: boolean;
};

export type MetadataStudy = MetadataCommon & {
    readonly name: 'Study';
    resources?: {
        types: string[];
        path: string;
    }[];
    predefinedEquipmentProperties?: {
        substation?: {
            region?: string[];
            tso?: string[];
            totallyFree?: unknown[];
            Demo?: string[];
        };
        load?: {
            codeOI?: string[];
        };
    };
    defaultParametersValues?: {
        fluxConvention?: string;
        enableDeveloperMode?: string; //maybe 'true'|'false' type?
        mapManualRefresh?: string; //maybe 'true'|'false' type?
    };
};

// https://github.com/gridsuite/deployment/blob/main/docker-compose/docker-compose.base.yml
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json
export type MetadataJson = MetadataCommon | MetadataStudy;

export function fetchAppsAndUrls(): Promise<MetadataJson[]> {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`)
        )
        .then((response: Response) => response.json());
}

// https://github.com/gridsuite/config-server/blob/main/src/main/java/org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter = {
    name: string;
    value: string;
};
export type ConfigParameters = ConfigParameter[];
export function fetchConfigParameters(
    appName: string = APP_NAME
): Promise<ConfigParameters> {
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

export function updateConfigParameter(
    name: string,
    value: Parameters<typeof encodeURIComponent>[0]
): Promise<never> {
    const appName = getAppName(name);
    console.info(
        `Updating config parameter '${name}=${value}' for app '${appName}'`
    );
    const updateParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}?value=${encodeURIComponent(
        value
    )}`;
    return backendFetch(updateParams, { method: 'put' }).then();
}
