import BaseNotifier from './BaseNotifier';

class MouseListenerNotifier extends BaseNotifier {
    constructor() {
        super();
    }

    notifyMousemove = (mouseEvt) => {
        this.observers.forEach(ob => ob.receiveMousemove(mouseEvt));
    }

    notifyMousedown = (mouseEvt) => {
        this.observers.forEach(ob => ob.receiveMousedown(mouseEvt));
    }

    notifyMouseup = (mouseEvt) => {
        this.observers.forEach(ob => ob.receiveMouseup(mouseEvt));
    }
}

const mouseListenerNotifier = new MouseListenerNotifier()
window.addEventListener('mousemove', mouseListenerNotifier.notifyMousemove);
window.addEventListener('mousedown', mouseListenerNotifier.notifyMousedown);
window.addEventListener('mouseup', mouseListenerNotifier.notifyMouseup);

export default mouseListenerNotifier;
