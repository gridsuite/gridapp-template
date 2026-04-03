/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent } from 'react';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import {
    CardErrorBoundary,
    getComputedLanguage,
    PARAM_LANGUAGE,
    PARAM_THEME,
    SnackbarProvider,
} from '@gridsuite/commons-ui';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import App from '../App';
import { store } from 'app/store/store';
import { useGetConfigParameterWithFallback } from 'features/app-parameters/hooks/use-get-config-parameter-with-fallback';
import { appMessages } from './app-messages';
import { getAppTheme } from './app-theme';

const basename = new URL(document.querySelector('base')?.href ?? '').pathname;

const AppProvidersWithStore: FunctionComponent = () => {
    const { data: language } = useGetConfigParameterWithFallback(PARAM_LANGUAGE);
    const computedLanguage = getComputedLanguage(language);
    const { data: theme } = useGetConfigParameterWithFallback(PARAM_THEME);

    return (
        <IntlProvider locale={computedLanguage} messages={appMessages[computedLanguage]}>
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={getAppTheme(theme)}>
                        <SnackbarProvider hideIconVariant={false}>
                            <CssBaseline />
                            <CardErrorBoundary>
                                <App />
                            </CardErrorBoundary>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </IntlProvider>
    );
};

const AppWrapper: FunctionComponent = () => {
    return (
        <Provider store={store}>
            <AppProvidersWithStore />
        </Provider>
    );
};

export default AppWrapper;
