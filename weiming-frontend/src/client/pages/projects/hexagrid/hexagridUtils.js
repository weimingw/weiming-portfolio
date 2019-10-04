
const MAX_RADIUS = 4;

function getAllRelativeCoords() {
    const radiusToCoords = {}
    for (let r = 0; r <= MAX_RADIUS; r++) {
        const coordsByRadius = getRelativeCoords(r);
        radiusToCoords[r] = coordsByRadius;
    }
    return radiusToCoords;
}

function getRelativeCoords(r) {
    let relativeCoords = new Set();
    for (let i = 0; i <= r; i++) {
        relativeCoords.add(`${r},${-i},${i-r}`)
        relativeCoords.add(`${-r},${i},${r-i}`)
        relativeCoords.add(`${i},${-r},${r-i}`)
        relativeCoords.add(`${i},${r-i},${-r}`)
        relativeCoords.add(`${-i},${r},${i-r}`)
        relativeCoords.add(`${-i},${i-r},${r}`)
    }
    return [...relativeCoords.values()].map(coord => {
        let [ dx, dy, dz ] = coord.split(',').map(coord => parseInt(coord));
        return { dx, dy, dz };
    });
}

const radiusToCoords = Object.freeze(getAllRelativeCoords());

/* -- Module exports -- */
export const hexagonHeight = 1.2; // height of hexagons in rem
export const hexagonWidth = Math.sqrt(3) / 2 * hexagonHeight; // width of hexagons in rem
export const hexagonPadding = 0.35;

/**
 * Returns the y offset of the hexagon
 * @param {int} rowIndex the index of the row that the hexagon belongs to
 */
export function getHexagonSy(rowIndex) {
    return rowIndex * (hexagonHeight * 0.75 + hexagonPadding) * 10;
}

/**
 * Returns the x offset of the hexagon
 * @param {int} rowIndex the index of the row that the hexagon belongs to
 * @param {int} hexagonIndex the index of the hexagon within its row
 */
export function getHexagonSx(rowIndex, hexagonIndex) {
    if (rowIndex % 2 === 1) {
        return hexagonIndex * (hexagonWidth + hexagonPadding) * 10 + (hexagonWidth + hexagonPadding) / 2 * 10;
    } else {
        return hexagonIndex * (hexagonWidth + hexagonPadding) * 10;
    }
}

/**
 * Returns a list of cubic coordinates a certain radius away
 * from the cubic coordinate passed in
 * @param {*} cx cubic coordinate of hexagon
 * @param {*} cy cubic coordinate of hexagon
 * @param {*} cz cubic coordinate of hexagon
 * @param {*} r the radius to find coordinates for
 */
export function getCubicCoordinatesAtRadius (cx, cy, cz, r) {
    const relativeCoords = radiusToCoords[r];
    return relativeCoords.map(
        ({ dx, dy, dz }) => `${cx+dx},${cy+dy},${cz+dz}`
    );
}

export function convertCartesianToCubicCoordinates(x, y) {
    let cx =  x - (y + (y & 1)) / 2;
    let cz = y;
    let cy = -cx - cz;
    return { cx, cy, cz }
}

/* -- animation related -- */
export const animatedHexagons = [
    { cx: 1, cy: -3, cz: 2 },
    { cx: -2, cy: -6, cz: 8 },
    { cx: 5, cy: -7, cz: 2 },
    { cx: 2, cy: -10, cz: 8 },
    { cx: 9, cy: -11, cz: 2 },
    { cx: 6, cy: -14, cz: 8 },
    { cx: 13, cy: -15, cz: 2 },
    { cx: 10, cy: -18, cz: 8 },
]

export const animationDuration = 150;
export const animationScales = {
    6: 1.78,
    5: 1.6,
    4: 1.44,
    3: 1.3,
    2: 1.18,
    1: 1.08,
    0: 1
}

export class HexagonAnimationCoordinator {
    constructor() {
        /* map from cubic coordinates to  */
        this.hexagons = new Map();
        /* A ripple has the cubic coordinates of the hexagon, a radius, and an intensity */
        this.ripples = [];
    }

    addHexagon(key, hexagon) {
        this.hexagons.set(key, hexagon);
    }
    
    /**
     * Starts a wave from the hexagon at cubic coordinate of cx, cy, cz
     * @param {*} cx 
     * @param {*} cy 
     * @param {*} cz 
     * @param {*} intensity 
     */
    startWave(cx, cy, cz, intensity=4) {     
        const key = `${cx},${cy},${cz}`;   
        const hex = this.hexagons.get(key);
        if (hex) {
            this.ripples.push({
                cx, cy, cz,
                intensity,
                radius: 0
            });

            // if there's no animation already, start it; otherwise wait for the next tick
            if (!this.nextAnimation) {
                this.continueWaves();
            }
        };
    }

    continueWaves = () => {
        this.animateHexagons();
        this.processNextTick();
    };

    /**
     * Goes through each ripple, finds the hexagons to animate for a radius,
     * and animates them with the intensity it should have
     */
    animateHexagons() {
        const hexagonsToAnimate = new Map();
        this.ripples.forEach(({ cx, cy, cz, intensity, radius }) => {
            getCubicCoordinatesAtRadius(cx, cy, cz, radius).forEach(coord => {
                const hex = this.hexagons.get(coord);
                if (hex) {
                    const existingEntry = hexagonsToAnimate.get(coord);
                    if (existingEntry) {
                        hexagonsToAnimate.set(coord, Math.max(existingEntry, intensity));
                    } else {
                        hexagonsToAnimate.set(coord, intensity);
                    }
                }
            });
        });
        
        for (let [key, intensity] of hexagonsToAnimate.entries()) {
            const amplitude = animationScales[intensity];
            this.hexagons.get(key).boop(amplitude);
        }
    }

    /**
     * Goes through each ripple, ticking down intensity but increasing radius from origin
     * Filters out any ripples that will have intensity of 0, since they are redundant
     * Also makes another timeout if there's another animation to show
     */
    processNextTick() {
        this.ripples = this.ripples.filter((ripple) => {
            ripple.intensity--;
            ripple.radius++;
            return ripple.intensity > 0;
        });

        if (this.ripples.length) {
            this.nextAnimation = setTimeout(this.continueWaves, animationDuration * 0.67);
        } else {
            this.nextAnimation = null;
        }
    }
}