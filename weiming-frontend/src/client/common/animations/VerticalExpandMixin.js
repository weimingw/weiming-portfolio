
/**
 * Use via transition:
        <transition mode='out-in'
                onEnter={this.enterAnimation}
                onLeave={this.leaveAnimation}>
 */

export default {
    data() {
        return {
            duration: 200
        }
    },
    methods: {
        enterAnimation(el, done) {
            const height = el.getBoundingClientRect().height
            el.animate([
                { height: '0px', opacity: 0 },
                { height: `${height}px`, opacity: 1 }
            ], {
                duration: this.duration,
                easing: 'ease-out',
            }).onfinish = done;
        },
        leaveAnimation(el, done) {
            const height = el.getBoundingClientRect().height
            el.animate([
                { height: `${height}px`, opacity: 1 },
                { height: '0px', opacity: 0 }
            ], {
                duration: this.duration,
                easing: 'ease-in',
            }).onfinish = done;
        },
    },
}