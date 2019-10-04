<script>
import { getImageComponent } from '../../../assets/index';
import {
    hexagonHeight,
    hexagonWidth,
    hexagonPadding,
    getHexagonSy,
    getHexagonSx,
    animationDuration,
} from './hexagridUtils';

const upDuration = animationDuration * 0.66;
const downDuration = animationDuration - upDuration;

const hexagonOptions = {
    className: 'hexagrid-hexagon',
    style: {
        width: `${hexagonWidth}rem`,
        height: `${hexagonHeight}rem`,
    },
}

export default {
    props: {
        x: {
            default: 0,
            type: Number,
        },
        y: {
            default: 0,
            type: Number,
        },
        addToRegistry: { // call on hexagon mount
            default: () => {},
            type: Function,
        }
    }, 
    data() {
        return {
            width: 0,
            height: 0,
        }
    },
    computed: {
        sx() { // display coordinate for x; an offset to translate x by
            return getHexagonSx(this.y, this.x);
        }, 
        sy() { // display coordinate for y; an offset to translate y by
            return getHexagonSy(this.y);
        },

        cx () { // cubic coordinate of x; see https://www.redblobgames.com/grids/hexagons/
            return this.x - (this.y - (this.y & 1)) / 2;
        },
        cy () { // cubic coordinate of y
            return -this.cx - this.cz;
        },
        cz () { // cubic coordinate of z
            return this.y;
        }
    },
    methods: {
        getHexagon(h) {
            this.hexagon = getImageComponent(h, 'hexagon', hexagonOptions);
            return this.hexagon;
        },

        onClick() {
            this.$emit('hexagonClick', this.cx, this.cy, this.cz);
        },
        boop(intensity) {
            this.hexagon.elm.animate([
                { transform: 'scale(1)' },
                { transform: `scale(${intensity})` }
            ], {
                duration: upDuration,
                easing: 'linear',
            }).onfinish = () => this.animateDown(intensity);
        },
        animateDown(intensity) {
            this.hexagon.elm.animate([
                { transform: `scale(${intensity})` },
                { transform: 'scale(1)' },
            ], {
                duration: downDuration,
                easing: 'linear',
            });
        },
    },
    mounted() {
        this.addToRegistry(`${this.cx},${this.cy},${this.cz}`, this);
    },
    render(h) {
        return  (
            <div class='hexagrid-hexagonWrapper'
                    id={`${this.cx},${this.cy},${this.cz}`}
                    style={{ transform: `translate(${this.sx}px, ${this.sy}px)` }}
                    onClick={this.onClick}>
                { this.getHexagon(h) }
            </div>
        );
    }
}
</script>
