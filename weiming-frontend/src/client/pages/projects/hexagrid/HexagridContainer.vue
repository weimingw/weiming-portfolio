<script>
import Hexagon from './Hexagon.vue';
import {
    getHexagonSx,
    getHexagonSy,
    hexagonWidth,
    hexagonHeight,
    getCubicCoordinatesAtRadius,
    HexagonAnimationCoordinator,
    animatedHexagons,
}  from './hexagridUtils';
import ResizeListenerMixin from '../../../mixins/ResizeListenerMixin';

const numRows = 11;
const numPerRow = 16;

const height = getHexagonSy(numRows - 1) + hexagonHeight * 10;
const width = getHexagonSx(1, numPerRow) + hexagonWidth * 10;


export default {
    mixins: [ResizeListenerMixin],
    props: {
        subscribeToPlayback: {
            type: Function,
        }
    },
    data() {
        return {
            style: {
                height,
                width,
                transform: '',
            },
            hexagonAnimationCoordinator: new HexagonAnimationCoordinator(),
        }
    },
    methods: {
        /* Render helper methods */
        getRows(h) {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
                rows.push(this.getRow(h, i));
            }
            return rows;
        },

        getRow(h, rowIndex) {
            const row = [];
            const numForRow = rowIndex % 2 === 0 ? numPerRow + 1 : numPerRow;
            for (let i = 0; i < numForRow; i++) {
                const key = `${rowIndex},${i}`;
                row.push(<Hexagon key={key}
                    x={i} y={rowIndex}
                    addToRegistry={this.addHexagon.bind(this)}
                    onHexagonClick={this.onHexagonClick} />)
            }
            return row;
        },
        /* Render helpers end */

        addHexagon(key, hexagon) {
            // purposefully not doing Vue.set because re-rendering for this is pointless
            this.hexagonAnimationCoordinator.addHexagon(key, hexagon);
        },
        onHexagonClick(cx, cy, cz) {
            this.hexagonAnimationCoordinator.startWave(cx, cy, cz);
        },
        onPlayback(audioPlayer) {
            const intensities = this.getIntensityArray(audioPlayer.analyser);
            
            for (let i = 0; i < intensities.length; i++) {
                const { cx, cy, cz } = animatedHexagons[i];
                let intensity = Math.floor(intensities[i] / 52);
                if (intensity > 0) {
                    this.hexagonAnimationCoordinator.startWave(cx, cy, cz, intensity);
                }
            }
        },
        getIntensityArray(analyser) {
            const intensities = new Uint8Array(analyser.frequencyBinCount);

            analyser.getByteFrequencyData(intensities);
            const smushed = []
            for (let start = 0; start < intensities.length; start += 2) {
                smushed.push( (intensities[start] + intensities[start+1]) / 2 );
            }
            return smushed;
        },
        receiveResize(evt) {
            this.resize();
        },
        resize() {
            const parentHeight = this.$el.parentElement.getBoundingClientRect().height - 56; // the parent's height, minus footer for audiobar
            const clientWidth = document.documentElement.getBoundingClientRect().width; // use window width
            const xScale = clientWidth / width;
            const yScale = parentHeight / height;
            const scale = Math.min(xScale, yScale) * 0.95;
            this.$set(this.style, 'transform', `scale(${scale})`);
        },
    },
    mounted() {
        this.resize();
        this.subscribeToPlayback(this);
    },
    render(h) {
        return (<div class="hexagrid-container" style={this.style}>
            { this.getRows(h) }
        </div>)
    },
}
</script>
