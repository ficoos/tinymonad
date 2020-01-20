import {
    Bindable,
    Foldable,
    Mappable,
} from './traits';
import {
    unwrapValue,
    Value,
} from './value';

export function isJust(m: Maybe<any>): boolean {
    return m.isJust();
}

export function isNothing(m: Maybe<any>): boolean {
    return m.isNothing();
}

export interface Maybe<T> extends Bindable<T>, Mappable<T>, Foldable<T> {
    readonly kind: 'just' | 'nothing';
    isJust(): boolean;
    isNothing(): boolean;
    // unwrap unwraps the value, if `Maybe` is `Nothing` throws an exception.
    unwrap(): T;
    bind<R>(f: (v: T) => Maybe<R>): Maybe<R>;
    fold(defaultValue: Value<T>): T;
    map<R>(f: (v: T) => R): Maybe<R>;
    match<R>(m: MaybeMatcher<T, R>): R;
    toString(): string;
}

export interface MaybeMatcher<T, R> {
    just: (v: T) => R;
    nothing: Value<R>;
}

class Just<T> implements Maybe<T> {
    public readonly kind = 'just';
    private readonly  _value: T;

    public constructor(value: T) {
        this._value = value;
    }

    public isJust(): boolean {
        return true;
    }

    public isNothing(): boolean {
        return false;
    }

    public bind<R>(f: (v: T) => Maybe<R>): Maybe<R> {
        return f(this._value);
    }

    public unwrap(): T {
        return this._value;
    }

    public match<R>(m: MaybeMatcher<T, R>): R {
        return m.just(this._value);
    }

    public fold(_: Value<T>): T {
        return this._value;
    }

    public map<R>(f: (v: T) => R): Maybe<R> {
        return just(f(this._value));
    }

    public toString(): string {
        return `Just(${this._value})`;
    }
}

// JustIfDefined returns `nothing` if v is undefined, otherwise returns just(v)
export function JustIfDefined<T>(v: T | undefined): Maybe<T> {
    return v !== undefined ? just(v) : nothing();
}

export function just<T>(v: T): Maybe<T> {
    return new Just(v);
}

export const _nothing: Maybe<any> = {
    kind: 'nothing',
    match<R>(m: MaybeMatcher<any, R>): R {
        return unwrapValue(m.nothing);
    },
    fold(defaultValue: Value<any>): any {
        return unwrapValue(defaultValue);
    },
    map<R>(_: (v: any) => R): Maybe<R> {
        return this;
    },
    isJust() {
        return false;
    },
    isNothing() {
        return true;
    },
    unwrap(): any {
        throw new Error('Tried to unwrap nothing');
    },
    bind<R>(_f: (v: any) => Maybe<R>): Maybe<R> {
        return this;
    },
    toString(): string {
        return 'Nothing';
    },
};

export function nothing<T>(): Maybe<T> {
    return _nothing;
}
