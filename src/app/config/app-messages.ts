import {
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    GsLangUser,
    loginEn,
    loginFr,
    topBarEn,
    topBarFr,
} from '@gridsuite/commons-ui';
import { IntlConfig } from 'react-intl/src/types';
import messagesEn from '../../shared/translations/en/common.json';
import messagesFr from '../../shared/translations/fr/common.json';
import pluginMessagesEn from '../../plugins/translations/en.json';
import pluginMessagesFr from '../../plugins/translations/fr.json';

export const appMessages: Record<GsLangUser, IntlConfig['messages']> = {
    en: {
        ...messagesEn,
        ...loginEn,
        ...topBarEn,
        ...cardErrorBoundaryEn,
        ...pluginMessagesEn, // keep it at the end to allow translation overwriting
    },
    fr: {
        ...messagesFr,
        ...loginFr,
        ...topBarFr,
        ...cardErrorBoundaryFr,
        ...pluginMessagesFr, // keep it at the end to allow translation overwriting
    },
};
