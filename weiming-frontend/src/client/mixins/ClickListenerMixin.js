import clickListenerNotifier from './helpers/ClickListenerNotifier';

export default {
    methods: {
        receiveClick(clickEvt) {
            console.warn("Receive isn't implemented for a click listener component");
        }
    },
    mounted() {
        clickListenerNotifier.attach(this);
    },
    beforeDestroy() {
        clickListenerNotifier.detach(this);
    }
}