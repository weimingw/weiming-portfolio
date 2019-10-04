<script>
import './mainPage.scss';

import Sidebar from '../sidebar/Sidebar.vue';
import Header from '../header/Header.vue';
import Footer from '../footer/Footer.vue';
import NotificationDisplay from '../notificationDisplay/NotificationDisplay.vue';
import Dialog from '../dialog/Dialog.vue';
import ClickListenerMixin from '../../mixins/ClickListenerMixin';

import mainPageAccessor from './MainPageAccessor';
import assets from '../../assets';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    mixins: [ClickListenerMixin],
    data() {
        return {
            headerProps: { },
            footerProps: {},
            sidebarOpen: false,
        }
    },
    render(h) {
        return <div class={`main`}>
            <Dialog />
            { <Sidebar open={this.sidebarOpen} /> }
            <div class="main-headerBar">
                <FontAwesomeIcon class="main-sidebarButton clickable" icon="bars" ref="sidebarButton" />
                <Header {...{props: this.headerProps}} />
            </div>
            <div class="main-content">
                <NotificationDisplay />
                <transition name="fade"  mode="out-in">
                    <router-view />
                </transition>
                <Footer {...{props: this.footerProps}} />
            </div>
        </div>
    },
    created() {
        mainPageAccessor.setInstance(this);
    },
    methods: {
        receiveClick(clickEvt) {
            if (this.$refs.sidebarButton.contains(clickEvt.target)) {
                !this.sidebarOpen ? this.toggleSidebar() : null;
            } else {
                this.sidebarOpen ? this.toggleSidebar() : null;
            }
        },
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        }
    },
}
</script>