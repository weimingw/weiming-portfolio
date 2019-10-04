<script>
import store, { actionKeys } from '../../vuex';
import { successPageManager } from '../../base/Success.vue';
import { RedirectOnSuccessMixin } from '../../mixins/RedirectOnSuccessMixin';

export default {
    store,
    mixins: [ RedirectOnSuccessMixin ],
    mounted() {
        this.$store.dispatch('CLEAR_SESSION');
        successPageManager.navigateToPage(
            'Logged Out',
            [ 'Successfully logged out' ],
            this.redirectObj,
        );
    },
    render(h) {
        return <div class='usersPage layout-oneColumn layout-mediumWidth'>
            <h4 class="pageHeader">Logging Out</h4>
            <div>This shouldn't take long</div>
        </div>
    },
}
</script>
