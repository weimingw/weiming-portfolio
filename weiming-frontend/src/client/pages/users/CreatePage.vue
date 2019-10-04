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
            return { title: 'Create Account' };
        },
        getFormHeader(h) {
            return <h4>Enter your info:</h4>
        },
        getFormItems(h) {
            return [
                this.getNameField(h),
                this.getEmailField(h),
                this.getPasswordField(h),
                this.getPasswordConfirmationField(h),
                this.getSubmitButton(h),
            ]
        },
        makeRequest(evt) {
            return makeApiRequestToEndpoint(
                endpoints.users.api.create,
                {}, 
                { ... this.fields, origin: location.origin });
        },
        handleSuccess(res) {
            const { email, session } = res.payload;
            this.$store.dispatch('SET_USER', email);
            this.$store.dispatch('SET_SESSION', session);

            this.redirectToSuccessWithParams(
                undefined,
                [ 'User created successfully' ],
                this.redirectObj,
            );
        },
        getSubmitButton(h) {
            return (
                <button class='usersPage-button submit'
                        onClick={this.submitForm} >
                    Create Account
                </button>
            )
        },
    },
}
</script>
