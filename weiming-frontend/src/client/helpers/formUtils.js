
/**
 * Because the API expects things to be in snake_case,
 * we need a simple conversion from one to the other
 * @param {} str 
 */
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export function convertPayloadToSnakeCase(payload) {
    return Object.keys(payload)
        .filter(key => payload[key] !== undefined)
        .reduce((acc, val) => {
            acc[camelToSnakeCase(val)] = payload[val];
            return acc;
        }, {});
}

export function wrapInField(h, component, options={}) {
    const {
        className = '',
        name = '',
        label = '',
    } = options;
    return <div class={`field ${className}`}>
        { label ? <label for={name}> {label} </label> : null }
        { component }
    </div>;
}