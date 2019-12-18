export type Value<T> = T | (() => T);

export function unwrapValue<T>(v: Value<T>): T {
    switch (typeof v) {
        case 'function':
            return (v as any)();
        default:
            return v;
    }
}
