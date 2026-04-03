import {
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
} from './app-parameters.local-storage';
import { AppParameters } from './app-parameters.type';

export const initialAppParametersState: AppParameters = {
    language: getLocalStorageLanguage(),
    computedLanguage: getLocalStorageComputedLanguage(),
    theme: getLocalStorageTheme(),
};
