<script>
import './slider.scss';
import { useMouseAndTouchListener } from '../../mixins/EventListeners';
import { createElement as h, reactive } from '@vue/composition-api';

export default {
    props: {
        horizontal: {
            type: Boolean,
            default: true,
        },
        renderContents: {
            type: Function,
            default: () => null,
        },
        x: {
            type: Number,
            default: 0.5,
        },
        y: {
            type: Number,
            default: 0.5,
        },
    },
    data() {
        return {
            dragging: false,
        }
    },
    setup(props, context) {
        const state = reactive({
            dragging: false
        });

        function calculateCoordinates(evt) {
            let { x, y, width, height } = context.refs.area.getBoundingClientRect();
            let evtX = evt.touches ? evt.touches[0].pageX : evt.pageX; // handle both mousedown and touch events
            let evtY = evt.touches ? evt.touches[0].pageY : evt.pageY;
            if (evtX !== undefined && evtY !== undefined) {
                let sliderX = Math.min(Math.max(0, (evtX - x) / width), 1);
                let sliderY = (1 - Math.min(Math.max(0, (evtY - y) / height), 1));
                context.emit('sliderChange', { x: sliderX, y: sliderY });
            }
        };

        function move(evt) {
            if (state.dragging) {
                calculateCoordinates(evt);
                evt.preventDefault();
            }
        };

        function startDrag(evt) {
            state.dragging = true;
            calculateCoordinates(evt);
        };

        function endDrag(evt) {
            if (state.dragging) {
                state.dragging = false;
                calculateCoordinates(evt);
            }
        };

        useMouseAndTouchListener({
            onMousemove(evt) {
                move(evt);
            },
            onTouchmove(evt) {
                move(evt);
            },
            onMousedown(evt) {
                if (context.refs.el.contains(evt.target)) {
                    startDrag(evt);
                }
            },

            onTouchstart(evt) {
               if (context.refs.el.contains(evt.touches[0].target)) {
                    startDrag(evt);
                }
            },
            onMouseup(evt) {
                endDrag(evt);
            },
            onTouchend(evt) {
                state.dragging = false;
            },
        });

        return () => 
            (<div ref="el" class="slider">
                <div class="slider-area" ref="area">
                    { props.renderContents(h, props.x, props.y) }
                </div>
            </div>);
    },
}
</script>
