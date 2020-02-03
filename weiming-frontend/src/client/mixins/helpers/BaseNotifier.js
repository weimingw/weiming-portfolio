export default class BaseNotifier {
    constructor() {
        this.observers = [];
    }

    attach = (observer) => {
        this.observers.push(observer);
    }

    detach = (observer) => {
        this.observers = this.observers.filter(ob => ob != observer);
    }

    notify = (evt) => {
        this.observers.forEach(ob => ob(evt));
    }
}