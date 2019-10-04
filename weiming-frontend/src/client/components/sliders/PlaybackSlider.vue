<script>
import './playbackSlider.scss';
import SliderMixin from './SliderMixin';

export default {
    mixins: [SliderMixin],
    methods: {
        handleSliderChange({x, y}) {
            this.$emit('playbackChange', x);
        },
        renderContents(h, x, y) {
            return <div class="playbackSlider">
                <div class="playbackSlider-background">
                    <div class="playbackSlider-fill"
                            style={{ transform: `scaleX(${x})` }} />
                    <div class="playbackSlider-line"
                        style={{ left: `${x * 100}%` }} />
                </div>
            </div>
        }
    },    
}
</script>
