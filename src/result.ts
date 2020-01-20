import {
    just,
    Maybe,
    nothing,
} from './maybe';
import {
    Bindable,
    Mappable,
} from './traits';

export interface ResultMatcher<T, E, R> {
    ok(v: T): R;
    error(v: E): R;
}

export interface Result<T, E> extends Bindable<T>, Mappable<T> {
    readonly kind: 'ok' | 'error';
    match<R>(m: ResultMatcher<T, E, R>): R;
    map<R>(f: (v: T) => R): Result<R, E>;
    bind<R, E2>(f: (v: T) => Result<R, E2>): Result<R, E | E2>;
    isOk(): boolean;
    isError(): boolean;
    ok(): Maybe<T>;
    error(): Maybe<E>;
}

class Ok<T, E> implements Result<T, E> {
    public readonly kind = 'ok';
    private readonly _result: T;
    constructor(v: T) {
        this._result = v;
    }

    public isOk() {
        return true;
    }

    public isError() {
        return false;
    }

    public map<R>(f: (v: T) => R): Result<R, E> {
        return ok(f(this._result));
    }

    public match<R>(m: ResultMatcher<T, any, R>): R {
        return m.ok(this._result);
    }

    public bind<R, E2>(f: (v: T) => Result<R, E2>): Result<R, E | E2> {
        return f(this._result);
    }

    public ok(): Maybe<T> {
        return just(this._result);
    }

    public error(): Maybe<E> {
        return nothing();
    }

    public toString(): string {
        return `Ok(${this._result})`;
    }
}

export function ok<T, E>(v: T): Result<T, E> {
    return new Ok<T, E>(v);
}

class _Error<T, E> implements Result<T, E> {
    public readonly kind = 'error';
    private readonly _error: E;
    constructor(v: E) {
        this._error = v;
    }

    public isOk() {
        return false;
    }

    public isError() {
        return false;
    }

    public bind<R, E2>(_: (v: T) => Result<R, E2>): Result<R, E | E2> {
        return error(this._error);
    }

    public map<R>(_: (v: T) => R): Result<R, E> {
        return error(this._error);
    }

    public match<R>(m: ResultMatcher<T, any, R>): R {
        return m.error(this._error);
    }

    public ok(): Maybe<T> {
        return nothing();
    }

    public error(): Maybe<E> {
        return just(this._error);
    }

    public toString(): string {
        return `Error(${this._error})`;
    }
}

export function error<T, E>(e: E): Result<T, E> {
    return new _Error(e);
}
