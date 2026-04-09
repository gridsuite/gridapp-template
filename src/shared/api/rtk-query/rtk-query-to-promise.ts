type RtkQueryPromise<T> = {
    unwrap: () => Promise<T>;
    unsubscribe: () => void;
};

export function rtkQueryToPromise<T>(
    promise: RtkQueryPromise<T>,
    options?: {
        onError?: (error: unknown) => void;
    }
): Promise<T> {
    return promise
        .unwrap()
        .catch((error) => {
            options?.onError?.(error);
            throw error;
        })
        .finally(() => {
            promise.unsubscribe();
        });
}
