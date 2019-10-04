<script>
import debounce from 'lodash/debounce';
import PageMixin from '../../../mixins/PageMixin';
import Loading from '../../../base/Loading.vue';
import endpoints from '../../../../common/endpoints';
import { makeAppRequestToEndpoint } from '../../../helpers/requestUtils';
import SessionRequiredMixin from '../../../mixins/SessionRequiredMixin';

import './nutritionVisualizer.scss';
import NutritionVisualizerFoods from './NutritionVisualizerFoods.vue';
import NutritionVisualizerNutrients from './NutritionVisualizerNutrients.vue';
import DatePicker from '../../../components/datePicker/DatePicker.vue';

export default {
    mixins: [ PageMixin, SessionRequiredMixin ],
    data: function() {
        const params = new URLSearchParams(window.location.search)
        const date = params.has('date') ?
            new Date(params.get('date')) :
            undefined;
        return {
            id: undefined,
            date,
            foods: undefined, // a list of foods and serving sizes
            nutritionalInfo: undefined,
            errored: false,
        };
    },
    methods: {
        getHeaderProps() {
            return { 
                title: endpoints.nutrition.pages.visualizer.label
            };
        },
        addFood(foodMetadata) {
            this.foods.push(foodMetadata);
            this.sync();
        },
        removeFood(foodMetadata) {
            this.foods = this.foods.filter(food => food != foodMetadata);
            this.sync();
        },
        setDate(date) {
            this.date = date;
            this.sync();
        },
        doSync() {
            this.errored = false;
            const endpoint = this.id === undefined ?
                endpoints.nutrition.api.createDay :
                endpoints.nutrition.api.updateDay;
            makeAppRequestToEndpoint(endpoint, { }, { 
                    date: this.date.toISOString(),
                    id: this.id,
                    entries: this.foods,
                }).then(response => {
                    // if creating new day, update id and food list
                    this.id = response.payload.id;
                    if (!this.foods) {
                        this.foods = response.payload.entries;
                    }

                    // if changing the date, refreshing the page makes the page invalid,
                    // so we need to update the URL
                    const newLocation = `${this.$router.currentRoute.path}?date=${this.date.toISOString().substring(0, 10)}`;
                    this.$router.replace(newLocation); 
                }).catch(err => this.errored = true);
        },

        getContents(h) {
            if (!this.date || this.errored) {
                return null;
            } else if (this.foods === undefined) {
                return <Loading />;
            } else {
                return this.getLists(h)
            }
        },
        getLists(h) {
            return <div class="nutritionVisualizer-info layout-twoColumnFixedWidth">
                <NutritionVisualizerFoods
                        foods={this.foods}
                        addFood={this.addFood}
                        removeFood={this.removeFood} />
                <NutritionVisualizerNutrients 
                        nutrition={this.nutrition} />
            </div>
        },
    },
    created() {
        this.sync = debounce(this.doSync, 1000);
    },
    mounted() {
        if (this.date === undefined || // new entry, wait until date exists
                !this.hasSession) { // no session, will redirect, don't bother making requests
            return;
        }

        makeAppRequestToEndpoint(endpoints.nutrition.api.getDays, { }, { detailed: true, date: this.date.toISOString() })
                    .then(response => {
                        const payload = response.payload;
                        this.date = new Date(payload.date);
                        this.foods = payload.entries;
                        this.id = payload.id;
                    })
                    .catch(() => this.errored = true);
    },
    render(h) {
        return (<div class="nutritionVisualizer layout-fullWidth layout-oneColumn">
            <h4>Single-Day Nutritional Breakdown</h4>
            <div class="nutritionVisualizer-graphs">Graphs go here</div>
            <div class="nutritionVisualizer-date layout-smallWidth">
                <span class='mr5'>What day is this for?</span>
                <DatePicker placeholder='Pick a date' onChange={this.setDate} value={this.date} />
            </div>
            <transition name='fade' mode='out-in'>
                { this.getContents(h) }
            </transition>
        </div>)
    }
}
</script>
