import BaseNotifier from './BaseNotifier';

class MouseListenerNotifier {
    constructor() {
        this.mousemoveNotifier = new BaseNotifier();
        this.mousedownNotifier = new BaseNotifier();
        this.mouseupNotifier = new BaseNotifier();
    }

    attach(observers) {
         if (observers.onMousedown)
             this.mousedownNotifier.attach(observers.onMousedown);

         if (observers.onMouseup)
            this.mouseupNotifier.attach(observers.onMouseup);

         if (observers.onMousemove)
             this.mousemoveNotifier.attach(observers.onMousemove);
    }

    detach(observers) {
        this.mousedownNotifier.detach(observers.onMousedown);
        this.mouseupNotifier.detach(observers.onMouseup);
        this.mousemoveNotifier.detach(observers.onMousemove);
    }

    notifyMousemove = (mouseEvt) => {
        this.mousemoveNotifier.notify(mouseEvt);
    }

    notifyMousedown = (mouseEvt) => {
        this.mousedownNotifier.notify(mouseEvt);
    }

    notifyMouseup = (mouseEvt) => {
        this.mouseupNotifier.notify(mouseEvt);
    }
}

const mouseListenerNotifier = new MouseListenerNotifier()
window.addEventListener('mousemove', mouseListenerNotifier.notifyMousemove);
window.addEventListener('mousedown', mouseListenerNotifier.notifyMousedown);
window.addEventListener('mouseup', mouseListenerNotifier.notifyMouseup);

export default mouseListenerNotifier;
