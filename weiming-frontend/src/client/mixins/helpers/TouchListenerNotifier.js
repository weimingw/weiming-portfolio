import BaseNotifier from './BaseNotifier';

class TouchListenerNotifier {
    constructor() {
        this.touchstartNotifier = new BaseNotifier();
        this.touchendNotifier = new BaseNotifier();
        this.touchmoveNotifier = new BaseNotifier();
    }

    attach(observers) {
        if (observers.onTouchstart)
            this.touchstartNotifier.attach(observers.onTouchstart);

        if (observers.onTouchend)
            this.touchendNotifier.attach(observers.onTouchend);

        if (observers.onTouchmove)
            this.touchmoveNotifier.attach(observers.onTouchmove);
    }

    detach(observers) {
        this.touchendNotifier.detach(observers.onTouchend);
        this.touchstartNotifier.detach(observers.onTouchstart);
        this.touchmoveNotifier.detach(observers.onTouchmove);
    }

    notifyTouchmove = (touchEvt) => {
        this.touchmoveNotifier.notify(touchEvt);
    }

    notifyTouchstart = (touchEvt) => {
        this.touchstartNotifier.notify(touchEvt);
    }

    notifyTouchend = (touchEvt) => {
        this.touchendNotifier.notify(touchEvt);
    }
}

const touchListenerNotifier = new TouchListenerNotifier()
window.addEventListener('touchmove', touchListenerNotifier.notifyTouchmove);
window.addEventListener('touchstart', touchListenerNotifier.notifyTouchstart);
window.addEventListener('touchend', touchListenerNotifier.notifyTouchend);

export default touchListenerNotifier;
