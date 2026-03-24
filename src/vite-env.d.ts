/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_USE_AUTHENTICATION: string;
    readonly VITE_API_GATEWAY?: string;
    readonly VITE_WS_GATEWAY?: string;
    readonly VITE_SRV_STUDY_URI?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
