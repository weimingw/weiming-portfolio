<script>
import './mainPage.scss';

import Loading from '../../base/Loading.vue';
import Sidebar from '../sidebar/Sidebar.vue';
import Header from '../header/Header.vue';
import Footer from '../footer/Footer.vue';
import NotificationDisplay from '../notificationDisplay/NotificationDisplay.vue';
import Dialog from '../dialog/Dialog.vue';
import { useClickListener } from '../../mixins/EventListeners';

import mainPageAccessor from './MainPageAccessor';
import  { getImageComponent } from '../../assets';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createElement as h, reactive, ref } from '@vue/composition-api';

export default {
    setup(props, context) {
        const state = reactive({
            headerProps: { },
            footerProps: { },
            sidebarOpen: false,
            loading: false,
        });
        const functions = {
            openSidebar() {
                state.sidebarOpen = true;
            },
            closeSidebar() {
                state.sidebarOpen = false;
            },
        };
        mainPageAccessor.setInstance(state, functions);

        /* Things that won't work until Vue 3.0 comes out */
        // const $sidebarRef = ref(null);
        // const $sidebarButton = ref(null);
        useClickListener({
            onClick(clickEvt) {
                if (!context.refs.sidebarButton.contains(clickEvt.target)) {
                    state.sidebarOpen && !context.refs.sidebar.$el.contains(clickEvt.target) ? 
                        functions.closeSidebar() : 
                        null;
                }
            }
        });

        return () => (<div class={`main`}>
            <Dialog />
            { <Sidebar ref="sidebar" open={state.sidebarOpen} /> }
            <div class="main-headerBar">
                <FontAwesomeIcon class="main-sidebarButton clickable" 
                        onClick={functions.openSidebar}
                        icon="bars" 
                        ref="sidebarButton" />
                <Header {...{props: state.headerProps}} />
            </div>
            <div class="main-content">
                <NotificationDisplay />
                <transition name="fade"  mode="out-in">
                    { state.loading ?
                        <Loading /> :
                        <router-view />
                    }
                </transition>
                <Footer {...{props: state.footerProps}} />
                { 
                    /* Hidden 'loading' icon attached so that we load this image on loading the app, before we ever need it... */
                    getImageComponent(h, 'loading', { className: 'hidden' })
                }
            </div>
        </div>)
    }
}
</script>