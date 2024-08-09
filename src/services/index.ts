/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    AppsMetadataComSvc,
    ConfigComSvc,
    ConfigNotificationComSvc,
    DirectoryComSvc,
    ExploreComSvc,
    setCommonServices,
    StudyComSvc,
    UrlString,
    UserAdminComSvc,
} from '@gridsuite/commons-ui';
import AppLocalSvc from './app-local';
import { getUser } from '../redux/store';
import { APP_NAME } from '../utils/config-params';

export type { EnvJson } from './app-local';

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     process.env.REACT_APP_API_PREFIX +
//     (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
//         ? `${process.env.REACT_APP_API_GATEWAY}/user-admin`
//         : process.env.REACT_APP_USER_ADMIN_URI);

export const appLocalSrv = new AppLocalSvc(),
    appsMetadataSrv = new AppsMetadataComSvc(appLocalSrv),
    configSrv = new ConfigComSvc(APP_NAME, getUser, process.env.REACT_APP_API_GATEWAY as UrlString),
    configNotificationSrv = new ConfigNotificationComSvc(getUser, process.env.REACT_APP_WS_GATEWAY as UrlString),
    directorySrv = new DirectoryComSvc(getUser, process.env.REACT_APP_API_GATEWAY as UrlString),
    exploreSrv = new ExploreComSvc(getUser, process.env.REACT_APP_API_GATEWAY as UrlString),
    studySrv = new StudyComSvc(getUser, process.env.REACT_APP_API_GATEWAY as UrlString),
    userAdminSrv = new UserAdminComSvc(getUser, process.env.REACT_APP_API_GATEWAY as UrlString);

setCommonServices(
    appLocalSrv,
    appsMetadataSrv,
    configSrv,
    configNotificationSrv,
    directorySrv,
    exploreSrv,
    studySrv,
    userAdminSrv
);
