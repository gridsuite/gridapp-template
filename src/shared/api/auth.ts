/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { User } from 'oidc-client';
import { backendFetch } from './http';

const PREFIX_USER_ADMIN_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/user-admin`;

// TODO remove when exported in commons-ui (src/utils/AuthService.ts)
type IdpSettings = {
    authority: string;
    client_id: string;
    redirect_uri: string;
    post_logout_redirect_uri: string;
    silent_redirect_uri: string;
    scope: string;
    maxExpiresIn?: number;
};

export function fetchValidateUser(user: User): Promise<boolean> {
    const sub = user?.profile?.sub;
    if (!sub) {
        return Promise.reject(new Error(`Error : Fetching access for missing user.profile.sub : ${user}`));
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

export function fetchIdpSettings(): Promise<IdpSettings> {
    return fetch('idpSettings.json').then((res) => res.json());
}
