import BaseNotifier from './BaseNotifier';

class ClickListenerNotifier {
    constructor() {
        this.notifier = new BaseNotifier();
    }

    attach(observers) {
        if (observers.onClick) {
            this.notifier.attach(observers.onClick);
        }
    }

    detach(observers) {
        if (observers.onClick) {
            this.notifier.detach(observers.onClick);
        }
    }

    notify = (clickEvt) => {
        this.notifier.notify(clickEvt);
    }
}

const clickNotifier = new ClickListenerNotifier()
window.addEventListener('click', clickNotifier.notify);

export default clickNotifier;
