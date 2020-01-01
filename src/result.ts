import {
    just,
    Maybe,
    nothing,
 } from './maybe';

export interface ResultMatcher<T, E, R> {
    ok(v: T): R;
    err(v: E): R;
}

export interface Result<T, E> {
    readonly kind: 'ok' | 'err';
    match<R>(m: ResultMatcher<T, E, R>): R;
    map<R>(f: (v: T) => R): Result<R, E>;
    isOk(): boolean;
    isErr(): boolean;
    ok(): Maybe<T>;
    err(): Maybe<E>;
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

    public isErr() {
        return false;
    }

    public map<R>(f: (v: T) => R): Result<R, E> {
        return ok(f(this._result));
    }

    public match<R>(m: ResultMatcher<T, any, R>): R {
        return m.ok(this._result);
    }

    public ok(): Maybe<T> {
        return just(this._result);
    }

    public err(): Maybe<E> {
        return nothing();
    }

    public toString(): string {
        return `Ok(${this._result})`;
    }
}

export function ok<T, E>(v: T): Result<T, E> {
    return new Ok<T, E>(v);
}

class Err<T, E> implements Result<T, E> {
    public readonly kind = 'err';
    private readonly _error: E;
    constructor(v: E) {
        this._error = v;
    }

    public isOk() {
        return false;
    }

    public isErr() {
        return false;
    }

    public map<R>(_: (v: T) => R): Result<R, E> {
        return err(this._error);
    }

    public match<R>(m: ResultMatcher<T, any, R>): R {
        return m.err(this.err);
    }

    public ok(): Maybe<T> {
        return nothing();
    }

    public err(): Maybe<E> {
        return just(this._error);
    }

    public toString(): string {
        return `Err(${this._error})`;
    }
}

export function err<T, E>(e: E): Result<T, E> {
    return new Err(e);
}
