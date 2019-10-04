<script>
/**
 * If you want to see the live version of this code,
 * look on weimingw.herokuapp.com
 */

import PageMixin from '../../mixins/PageMixin';
import AboutMeItem from './AboutMeItem.vue';

import './aboutMe.scss';
import items from './aboutMeContents.json';

export default {
    mixins: [PageMixin],
    methods: {
        getHeaderProps() {
            return {
                title: 'About Me',
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
