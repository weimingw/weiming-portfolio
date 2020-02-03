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
import { useResizeListener } from '../../../mixins/EventListeners';
import { createElement as h, onMounted, reactive } from '@vue/composition-api';

const numRows = 11;
const numPerRow = 16;

const height = getHexagonSy(numRows - 1) + hexagonHeight * 10;
const width = getHexagonSx(1, numPerRow) + hexagonWidth * 10;


export default {
    props: {
        subscribeToPlayback: {
            type: Function,
        }
    },
    setup(props, context) {
        const state = reactive({
            style: {
                height,
                width,
                transform: '',
            },
            hexagonAnimationCoordinator: new HexagonAnimationCoordinator(),
        });

        function resize() {
            const parentHeight = context.refs.el.parentElement.getBoundingClientRect().height - 56; // the parent's height, minus footer for audiobar
            const clientWidth = document.documentElement.getBoundingClientRect().width; // use window width
            const xScale = clientWidth / width;
            const yScale = parentHeight / height;
            const scale = Math.min(xScale, yScale) * 0.95;
            state.style.transform = `scale(${scale})`;
        };

        useResizeListener({
            onResize: resize,
        });

        onMounted(() => {
            resize();
            props.subscribeToPlayback(onPlayback);
        });

        function getRows() {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
                rows.push(getRow(i));
            }
            return rows;
        };

        function getRow(rowIndex) {
            const row = [];
            const numForRow = rowIndex % 2 === 0 ? numPerRow + 1 : numPerRow;
            for (let i = 0; i < numForRow; i++) {
                const key = `${rowIndex},${i}`;
                row.push(<Hexagon key={key}
                    x={i} y={rowIndex}
                    addToRegistry={addHexagon}
                    onHexagonClick={onHexagonClick} />)
            }
            return row;
        };

        function addHexagon(key, hexagon) {
            // purposefully not doing Vue.set because re-rendering for this is pointless
            state.hexagonAnimationCoordinator.addHexagon(key, hexagon);
        };

        function onHexagonClick(cx, cy, cz) {
            state.hexagonAnimationCoordinator.startWave(cx, cy, cz);
        };
        
        function onPlayback(audioPlayer) {
            const intensities = getIntensityArray(audioPlayer.analyser);
            
            for (let i = 0; i < intensities.length; i++) {
                const { cx, cy, cz } = animatedHexagons[i];
                let intensity = Math.floor(intensities[i] / 52);
                if (intensity > 0) {
                    state.hexagonAnimationCoordinator.startWave(cx, cy, cz, intensity);
                }
            }
        };

        function getIntensityArray(analyser) {
            const intensities = new Uint8Array(analyser.frequencyBinCount);

            analyser.getByteFrequencyData(intensities);
            const smushed = []
            for (let start = 0; start < intensities.length; start += 2) {
                smushed.push( (intensities[start] + intensities[start+1]) / 2 );
            }
            return smushed;
        };

        return () =>
            (<div class="hexagrid-container" 
                    style={state.style} 
                    ref="el">
                { getRows() }
            </div>)
    },
}
</script>
