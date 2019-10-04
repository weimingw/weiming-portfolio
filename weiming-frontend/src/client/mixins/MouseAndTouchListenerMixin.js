import touchListenerNotifier from './helpers/TouchListenerNotifier';
import mouseListenerNotifier from './helpers/MouseListenerNotifier';

export default {
    methods: {
        receiveTouchmove(touchEvt) { },
        receiveTouchstart(touchEvt) { },
        receiveTouchend(touchEvt) { },
        
        receiveMousemove(clickEvt) { },
        receiveMousedown(clickEvt) { },
        receiveMouseup(clickEvt) { },
    },
    mounted() {
        mouseListenerNotifier.attach(this);
        touchListenerNotifier.attach(this);
    },
    beforeDestroy() {
        mouseListenerNotifier.detach(this);
        touchListenerNotifier.detach(this);
    }
}