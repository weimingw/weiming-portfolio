<script>
import './header.scss';
import { getIcon } from '../../assets';
import UserMenu from '../userMenu/UserMenu.vue';

export default {
    props: {
        title: { type: String },
        renderHeaderItems: { type: Function }
    },
    render(h) {
        return (<div class="header">
            <router-link class="header-link" to="/">
                <img src={getIcon('myIcon')} class="header-icon" />
            </router-link>
            <div class="header-items">
                { this.renderHeaderItems ? 
                    this.renderHeaderItems(h) :
                    this.title}
            </div>
            <UserMenu />
        </div>)
    }
}
</script>