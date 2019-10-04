<script>
import './collapser.scss';
import { getImageComponent } from '../../assets';
import VerticalExpandMixin from '../../common/animations/VerticalExpandMixin';

export default {
    mixins: [ VerticalExpandMixin ],
    props: {
        collapsedAtStart: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            collapsed: this.collapsedAtStart
        }
    },
    methods: {
        getIcon(h) {
            return this.collapsed ? 
                    getImageComponent(h, 'angle-down', { className: 'collapser-icon' }) : 
                    getImageComponent(h, 'angle-up', { className: 'collapser-icon' })
        },
        toggle() {
            this.collapsed = !this.collapsed;
        }
    },
    render(h) {
        return (<div class={`collapser ${this.className || ''}`}>
            <div class="collapser-toggle clickable" onClick={this.toggle}>
                { this.$slots.collapserToggler }
                { this.getIcon(h) }
            </div>
            <div class="collapser-content">
                <transition
                        onEnter={this.enterAnimation}
                        onLeave={this.leaveAnimation}>
                    { !this.collapsed ? this.$slots.collapserContent : null }
                </transition>
            </div>
        </div>)
    }
}
</script>
