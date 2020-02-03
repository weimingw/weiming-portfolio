import debounce from 'lodash/debounce';
import BaseNotifier from './BaseNotifier';

class ResizeNotifier {
    constructor() {
        this.notifier = new BaseNotifier();
    }

    attach(observers) {
        if (observers.onResize)
            this.notifier.attach(observers.onResize);
    }

    detach(observers) {
        this.notifier.attach(observers.onResize);
    }

    notify = debounce((resizeEvt) => {
        this.notifier.notify(resizeEvt);
    }, 500)
}

const resizeNotifier = new ResizeNotifier()
window.addEventListener('resize', resizeNotifier.notify);

export default resizeNotifier;
