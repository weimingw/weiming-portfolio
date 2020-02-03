<script>
import { createElement as h } from '@vue/composition-api';
import { usePageConfiguration } from '../../../mixins/PageMixin';
import AboutMeItem from './AboutMeItem.vue';
import endpoints from '../../../../common/endpoints';

import './aboutMe.scss';
import items from './aboutMeContents.json';

export default {
    setup(props, ctxt) {
        usePageConfiguration({
            headerProps: {
                title: endpoints.personals.pages.about.label,
            },
        })

        return () => 
            (<div class="aboutMe layout-mediumWidth layout-oneColumn">
                {items.map(item => <AboutMeItem item={item} key={item.key} />)}
            </div>)
    },
}
</script>
