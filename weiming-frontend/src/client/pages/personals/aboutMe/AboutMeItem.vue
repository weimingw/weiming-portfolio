<script>
import { createElement as h } from '@vue/composition-api';

import { getImageComponent } from '../../../assets';
import Collapser from '../../../components/collapser/Collapser.vue';

export default {
    props: {
        item: { type: Object }
    },
    setup(props, context) {
        const { item } = props;
        function getLines() {
            return item.content.map(line => (
                <div class="aboutMe-line">
                    { line.icon ? getImageComponent(h, line.icon, { className: 'aboutMe-lineIcon' }) : null }
                    {line.text}
                </div>
            ))
        };

        function renderToggler() {
            return <h4 class="aboutMe-header">
                { getImageComponent(h, item.icon, { className: 'aboutMe-mainIcon' }) }
                {item.title}
            </h4>
        };

        function renderContents() {
            return <div>
                { getLines() }
            </div>
        };

        return () => 
            (<Collapser class="aboutMe-entry"
                collapserToggler={renderToggler}
                collapserContents={renderContents}
            />)
    },
}
</script>
