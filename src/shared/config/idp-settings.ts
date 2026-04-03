import { IdpSettings } from '@gridsuite/commons-ui';

export function fetchIdpSettings(): Promise<IdpSettings> {
    return fetch('idpSettings.json').then((res) => res.json());
}
