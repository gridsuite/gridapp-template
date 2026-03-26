/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProcessConfigFieldComparison } from './ProcessConfigFieldComparison';
/**
 * Process config comparison result
 */
export type ProcessConfigComparison = {
    processConfigUuid1?: string;
    processConfigUuid2?: string;
    identical?: boolean;
    differences?: Array<ProcessConfigFieldComparison>;
};

