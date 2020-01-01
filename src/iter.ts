import {
    just,
    Maybe,
    nothing,
} from './maybe';

interface SafeIterable<T> extends Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
    map<R>(f: (v: T) => R): SafeIterable<R>;
    filter(f: (v: T) => boolean): SafeIterable<T>;
    find(f: (v: T) => boolean): Maybe<T>;
    first(): Maybe<T>;
}

class Iter<T> implements SafeIterable<T> {
    private readonly _it: Iterable<T>;

    constructor(it: Iterable<T>) {
        this._it = it;
    }

    public [Symbol.iterator](): Iterator<T> {
        return this._it[Symbol.iterator]();
    }

    public map<R>(f: (v: T) => R): SafeIterable<R> {
        const it = this._it;
        return iter(function*() {
            for (const v of it) {
                yield f(v);
            }
        }());
    }

    public filter(f: (v: T) => boolean): SafeIterable<T> {
        const it = this._it;
        return iter<T>(function*(): Iterable<T> {
            for (const v of it) {
                if (f(v)) {
                    yield v;
                }
            }
        }());
    }

    public find(f: (v: T) => boolean): Maybe<T> {
        const it = this._it;
        for (const v of it) {
            if (f(v)) {
                return just(v);
            }
        }
        return nothing();
    }

    public first(): Maybe<T> {
        const it = this._it;
        for (const v of it) {
            return just(v);
        }
        return nothing();
    }
}

export function iter<T>(it: Iterable<T>): SafeIterable<T> {
    return new Iter(it);
}
