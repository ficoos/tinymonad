import {
    unwrapValue,
    Value,
} from './value';

export interface Maybe<T> {
    readonly kind: 'some' | 'none';
    isSome(): boolean;
    isNone(): boolean;
    // unwrap unwraps the value, if `Maybe` is `None` throws an exception.
    unwrap(): T;
    fold(defaultValue: Value<T>): T;
    map<R>(f: (v: T) => R): Maybe<R>;
    match<R>(m: MaybeMatcher<T, R>): R;
}

export interface MaybeMatcher<T, R> {
    some: (v: T) => R;
    none: Value<R>;
}

// tslint:disable-next-line: class-name
class _Some<T> implements Maybe<T> {
    public readonly kind = 'some';
    private readonly  _value: T;

    public constructor(value: T) {
        this._value = value;
    }

    public isSome(): boolean {
        return true;
    }

    public isNone(): boolean {
        return false;
    }

    public unwrap(): T {
        return this._value;
    }

    public match<R>(m: MaybeMatcher<T, R>): R {
        return m.some(this._value);
    }

    public fold(_: Value<T>): T {
        return this._value;
    }

    public map<R>(f: (v: T) => R): Maybe<R> {
        return Some(f(this._value));
    }

    public toString(): string {
        return `Some(${this._value})`;
    }
}

// SomeIF returns None if v is null or undefined, otherwise returns Some(v)
export function SomeIf<T>(v: T | undefined | null): Maybe<T> {
    return v !== undefined && v !== null ? Some(v) : None();
}

export function Some<T>(v: T): Maybe<T> {
    return new _Some(v);
}

// tslint:disable-next-line: variable-name
export const _None = {
    kind: 'none',
    match<R>(m: MaybeMatcher<any, R>): R {
        return unwrapValue(m.none);
    },
    fold(defaultValue: Value<any>): any {
        return unwrapValue(defaultValue);
    },
    map<R>(_: (v: any) => R): Maybe<R> {
        return this;
    },
    isSome() {
        return false;
    },
    isNone() {
        return true;
    },
    unwrap(): any {
        throw new Error('Tried to unwrap a none value');
    },
    toString(): string {
        return 'None';
    },
} as Maybe<any>;

export function None<T>(): Maybe<T> {
    return _None;
}
