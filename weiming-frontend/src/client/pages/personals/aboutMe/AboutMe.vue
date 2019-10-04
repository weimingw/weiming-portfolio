<script>
import PageMixin from '../../../mixins/PageMixin';
import AboutMeItem from './AboutMeItem.vue';
import endpoints from '../../../../common/endpoints';

import './aboutMe.scss';
import items from './aboutMeContents.json';

export default {
    mixins: [PageMixin],
    methods: {
        getHeaderProps() {
            return {
                title: endpoints.personals.pages.about.label,
            }
        },
    },
    render(h) {
        return (<div class="aboutMe layout-mediumWidth layout-oneColumn">
            {items.map(item => <AboutMeItem item={item} key={item.key} />)}
        </div>)
    },
}
</script>
