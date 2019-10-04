<script>
import UsersPageMixin from './UsersPageMixin';
import FormMixin from '../../mixins/FormMixin';
import SessionRequiredMixin from '../../mixins/SessionRequiredMixin';
import endpoints from '../../../common/endpoints';

import { makeApiRequestToEndpoint } from '../../helpers/requestUtils';
import store, { actionKeys } from '../../vuex';

export default {
    mixins: [ UsersPageMixin, FormMixin, SessionRequiredMixin ],
    store,
    methods: {
        getHeaderProps() {
            return { title: 'Create Account' };
        },
        getFormHeader(h) {
            return <h4>Update your info by entering your password:</h4>
        },
        getFormItems(h) {
            return [
                this.getPasswordField(h),
                <h4>and anything you want to change:</h4>,
                this.getNewNameField(h),
                // this.getNewEmailField(h),
                this.getNewPasswordField(h),
                this.getNewPasswordConfirmationField(h),
                this.getSubmitButton(h),
            ]
        },
        makeRequest(evt) {
            return makeApiRequestToEndpoint(endpoints.users.api.edit, {}, this.fields);
        },
        handleSuccess(res) {
            const { email } = res.payload;
            this.$store.dispatch('SET_USER', email);

            this.redirectToSuccessWithParams(
                undefined,
                [ 'Account updated successfully' ],
            );
        },
        getSubmitButton(h) {
            return (
                <button class='usersPage-button submit'
                        onClick={this.submitForm} >
                    Update Account
                </button>
            )
        },
    },
}
</script>
