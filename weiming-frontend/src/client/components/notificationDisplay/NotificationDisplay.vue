<script>
import { createElement as h } from '@vue/composition-api';
import store, { actionKeys } from '../../vuex';
import { useVerticalExpansion } from '../../common/animations/VerticalExpansion';
import './notificationDisplay.scss';

export default {
    setup(props, context) {
        const { enterAnimation, leaveAnimation } = useVerticalExpansion();
        function renderMessages() {
            return store.state.notificationMessages.map(msg => {
                const typeClass = msg.type === 'ERROR' ?
                        'notificationDisplay-error' :
                        'notificationDisplay-info';
                const removeMsgCb = () => 
                    store.dispatch(actionKeys.REMOVE_NOTIFICATION_MESSAGE, msg.id);
                setTimeout(removeMsgCb, 5000);
                return <div class={`notificationDisplay-message ${typeClass}`} key={msg.id}
                        onClick={removeMsgCb}>
                    { msg.message }
                </div>
            });
        };

        return () => {
            return <transition-group tag="div" mode="out-in" class='notificationDisplay'
                    onEnter={enterAnimation}
                    onLeave={leaveAnimation}>
                { renderMessages() }
            </transition-group>
        };
    },
}
</script>
