import Slider from './Slider.vue';

export default {
    props: {
        x: {
            type: Number,
        },
        y: {
            type: Number,
        }
    },
    methods: {
        handleSliderChange() { },
    },
    render(h) {
        return <Slider
                x={this.x}
                y={this.y}
                renderContents={this.renderContents}
                onSliderChange={this.handleSliderChange}
        />
    }
}