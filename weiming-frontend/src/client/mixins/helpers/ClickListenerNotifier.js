import BaseNotifier from './BaseNotifier';

class ClickListenerNotifier extends BaseNotifier {
    constructor() {
        super();
    }

    notify = (clickEvt) => {
        this.observers.forEach(ob => ob.receiveClick(clickEvt));
    }
}

const clickNotifier = new ClickListenerNotifier()
window.addEventListener('click', clickNotifier.notify);

export default clickNotifier;
