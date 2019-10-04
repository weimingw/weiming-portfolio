<script>
import { getImageComponent } from '../../assets';

// note to self, if I ever need to add collapsing of sections,
// using external state storage like sessionStorage or vuex is necessary
// sidebar instance is destroyed whenever sidebar is collapsed
export default {
    props: {
        category: { type: Object, required: true },
    },
    methods: {
        getItemIcon(h, item) {
            return getImageComponent(h, item.icon, { className: 'sidebar-itemIcon' });
        },
        getLink(h, page) {
            return (<router-link class="sidebar-item" to={page.fullUrl} key={page.key}>
                { this.getItemIcon(h, page) }
                { page.label }
            </router-link>)
        },
    },
    render(h) {
        return (<div class="sidebar-category">
            <div class="sidebar-categoryHeader">
                { this.getItemIcon(h, this.category) }
                { this.category.label }
            </div>
            { this.category.pages
                    .filter(page => !page.hidden)
                    .map(page => this.getLink(h, page)) }
        </div>)
    }
}
</script>
