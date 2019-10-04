import debounce from 'lodash/debounce';
import BaseNotifier from './BaseNotifier';

class ResizeNotifier extends BaseNotifier {
    constructor() {
        super();
    }

    notify = debounce((resizeEvt) => {
        this.observers.forEach(ob => ob.receiveResize(resizeEvt));
    }, 500)
}

const resizeNotifier = new ResizeNotifier()
window.addEventListener('resize', resizeNotifier.notify);

export default resizeNotifier;
