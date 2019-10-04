<script>
import endpoints from '../../../common/endpoints';
import { makeApiRequestToEndpoint, transformSearchParamStringToObject } from '../../helpers/requestUtils';
import { successPageManager } from '../../base/Success.vue';

export default {
    data() {
        return {
            errored: false,
        }
    },
    created() {
        const params = transformSearchParamStringToObject(location.search);
        makeApiRequestToEndpoint(endpoints.users.api.validate, {}, params, {}).then(res => {
            successPageManager.navigateToPage(
                'Account verified', 
                [ 'Your account has been verified!' ],
            );
        }).catch(res => this.errored = true);
    },
    methods: {
        getErrorMessage(h) {
            return [
                <h4 class="pageHeader">Verification failed</h4>,
                <p>Verification failed. Please try creating a new account.</p>,
            ]
        },
        getInProgressMessage(h) {
            return [
                <h4 class="pageHeader">Verifying</h4>,
                <p>Please wait a bit...</p>,
            ] 
        }
    },
    render(h) {
        return (<div class="usersPage layout-oneColumn layout-mediumWidth">
            { this.errored ?
                this.getErrorMessage(h) :
                this.getInProgressMessage(h) }
        </div>)
    }
}
</script>
