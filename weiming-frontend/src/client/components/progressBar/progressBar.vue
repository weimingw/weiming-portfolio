<script>
import './progressBar.scss';

export default {
    props: {
        progress: { type: Number, required: true },
        color: { type: String, default: 'blue' }
    },
    computed: {
        normalizedProgress() {
            return Math.max(Math.min(1, this.progress), 0);
        },
    },
    methods: {
        animateChange(oldProgress) {
            const oldNormalizedProgress = Math.max(Math.min(1, oldProgress), 0);

            this.$refs.progress.animate([
                { transform: `scaleX(${oldNormalizedProgress})` },
                { transform: `scaleX(${this.normalizedProgress})` }
            ], {
                duration: 250,
                easing: 'ease-out',
            });
        },
    },
    mounted() {
        this.animateChange(0);
    },
    watch: {
        progress(progress, oldProgress) {
            this.animateChange(oldProgress);
        },
    },
    render(h) {
        return <div class='progressBar'>
            <div ref='progress'
                    class={`progressBar-progress ${this.color}Background`}
                    style={{ transform: `scaleX(${this.normalizedProgress})` }} />
        </div>
    }
}
</script>