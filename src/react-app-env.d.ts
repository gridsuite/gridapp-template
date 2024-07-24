/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference types="react-scripts" />

type EnvDev = {
    REACT_APP_USE_AUTHENTICATION: true;
    REACT_APP_SRV_STUDY_URI: string;
};

type EnvProd = {
    REACT_APP_USE_AUTHENTICATION: false;
    REACT_APP_API_GATEWAY: string;
    REACT_APP_WS_GATEWAY: string;
};

type EnvCompile = EnvProd | EnvDev;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface ProcessEnv extends EnvCompile {}
    }
}
