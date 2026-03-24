/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft } from '@reduxjs/toolkit';
import {
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
    saveLocalStorageTheme,
} from '../local-storage';
import {
    ComputedLanguageAction,
    LanguageAction,
    SELECT_COMPUTED_LANGUAGE,
    SELECT_LANGUAGE,
    SELECT_THEME,
    ThemeAction,
} from '../actions';
import { SettingsState } from '../types';

const initialState: SettingsState = {
    language: getLocalStorageLanguage(),
    computedLanguage: getLocalStorageComputedLanguage(),
    theme: getLocalStorageTheme(),
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(SELECT_LANGUAGE, (state: Draft<SettingsState>, action: LanguageAction) => {
            state.language = action.language;
        });

        builder.addCase(SELECT_COMPUTED_LANGUAGE, (state: Draft<SettingsState>, action: ComputedLanguageAction) => {
            state.computedLanguage = action.computedLanguage;
        });

        builder.addCase(SELECT_THEME, (state: Draft<SettingsState>, action: ThemeAction) => {
            state.theme = action.theme;
            saveLocalStorageTheme(state.theme);
        });
    },
});

export const settingsReducer = settingsSlice.reducer;
