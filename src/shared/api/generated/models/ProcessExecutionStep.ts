/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProcessExecutionStep = {
    id?: string;
    stepType?: string;
    stepOrder?: number;
    status?: ProcessExecutionStep.status;
    resultId?: string;
    resultType?: ProcessExecutionStep.resultType;
    reportId?: string;
    startedAt?: string;
    completedAt?: string;
};
export namespace ProcessExecutionStep {
    export enum status {
        SCHEDULED = 'SCHEDULED',
        RUNNING = 'RUNNING',
        COMPLETED = 'COMPLETED',
        FAILED = 'FAILED',
        SKIPPED = 'SKIPPED',
    }
    export enum resultType {
        SECURITY_ANALYSIS = 'SECURITY_ANALYSIS',
    }
}

