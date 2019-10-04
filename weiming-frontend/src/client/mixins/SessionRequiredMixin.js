import { redirectToLoginWhenSessionRequired } from '../helpers/sessionUtils';
import store from '../vuex';

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