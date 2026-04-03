/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PARAM_LANGUAGE, PARAM_THEME } from '@gridsuite/commons-ui';

export const COMMON_APP_NAME = 'common';
export const APP_NAME = 'XXX';

export type AppConfigParameter = typeof PARAM_THEME | typeof PARAM_LANGUAGE | string;

export type AppConfigType = typeof COMMON_APP_NAME | typeof APP_NAME;
