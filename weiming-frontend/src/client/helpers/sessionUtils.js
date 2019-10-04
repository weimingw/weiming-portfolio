import store, { actionKeys } from '../vuex';
import router from '../router';
import { getCurrentPath } from './urlUtils';
import usersEndpoints from '../../common/endpoints/usersEndpoints';

export function redirectToLoginWhenSessionRequired() {
    store.dispatch(actionKeys.ADD_INFO_MESSAGE, 'You must login to use this feature. You have been redirected to the login page.');
    router.push({ path: usersEndpoints.pages.login.fullUrl, query: { redirect: getCurrentPath() }});
}
