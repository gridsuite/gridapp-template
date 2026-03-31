/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Env, Metadata } from '@gridsuite/commons-ui';
import { getErrorMessage } from '../lib/error';
import { Url } from './http';

export type EnvJson = Env & typeof import('../../../public/env.json');

function fetchEnv(): Promise<EnvJson> {
    return fetch('env.json').then((res: Response) => res.json());
}

export type VersionJson = {
    deployVersion?: string;
};

export function fetchVersion(): Promise<VersionJson> {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env: EnvJson) => fetch(`${env.appsMetadataServerUrl}/version.json`))
        .then((response: Response) => response.json())
        .catch((error) => {
            console.error(`Error while fetching the version : ${getErrorMessage(error)}`);
            throw error;
        });
}

// https://github.com/gridsuite/deployment/blob/main/docker-compose/docker-compose.base.yml
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json

export function fetchAppsAndUrls(): Promise<Metadata[]> {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env: EnvJson) => fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`))
        .then((response: Response) => response.json());
}
