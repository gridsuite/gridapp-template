/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const COMMON_APP_NAME = 'common';
export const APP_NAME = 'xxx';

export const PARAMS_THEME_KEY = 'theme';
export const PARAMS_LANGUAGE_KEY = 'language';

const COMMON_CONFIG_PARAMS_NAMES = new Set([
    PARAMS_THEME_KEY,
    PARAMS_LANGUAGE_KEY,
]);

export function getAppName(paramName) {
    return COMMON_CONFIG_PARAMS_NAMES.has(paramName)
        ? COMMON_APP_NAME
        : APP_NAME;
}
