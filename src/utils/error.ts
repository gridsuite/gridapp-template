export function getErrorMessage(error: unknown): string | null {
    if (error instanceof Error) {
        return error.message;
    } else if (error instanceof Object && 'message' in error) {
        if (
            typeof error.message === 'string' ||
            typeof error.message === 'number' ||
            typeof error.message === 'boolean'
        ) {
            return `${error.message}`;
        } else {
            return JSON.stringify(error.message ?? undefined) ?? null;
        }
    } else if (typeof error === 'string') {
        return error;
    } else {
        return JSON.stringify(error ?? undefined) ?? null;
    }
}
