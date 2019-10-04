import touchListenerNotifier from './helpers/TouchListenerNotifier';

export default {
    methods: {
        receiveTouchmove(touchEvt) { },
        receiveTouchstart(touchEvt) { },
        receiveTouchend(touchEvt) { },
    },
    mounted() {
        touchListenerNotifier.attach(this);
    },
    beforeDestroy() {
        touchListenerNotifier.detach(this);
    }
}