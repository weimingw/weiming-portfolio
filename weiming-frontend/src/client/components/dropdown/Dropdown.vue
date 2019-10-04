<script>
import './dropdown.scss';
import VerticalExpandMixin from '../../common/animations/VerticalExpandMixin';
import ClickListenerMixin from '../../mixins/ClickListenerMixin';

/**
 * How to use:
 *   Render Dropdown.vue
 *   Pass in props: renderContents, renderButton
 */
export default {
    mixins: [ ClickListenerMixin, VerticalExpandMixin ],
    props: {
        /** Gets contents to place in the button */
        renderButton: {
            type: Function,
            required: true,
        },
        /** Gets contents to place in the menu */
        renderContents: {
            type: Function,
            required: true,
        },
        expandOnHover: {
            type: Boolean,
            default: false,
        },
        className: {
            type: String,
            default: '',
        },
        rightAlign: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            expanded: false,
            duration: 150,
        }
    },
    methods: {
        receiveClick(evt) {
            if (!this.expandOnHover) {
                if (this.$refs.menu.contains(evt.target)) {
                    return;
                } else if (this.$el.contains(evt.target)) {
                    this.expanded = !this.expanded;
                } else {
                    this.expanded = false;
                }
            }
        },
        onMouseenter(evt) {
            if (this.expandOnHover) {
                this.expanded = true;
            }
        },
        onMouseleave(evt) {
            if (this.expandOnHover) {
                this.expanded = false;
            }
        },
        openMenu: function() {
            this.expanded = true;
        },
        closeMenu: function() {
            this.expanded = false;
        },
        isExpanded: function() {
            return this.expanded;
        },
    },
    render(h) {
        return (<div class={`dropdown ${this.className}`}
            onMouseenter={this.onMouseenter}
            onMouseleave={this.onMouseleave}>
            { this.renderButton(h) }
            <div class={`dropdown-menu ${this.rightAlign ? 'rightAlign' : ''}`} ref="menu">
                <transition mode="out-in"
                        onEnter={this.enterAnimation} 
                        onLeave={this.leaveAnimation}> {
                    this.expanded ? 
                        this.renderContents(h, this.closeMenu) :
                        null
                } </transition>
            </div>
        </div>)
    }
}
</script>
