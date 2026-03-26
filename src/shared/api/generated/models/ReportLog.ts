/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportLog = {
    message?: string;
    severity?: ReportLog.severity;
    depth?: number;
    parentId?: string;
};
export namespace ReportLog {
    export enum severity {
        UNKNOWN = 'UNKNOWN',
        TRACE = 'TRACE',
        DEBUG = 'DEBUG',
        DETAIL = 'DETAIL',
        INFO = 'INFO',
        WARN = 'WARN',
        ERROR = 'ERROR',
        FATAL = 'FATAL',
    }
}

