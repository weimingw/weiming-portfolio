import resizeNotifier from './helpers/ResizeNotifier';

export default {
    methods: {
        receiveResize(resizeEvt) {
            console.warn("Receive isn't implemented for a resize listener component");
        }
    },
    mounted() {
        resizeNotifier.attach(this);
    },
    beforeDestroy() {
        resizeNotifier.detach(this);
    }
}