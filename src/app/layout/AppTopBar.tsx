/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent } from 'react';
import { LIGHT_THEME, TopBar, UserManagerState } from '@gridsuite/commons-ui';
import ParametersDialog from '@/features/app-settings/ui/ParametersDialog';
import { APP_NAME } from '../config/config';
import PowsyblLogo from '@/assets/images/powsybl_logo.svg?react';
import AppPackage from '../../../package.json';
import { SessionState } from '@/features/auth/model/types';
import { useAppTopBar } from '@/features/topbar/hooks/use-app-top-bar';

export type AppTopBarProps = {
    user?: SessionState['user'];
    userManager: UserManagerState;
};
const AppTopBar: FunctionComponent<AppTopBarProps> = (props) => {
    const {
        additionalModulesPromise,
        appsAndUrls,
        globalVersionPromise,
        handleChangeLanguage,
        handleChangeTheme,
        hideParameters,
        languageLocal,
        onLogoClick,
        onLogoutClick,
        showParameters,
        theme,
        themeLocal,
    } = useAppTopBar(props);

    return (
        <>
            <TopBar
                appName={APP_NAME}
                appColor="grey"
                appLogo={
                    theme === LIGHT_THEME ? (
                        <PowsyblLogo /> //GridXXXLogoLight
                    ) : (
                        <PowsyblLogo /> //GridXXXLogoDark
                    )
                }
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
                onLogoutClick={onLogoutClick}
                onLogoClick={onLogoClick}
                user={props.user ?? undefined}
                appsAndUrls={appsAndUrls}
                globalVersionPromise={globalVersionPromise}
                additionalModulesPromise={additionalModulesPromise}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
            />
            <ParametersDialog showParameters={showParameters} hideParameters={hideParameters} />
        </>
    );
};
export default AppTopBar;
