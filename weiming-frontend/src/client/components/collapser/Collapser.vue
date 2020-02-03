<script>
import './collapser.scss';
import { getImageComponent } from '../../assets';
import { useVerticalExpansion } from '../../common/animations/VerticalExpansion';

import { createElement as h, reactive } from '@vue/composition-api';

export default {
    props: {
        className: {
            type: String,
            default: '',
        },
        collapsedAtStart: {
            type: Boolean,
            default: false
        },
        collapserToggler: { }, 
        collapserContents: { }, 
    },
    setup(props, context) {
        const { 
            className, collapsedAtStart, collapserToggler, collapserContents 
        } = props;

        const state = reactive({
            collapsed: collapsedAtStart
        });

        const { enterAnimation, leaveAnimation } = useVerticalExpansion();
        
        function renderCollapserToggler() {
            return collapserToggler instanceof Function ? 
                collapserToggler() :
                collapserToggler;
        };

        function renderCollapserContents() {
            return collapserContents instanceof Function ?
                collapserContents(h) :
                collapserContents;
        };

        function getIcon() {
            return state.collapsed ? 
                    getImageComponent(h, 'angle-down', { className: 'collapser-icon' }) : 
                    getImageComponent(h, 'angle-up', { className: 'collapser-icon' })
        };

        function toggle() {
            state.collapsed = !state.collapsed;
        };

        return () => 
            (<div class={`collapser ${className || ''}`}>
                <div class="collapser-toggle clickable" onClick={toggle}>
                    { renderCollapserToggler() }
                    { getIcon() }
                </div>
                <div class="collapser-content">
                    <transition
                            onEnter={enterAnimation}
                            onLeave={leaveAnimation}>
                        { !state.collapsed ? renderCollapserContents(h) : null }
                    </transition>
                </div>
            </div>)
    }
}
</script>
