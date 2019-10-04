<script>
import delay from 'lodash/delay';
import './styling/success.scss';

import router from '../router';
import endpoints from '../../common/endpoints';

const REDIRECT_DELAY = 3000;

class SuccessPageManager {
    constructor() {
        this.header = '';
        this.messages = [ 
            "You must have gotten here by accident.", 
            "Use the sidebar to go back to a correct page." 
        ];
        this.redirect = undefined;
    }

    popPageParams() {
        const params = {
            header: this.header,
            messages: this.messages,
            redirect: this.redirect,
        }
        this.header = '';
        this.messages = [];
        this.redirect = undefined;
        return params;
    }

    /**
     * @param {*} header header text
     * @param {*} messages messages to show on the page body
     * @param {*} redirect link to redirect to after a time interval
     */
    navigateToPage(header='Request Sucessful', messages=[], redirect=undefined) {
        this.header = header;
        this.messages = messages;
        this.redirect = redirect;
        router.push({ path: endpoints.success.url });
    }
}

export const successPageManager = new SuccessPageManager();

export default {
    mixins: [ ],
    data: function() {
        const { header, messages, redirect } = successPageManager.popPageParams();
        return {
            header, 
            messages,
            redirect,
        }
    },
    methods: {
        renderMessages(h) {
            return this.messages.map(msg => 
                <p class="success-msg">{msg}</p>
            )
        },
    },
    mounted() {
        if (this.redirect) {
            delay(() => {
                const currentUrl = new URL(window.location);
                if (currentUrl.pathname === endpoints.success.url) {
                    this.$router.push(this.redirect);
                }
            }, REDIRECT_DELAY);
        }
    },
    render(h) {
        return (<div class='main-page success-container layout-oneColumn layout-mediumWidth'>
            <h4 class="pageHeader">{this.header}</h4>
            { this.renderMessages(h) }
            { this.redirect ? 
                <p>Redirecting you in {REDIRECT_DELAY / 1000} seconds...</p> :
                null }
        </div>)
    },
}
</script>