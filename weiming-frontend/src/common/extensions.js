const mapExtensionHandler = {
    get: function(target, name) {
        if (name in target) {
            const ret = target[name]
            return typeof ret === 'function' ? ret.bind(target) : ret;
        } else {
            return target.get(name);
        }
    }
};

export const createHandyMap = function(...args) {
    return new Proxy(new Map(...args), mapExtensionHandler);
}