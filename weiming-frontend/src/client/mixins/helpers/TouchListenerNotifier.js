import BaseNotifier from './BaseNotifier';

class TouchListenerNotifier extends BaseNotifier {
    constructor() {
        super();
    }

    notifyTouchmove = (touchEvt) => {
        this.observers.forEach(ob => ob.receiveTouchmove(touchEvt));
    }

    notifyTouchstart = (touchEvt) => {
        this.observers.forEach(ob => ob.receiveTouchstart(touchEvt));
    }

    notifyTouchend = (touchEvt) => {
        this.observers.forEach(ob => ob.receiveTouchend(touchEvt));
    }
}

const touchListenerNotifier = new TouchListenerNotifier()
window.addEventListener('touchmove', touchListenerNotifier.notifyTouchmove);
window.addEventListener('touchstart', touchListenerNotifier.notifyTouchstart);
window.addEventListener('touchend', touchListenerNotifier.notifyTouchend);

export default touchListenerNotifier;
