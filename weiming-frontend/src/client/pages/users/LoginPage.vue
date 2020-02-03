<script>
import UsersPageMixin from './UsersPageMixin';
import FormMixin from '../../mixins/FormMixin';
import endpoints from '../../../common/endpoints';
import { RedirectOnSuccessMixin } from '../../mixins/RedirectOnSuccessMixin';

import { makeApiRequestToEndpoint } from '../../helpers/requestUtils';
import store, { actionKeys } from '../../vuex';

export default {
    mixins: [ UsersPageMixin, FormMixin, RedirectOnSuccessMixin ],
    store,
    methods: {
        getHeaderProps() {
            return { title: 'Login' };
        },
        getFormHeader(h) {
            return <h4>Enter your login info:</h4>
        },
        getFormItems(h) {
            return [
                this.getEmailField(h),
                this.getPasswordField(h),
                this.getSubmitButton(h),
                <p class='usersPage-paragraph'>... or use a sample account: 'user@example.com' and 'password'</p>,
                <router-link class='usersPage-paragraph usersPage-link' 
                        to={{
                            path: endpoints.users.pages.create.fullUrl,
                            query: { redirect: this.redirectObj }
                        }}>
                    ... or create an account
                </router-link>,
            ]
        },
        makeRequest(evt) {
            return makeApiRequestToEndpoint(endpoints.users.api.login, {}, this.fields);
        },
        handleSuccess(res) {
            const { email, session } = res.payload;
            this.$store.dispatch('SET_USER', email);
            this.$store.dispatch('SET_SESSION', session);

            this.redirectToSuccessWithParams(
                undefined,
                [ 'Logged in successfully' ],
                this.redirectObj,
            );
        },
        getSubmitButton(h) {
            return <button class='usersPage-button submit'
                    onClick={this.submitForm} >
                Login
            </button>
        },
    },
}
</script>
