import {
    Maybe,
    None,
    Some,
} from './maybe';

class _Iter<T> implements Iterable<T> {
    private readonly _it: Iterable<T>;

    constructor(it: Iterable<T>) {
        this._it = it;
    }

    public [Symbol.iterator](): Iterator<T> {
        return this._it[Symbol.iterator]();
    }

    public map<R>(f: (v: T) => R): _Iter<R> {
        const it = this._it;
        return Iter(function*() {
            for (const v of it) {
                yield f(v);
            }
        }());
    }

    public filter(f: (v: T) => boolean): _Iter<T> {
        const it = this._it;
        return Iter<T>(function*(): Iterable<T> {
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
                return Some(v);
            }
        }
        return None();
    }

    public first(): Maybe<T> {
        const it = this._it;
        for (const v of it) {
            return Some(v);
        }
        return None();
    }
}

export function Iter<T>(it: Iterable<T>) {
    return new _Iter(it);
}
