<script>
import './dropdown.scss';
import { useVerticalExpansion } from '../../common/animations/VerticalExpansion';
import { useMouseListener } from '../../mixins/EventListeners';
import { createElement as h, reactive, watch } from '@vue/composition-api';

const NOOP = () => null;
/**
 * How to use:
 *   Render Dropdown.vue
 *   Pass in props: renderContents, renderButton
 */
export default {
    props: {
        /** Gets contents to place in the button */
        renderButton: {
            type: Function,
            required: true,
        },
        /** Gets contents to place in the contents */
        renderContents: {
            type: Function,
            required: true,
        },
        expandOnHover: {
            type: Boolean,
            default: false,
        },
        /** If true, collapse even if mousing over contents */
        ignoreMouseOverContent: {
            type: Boolean,
            default: false,
        },
        className: {
            type: String,
            default: '',
        },
        contentClass: {
            type: String,
            default: '',
        },
        rightAlign: {
            type: Boolean,
            default: false,
        },
        expanded: { },
    },
    setup(props, context) {
        const { 
            className, contentClass, expandOnHover, ignoreMouseOverContent,
            renderButton, renderContents, rightAlign 
        } = props;

        const state = reactive({
            expanded: false,
            duration: 150,
        });
        watch(() => {
            state.expanded = props.expanded !== undefined ? 
                    props.expanded : 
                    state.expanded;
        });

        const { enterAnimation, leaveAnimation } = useVerticalExpansion(state.duration);

        function onMouseenter(evt) {
            if (expandOnHover) {
                state.expanded = true;
            }
        };
        function onMouseleave(evt) {
            if (expandOnHover) {
                state.expanded = false;
            }
        };
        useMouseListener({
            onMousedown(evt) {
                if (!expandOnHover) {
                    if (context.refs.contents.contains(evt.target)) { // don't close if clicking on contents
                        return;
                    } else if (context.refs.el.contains(evt.target)) {
                        state.expanded = !state.expanded;
                    } else {
                        state.expanded = false;
                    }
                }
            },
        });

        function expand() {
            state.expanded = true;
        };

        function collapse() {
            state.expanded = false;
        };

        function isExpanded() {
            return state.expanded;
        };

        return () => 
            (<div class={`dropdown ${className}`}
                    onMouseenter={!ignoreMouseOverContent ? onMouseenter : NOOP}
                    onMouseleave={onMouseleave}
                    ref="el">
                <div onMouseenter={ignoreMouseOverContent ? onMouseenter : NOOP}>
                    { renderButton(h) }
                </div>
                <div class={`dropdown-contents ${contentClass} ${rightAlign ? 'rightAlign' : ''}`} ref="contents">
                    <transition mode="out-in"
                            onEnter={enterAnimation} 
                            onLeave={leaveAnimation}> {
                        state.expanded ? 
                            renderContents(h, collapse) :
                            null
                    } </transition>
                </div>
            </div>)
    },
}
</script>
