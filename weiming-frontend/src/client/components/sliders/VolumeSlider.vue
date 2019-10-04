<script>
import './volumeSlider.scss';
import SliderMixin from './SliderMixin';

export default { 
    mixins: [SliderMixin],
    methods: {
        handleSliderChange({x, y}) {
            this.$emit('volumeChange', y);
        },
        renderContents(h, x, y) {
            return <div class="volumeSlider">
                <div class="volumeSlider-background">
                    <div class="volumeSlider-fill"
                            style={{ transform: `scaleY(${y})` }} />
                </div>
                <div class="volumeSlider-line"
                        style={{ top: `${(1-y) * 100}%` }} />
            </div>
        },
    },
}
</script>
