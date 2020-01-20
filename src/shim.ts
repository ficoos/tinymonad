import {
    error,
    ok,
    Result,
} from './result';

import { just } from './maybe';

// SafePromise converts a `Promise<T>` to a `Promise<Result<T, E>>`
// that will allways call `Promise.then`.
export function safePromise<R, E = any>(p: Promise<R>): Promise<Result<R, E>> {
    return p.then(ok, error) as Promise<Result<R, E>>;
}

export function resultifyPromise<T, A extends any[], E = any>(
    f: (...args: A) => Promise<T>,
): (...args: A) => Promise<Result<T, E>> {
    return (...args: A) => f(...args).then((v) => ok(v), (e) => error(e));
}

export function resultify<T, A extends any[], E = any>(
    f: (...args: A) => T,
): (...args: A) => Result<T, E> {
    return (...args: A) => {
        try {
            return ok(f(...args));
        } catch (e) {
            return error(e);
        }
    };
}

// safeCall calls f, if the function succeeds returns `Ok()` if the function
// throws an exception returns `Err()`
export function safeCall<T, E = any>(f: () => T): Result<T, E> {
    return resultify(f)();
}
