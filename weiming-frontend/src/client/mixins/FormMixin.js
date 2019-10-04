import { successPageManager } from '../base/Success.vue';
import store, { actionKeys } from '../vuex';

export default {
    store,
    props: {
        className: { type: String, required: true }
    },
    data: function() {
        return {
            disabled: false,
            errorMsg: undefined,
            fields: { },
        }
    },
    methods: {
        /* See Success.vue navigateToPage */
        redirectToSuccessWithParams(header, messages, redirect=undefined) {
            successPageManager.navigateToPage(header, messages, redirect);
        },
        handleError(err) {
            
        },
        submitForm(evt) {
            evt.preventDefault();
            
            this.errorMsg = '';
            this.disabled = true;
            this.makeRequest(evt)
                .then(this.handleSuccess)
                .catch(this.handleError)
                .finally(() => this.disabled = false);
        },
        
        /* Any methods to be overridden by children */
        getFormHeader(h) { },
        getFormItems(h) { },
        makeRequest(evt) { },
        handleSuccess(res) { },
        getSubmitButton(h) { },
        
    },
    render(h) {
        return (<div class={this.className}>
            <form class={`singleColumn ${this.disabled ? 'disabled' : ''}`} ref="form">
                { this.getFormHeader(h) }
                { this.getFormItems(h) }
            </form>
        </div>)
    },
}