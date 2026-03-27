/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
    schemaFile: './api-docs.json',
    apiFile: './src/shared/api/base-api.ts',
    outputFile: './src/shared/api/rtk-generated/api.ts',
    exportName: 'api',
    hooks: true,
};

module.exports = config;
