 <script>
import store, { actionKeys } from '../../vuex';
import VerticalExpandMixin from '../../common/animations/VerticalExpandMixin';
import './notificationDisplay.scss';

export default {
    store,
    mixins: [ VerticalExpandMixin ],
    props: {},
    methods: {
        renderMessages(h) {
            return this.$store.state.notificationMessages.map(msg => {
                const typeClass = msg.type === 'ERROR' ?
                        'notificationDisplay-error' :
                        'notificationDisplay-info';
                const removeMsgCb = () => this.$store.dispatch(actionKeys.REMOVE_NOTIFICATION_MESSAGE, msg.id);
                setTimeout(removeMsgCb, 5000);
                return <div class={`notificationDisplay-message ${typeClass}`} key={msg.id}
                        onClick={removeMsgCb}>
                    { msg.message }
                </div>
            });
        },
    },
    render(h) {
        return <transition-group tag="div" mode="out-in" class='notificationDisplay'
                onEnter={this.enterAnimation}
                onLeave={this.leaveAnimation}>
            { this.renderMessages(h) }
        </transition-group>
    },
}
</script>
