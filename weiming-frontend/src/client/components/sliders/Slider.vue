<script>
import './slider.scss';
import MouseAndTouchListenerMixin from '../../mixins/MouseAndTouchListenerMixin';

export default {
    mixins: [MouseAndTouchListenerMixin],
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
    methods: {
        calculateCoordinates(evt) {
            let { x, y, width, height } = this.$refs.area.getBoundingClientRect();
            let evtX = evt.touches ? evt.touches[0].pageX : evt.pageX; // handle both mousedown and touch events
            let evtY = evt.touches ? evt.touches[0].pageY : evt.pageY;
            if (evtX !== undefined && evtY !== undefined) {
                let sliderX = Math.min(Math.max(0, (evtX - x) / width), 1);
                let sliderY = (1 - Math.min(Math.max(0, (evtY - y) / height), 1));
                this.$emit('sliderChange', { x: sliderX, y: sliderY });
            }
        },
        move(evt) {
            if (this.dragging) {
                this.calculateCoordinates(evt);
                evt.preventDefault();
            }
        },
        receiveMousemove(evt) {
            this.move(evt);
        },
        receiveTouchmove(evt) {
            this.move(evt);
        },

        startDrag(evt) {
            this.dragging = true;
            this.calculateCoordinates(evt);
        },
        receiveMousedown(evt) {
            if (this.$el.contains(evt.target)) {
                this.startDrag(evt);
            }
        },
        receiveTouchstart(evt) {
            if (this.$el.contains(evt.touches[0].target)) {
                this.startDrag(evt);
            }
        },

        endDrag(evt) {
            if (this.dragging) {
                this.dragging = false;
                this.calculateCoordinates(evt);
            }
        },
        receiveMouseup(evt) {
            this.endDrag(evt);
        },
        receiveTouchend(evt) {
            this.dragging = false;
        }
    },
    render(h) {
        return <div class="slider">
            <div class="slider-area" ref="area">
                { this.renderContents(h, this.x, this.y) }
            </div>
        </div>
    }
}
</script>
