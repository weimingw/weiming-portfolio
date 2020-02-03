export function makeReactive(obj) {
    const reactiveObj = {}
    Object.keys(obj).forEach(key => {
        Object.defineProperty(reactiveObj, key, {
            enumerable: true,
            get: obj[key]
        });
    });
    return reactiveObj;
}
