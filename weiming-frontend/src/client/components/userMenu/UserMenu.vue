<script>
import './userMenu.scss';
import endpoints from '../../../common/endpoints';
import { getImageComponent } from '../../assets';
import store, { actionKeys } from '../../vuex';
import { makeApiRequestToEndpoint } from '../../helpers/requestUtils';
import { getCurrentPath } from '../../helpers/urlUtils';

import Dropdown from '../../components/dropdown/Dropdown.vue';

export default {
    store,
    props: {
        title: { type: String },
        renderHeaderItems: { type: Function }
    },
    methods: {
        hasSession() {
            return this.user && this.session;
        },
        renderContents(h, collapse) {
            return this.hasSession() ?
                this.getLoggedInContents(h, collapse) :
                this.getLoggedOutContents(h, collapse);
        },
        getLoggedInContents(h, collapse) {
            return <div class="userMenu-menu" onClick={collapse}>
                <router-link class="userMenu-menuItem"
                        to={endpoints.users.pages.update.fullUrl}>
                    Update your account
                </router-link>
                <router-link class="userMenu-menuItem"
                        to={{
                            path: endpoints.users.pages.logout.fullUrl,
                            query: { redirect: getCurrentPath() },
                        }}>
                    Logout
                </router-link>
            </div>
        },
        getLoggedOutContents(h, collapse) {
            return <div class="userMenu-menu" onClick={collapse}>
                <router-link class="userMenu-menuItem"
                        to={endpoints.users.pages.login.fullUrl}>
                    Login
                </router-link>
                <router-link class="userMenu-menuItem"
                        to={endpoints.users.pages.create.fullUrl}>
                    Create Account
                </router-link>
            </div>
        },
        renderIcon(h) {
            return this.hasSession() ?
                getImageComponent(h, "user-cog", { className: 'userMenu-icon' }) :
                getImageComponent(h, "sign-in-alt", { className: 'userMenu-icon' });
        },
        getLink() {
            return this.hasSession() ?
                endpoints.users.pages.update.fullUrl :
                endpoints.users.pages.login.fullUrl;
        },
        notify(key, val) {
            this[key] = val;
        },
    },
    created() {
        if (this.user && this.session) {
            makeApiRequestToEndpoint(endpoints.users.api.verifySession, { }, { }, { })
                    .catch(res => this.$store.dispatch('CLEAR_SESSION'));
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        session() {
            return this.$store.state.session
        },
    },
    render(h) {
        return <Dropdown className='userMenu clickable'
                rightAlign={true}
                expandOnHover={true}
                renderButton={this.renderIcon} 
                renderContents={this.renderContents} />
    }
}
</script>