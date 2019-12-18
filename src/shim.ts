import {
    Err,
    Ok,
    Result,
} from './result';

// SafePromise converts a `Promise<T>` to a `Promise<Result<T, E>>`
// that will allways call `Promise.then`.
export function safePromise<R, E = any>(p: Promise<R>): Promise<Result<R, E>> {
    return new Promise<Result<R, E>>((resolve, _reject) => {
        p.then((v) => resolve(Ok(v)));
        p.catch((e) => resolve(Err(e)));
    });
}

export function resultify<T, A extends any[], E = any>(
    f: (...args: A) => T,
): (...args: A) => Result<T, E> {
    return (...args: A) => {
        try {
            return Ok(f(...args));
        } catch (e) {
            return Err(e);
        }
    };
}

// safeCall calls f, if the function succeeds returns `Ok()` if the function
// throws an exception returns `Err()`
export function safeCall<T, E = any>(f: () => T): Result<T, E> {
    return resultify(f)();
}
