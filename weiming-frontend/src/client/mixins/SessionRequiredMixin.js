import { redirectToLoginWhenSessionRequired } from '../helpers/sessionUtils';
import store, { useStore } from '../vuex';

export default {
    store,
    data() {
        return {
            hasSession: this.$store.state.session && this.$store.state.user,
        }
    },
    created() {
        if (!this.hasSession) {
            redirectToLoginWhenSessionRequired();
        }
    },
}

export function useSessionRequired() {
    const store = useStore();
    const hasSession = store.state.session && store.state.user;
    if (!hasSession) {
        redirectToLoginWhenSessionRequired();
    }
    return { hasSession };
};