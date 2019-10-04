<script>
import Loading from '../../../base/Loading.vue'; 
import store, { actionKeys } from '../../../vuex';
import SessionRequiredMixin from '../../../mixins/SessionRequiredMixin';
import { dialogHandler } from '../../../components/dialog/Dialog.vue';
import VerticalExpandMixin from '../../../common/animations/VerticalExpandMixin';

import './nutritionTracker.scss';
import nutritionEndpoints from '../../../../common/endpoints/nutritionEndpoints'; 
import { getImageComponent } from '../../../assets';
import { makeAppRequestToEndpoint } from '../../../helpers/requestUtils';

export default {
    mixins: [ SessionRequiredMixin, VerticalExpandMixin ],
    data() {
        return {
            daysList: undefined,
            duration: 200,
            openDialog: false,
            isDeleting: false,
        };
    },
    methods: {
        renderContents(h) {
            return this.daysList === undefined ?
                    <Loading /> :
                    this.renderDaysList(h);
        },
        renderDaysList(h) {
            return <transition-group tag='ul' class='nutritionTracker-daysList'
                    onEnter={this.enterAnimation}
                    onLeave={this.leaveAnimation}>
                <button class='nutritionTracker-addDay mt10 mb10' key='addDayBtn'
                        onClick={() => this.$router.push({ path: nutritionEndpoints.pages.visualizer.fullUrl })}>
                    { getImageComponent(h, 'plus', { className: 'plusIcon mr5' }) }
                    Add a new day
                </button>
                <h4 key='header'>Most Recent Entries</h4>
                { this.daysList.map(day => this.renderDaysListItem(h, day)) }
            </transition-group>
        },
        renderDaysListItem(h, day) {
            return <li class='nutritionTracker-item' key={`${day.date}`}>
                <router-link class='nutritionTracker-dayLink clickable' to={{ 
                        path: nutritionEndpoints.pages.visualizer.fullUrl, 
                        query: { date: day.date } 
                    }}>
                    <p class='nutritionTracker-dayLink-date'>{ day.date }</p>
                    <p class='nutritionTracker-dayLink-description'>
                        { day.entries.map(day => day.label).join(' | ') || 'Nothing' }
                    </p>
                </router-link>
                <div class='nutritionTracker-removeDay' onClick={() => this.showDeleteConfirmation(day)}>
                    { getImageComponent(h, 'times', { className: 'deleteIcon clickable' }) }
                </div>
            </li>
        },
        renderDeletionDialog(h, closeDialog, day) {
            return <form class={`${this.isDeleting ? 'disabled' : ''} nutritionTracker-deletionDialog`}
                    onSubmit={(evt) => this.deleteDay(evt, day, closeDialog)}>
                <p>Are you sure you want to delete the entry for this day?</p>
                <p class='green'>{ day.date }</p>
                <div>
                    <button class='nutritionTracker-deletionDialog-confirm' type='submit'>
                        { getImageComponent(h, 'check', { className: 'green mr4' }) }
                        Yes
                    </button>
                    <button class='nutritionTracker-deletionDialog-cancel' type='button' onClick={closeDialog}>
                        { getImageComponent(h, 'times', { className: 'red mr4' }) }
                        Never Mind
                    </button>
                      
                </div>
            </form>
        },

        /* Gets days from server */
        getDays() {
            makeAppRequestToEndpoint(nutritionEndpoints.api.getDays, { }, { detailed: true })
                    .then(response => this.daysList = response.payload)
                    .catch(err => null);
        },
        showDeleteConfirmation(day) {
            // delete with a dialog...
            dialogHandler.displayDialog({
                renderBodyElements: (h, closeDialog) => this.renderDeletionDialog(h, closeDialog, day),
                useDefaultFooter: false,
            });
        },
        deleteDay(evt, deleteDay, closeDialog) {
            this.isDeleting = true;
            makeAppRequestToEndpoint(nutritionEndpoints.api.deleteDay, { }, { id: deleteDay.id })
                    .then(() => {
                        this.daysList = this.daysList.filter(day => day.id != deleteDay.id);
                        closeDialog();
                        this.isDeleting = false;
                    });
            evt.preventDefault();
        },
    },
    mounted() {
        if (this.hasSession) {
            this.getDays();
        }
    },
    render(h) {
        return (<div class='nutritionTracker layout-mediumWidth layout-oneColumn'>
            <h4>Nutritional Intake Overview</h4>
            <div>
                Graph for everything goes here
            </div>
            <div class='nutritionTracker-contents'>
                <transition mode='out-in' name='fade'>
                    { this.renderContents(h) }
                </transition>
            </div>
        </div>)
    }
}
</script>
