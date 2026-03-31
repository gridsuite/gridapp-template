import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
    schemaFile: './openapi.json',
    apiFile: './monitor-api.ts',
    apiImport: 'api',
    outputFile: './monitor.generated.ts',
    exportName: 'monitorApi',
    hooks: true,
};

export default config;
