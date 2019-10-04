<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './sidebar.scss';
import SidebarGrouping from './SidebarGrouping.vue';
import endpoints from '../../../common/endpoints';

import { getIcon } from '../../assets';

let categories = [...endpoints.entries()]
        .filter(([categoryKey, category]) => category.showInSidebar)
        .map(([categoryKey, category]) => {
            return {
                ...category,
                key: categoryKey,
                pages: [...category.pages.entries()].map(([pageKey, page]) => 
                    ({
                        key: pageKey,
                        ...page
                    })
                )
            };
        });

export default {
    props: {
        icon: { type: String },
        header: { type: String, default: 'Weiming Wu' },
        open: { type: Boolean }
    },
    render(h) {
        return (<div class={`sidebar ${this.open ? 'sidebar-open' : ''}`}>
            <router-link to="/" class="sidebar-header">
                <img class="sidebar-headerIcon" src={getIcon(this.icon)} />
                { this.header }
            </router-link>
            <div class="sidebar-items">
                { categories.map((category) => <SidebarGrouping category={category} />) }
            </div>
        </div>)
    },
    
}
</script>
