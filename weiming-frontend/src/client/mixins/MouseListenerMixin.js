import mouseListenerNotifier from './helpers/MouseListenerNotifier';

export default {
    methods: {
        receiveMousemove(clickEvt) { },
        receiveMousedown(clickEvt) { },
        receiveMouseup(clickEvt) { },
    },
    mounted() {
        mouseListenerNotifier.attach(this);
    },
    beforeDestroy() {
        mouseListenerNotifier.detach(this);
    }
}