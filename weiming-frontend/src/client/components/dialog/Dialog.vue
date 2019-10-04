<script>
import './dialog.scss';
import { getImageComponent } from '../../assets';

const NOOP = () => undefined;

class DialogHandler {
    constructor() {
        this.dialog = null;
    }

    /**
     * Displays a dialog; will likely overwrite the most recent dialog 
     * if you call this without closing the last one 
     * @param opts options to pass into the dialog; only renderBodyElements is required
     */
    displayDialog(opts) {
        if (!opts.renderBodyElements) {
            console.warn('renderBodyElements is undefined. It is required for Dialog.')
        }

        if (this.dialog) {
            this.dialog.displayWithOpts(opts);
        }
    }
}

export const dialogHandler = new DialogHandler();


function getWindowWidthAndHeight() {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

export default {
    props: {
        
    },
    data() {
        return {
            isOpen: false,
            dialogStyle: {}, // used for translating the dialog to middle of screen in performant way 

            /**
             * Render 'prop' functions
             * Accepts a callback to close the dialog,
             * returns elements to display in the dialog
             */
            renderBodyElements: NOOP,
            renderHeader: undefined,
            renderFooter: undefined,
        }
    },
    methods: {
        displayWithOpts(opts) {
            const {
                renderBodyElements,
                useDefaultHeader = true,
                useDefaultFooter = true,
                renderHeader = NOOP,
                renderFooter = NOOP,
            } = opts;

            this.isOpen = true;
            this.renderBodyElements = renderBodyElements;
            this.renderHeader = useDefaultHeader ? this.renderDefaultHeader : renderHeader;
            this.renderFooter = useDefaultFooter ? this.renderDefaultFooter : renderFooter;
        },
        closeDialog() {
            this.isOpen = false;
            this.renderBodyElements = NOOP;

        },

        renderDialog(h) {
            return <div class='dialog' style={this.dialogStyle}>
                <div class='dialog-header'>{ this.renderHeader(h, this.closeDialog) }</div>
                { this.renderBodyElements(h, this.closeDialog) }
                <div class='dialog-footer'>{ this.renderFooter(h, this.closeDialog) }</div>
            </div>
        },
        renderDefaultHeader(h, closeDialog) {
            return [
                <h4 key='text' class='dialog-header-text'>Warning</h4>,
                <div key='close' class='dialog-header-close clickable' onClick={closeDialog}>
                    { getImageComponent(h, 'times') }
                </div>
            ]
        },
        getDefaultFooter(h, closeDialog) {
            return [
                <button key='close' class='dialog-footer-close'>Close</button>
            ]
        },

        enterAnimation(el, done) {
            const { innerWidth, innerHeight } = window;
            const { width, height } = el.getBoundingClientRect();
            const finalHeight = (innerHeight - height) / 2;
            const finalWidth = (innerWidth - width) / 2;

            el.animate([
                { transform: `translate(${finalWidth}px, ${-2 * height}px)` },
                { transform: `translate(${finalWidth}px, ${finalHeight}px)` },
            ], {
                duration: 250,
                easing: 'ease-out',
            }).onfinish = () => {
                this.dialogStyle = {
                    transform: `translate(${finalWidth}px, ${finalHeight}px)`
                };
                done();
            };
        },
        leaveAnimation(el, done) {
            const { innerWidth, innerHeight } = window;
            const { width, height } = el.getBoundingClientRect();
            const finalHeight = (innerHeight - height) / 2;
            const finalWidth = (innerWidth - width) / 2;

            el.animate([
                { transform: `translate(${finalWidth}px, ${finalHeight}px)` },
                { transform: `translate(${finalWidth}px, ${finalHeight + 2 * height}px)` },
            ], {
                duration: 250,
                easing: 'ease-in',
            }).onfinish = () => {
                done();
            };
        },
    },
    render(h) {
        return <div class={`dialog-overlay ${this.isOpen ? 'dialog-open' : ''}`}>
            <transition onEnter={this.enterAnimation} onLeave={this.leaveAnimation}>
                { this.isOpen ? this.renderDialog(h) : null }
            </transition>
        </div>
    },
    created() {
        dialogHandler.dialog = this;
    },
}
</script>