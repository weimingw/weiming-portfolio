<script>
import { createElement as h } from '@vue/composition-api';

import { WriteupHeader4 } from './index';
import Collapser from '../collapser/Collapser.vue'
import { getImageComponent } from '../../assets';

export default {
    props: {
        label: { default: '' },
        icon: { type: String, default: '' },
        contents: { required: true },
    },
    setup(props, context) {
        const { icon, label, contents } = props;

        function renderHeader() {
            return <WriteupHeader4 className='flexCenterAlignedRow'>
                { icon ? getImageComponent(h, icon, { className: 'writeup-sectionIcon' }) : null }
                <span>{ label }</span>
            </WriteupHeader4>
        };

        return () => 
            (<Collapser class={`writeup-section ${icon ? 'withIcon' : ''}`}       
                collapserToggler={renderHeader}
                collapserContents={contents}
            />);
    },
}
</script>