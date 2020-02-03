export function roundNumber(num, units) {
    const roundedNumString = num.toFixed(units);
    return parseFloat(roundedNumString);
}

/**
 * Converts a number into a percentage string
 * This is stupidly inefficient for what it's supposed to do,
 * but JS uses floats for everything, so this is the best we can do...
 * @param {Number} num 
 */
export function asPercentage(num) {
    return `${parseFloat((num * 100).toFixed(4))}%`;
}