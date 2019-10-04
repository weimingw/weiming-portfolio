<script>
import uuid from 'uuid/v4';
import './nutritionFoodSearcher.scss';
import VerticalExpandMixin from '../../../common/animations/VerticalExpandMixin';
import ClickListenerMixin from '../../../mixins/ClickListenerMixin';
import Select from '../../../components/select/Select.vue';
import { getImageComponent } from '../../../assets';
import { makeAppRequestToEndpoint } from '../../../helpers/requestUtils';
import endpoints from '../../../../common/endpoints';
import store, { actionKeys } from '../../../vuex';

const GRAMS = 'g';

export default {
    store,
    mixins: [ VerticalExpandMixin, ClickListenerMixin ],
    props: {
        foods: {
            type: Array,
            default: [],
        },
    },
    data: function() {
        return {
            // needed for the search to happen
            searchTerm: '',
            page: 0,
            disabled: false,

            searchResults: [{
                fdcId: 10860,
                name: 'Bacon',
            }, {
                fdcId: 11090,
                name: 'Broccoli but I will pad this name so that it overflows',
            }, {
                fdcId: -123,
                name: 'Bad food',
            }],
            searchId: null, // used to show animation when changing a search

            // values received from the API, to be returned
            selectedFood: null,
            selectedFoodNutrition: null,

            // values given by the user, to be returned
            amount: null,
            unit: GRAMS,
        }
    },
    computed: {
        existingFoods() {
            return this.foods.map(food => food.fdcId);
        },
    },
    methods: {
        renderSearchOrPill(h) {
            return this.selectedFood ?
                <div title={this.selectedFood.name} class="nutrition-foodSearcher-pill">
                    <span>{ this.selectedFood.name }</span>
                    <span class="clickable nutrition-foodSearcher-clearSearch" onClick={this.resetSearch}>
                        { getImageComponent(h, 'times') }
                    </span>
                </div> :
                <input placeholder="Search for a food to add (e.g. broccoli)" 
                        value={this.searchTerm}
                        onInput={(evt) => this.searchTerm = evt.target.value} />
        },
        renderOptions(h) {
            return <div class="nutrition-foodSearcher-optionsContainer">
                <div>How much did you eat?</div>
                <div class="nutrition-foodSearcher-optionsEntry">
                    <input type="number" class="nutrition-foodSearcher-amount"
                            placeholder="Enter a number"     
                            onInput={(evt) => this.amount = parseInt(evt.target.value)}
                            value={this.amount} />
                    <Select className="nutrition-foodSearcher-unitSelector" 
                            onChange={(selected) => this.unit = selected}
                            selected={this.unit}
                            selection={this.getPossibleUnits()} />
                </div>
                <transition name="fade">
                    { this.amount && this.unit ?
                        <button type="submit" onClick={this.addFood}>Add</button> :
                        null }
                </transition>
            </div>
        },
        getPossibleUnits() {
            return [ 
                GRAMS, 
                ...Object.keys(this.selectedFoodNutrition.conversionRates)
            ];
        },
        renderSearchResults(h) {
            return <transition mode='out-in'
                    onEnter={this.enterAnimation}
                    onLeave={this.leaveAnimation}>
                <div key={this.searchId}
                        class="nutrition-foodSearcher-results">
                    { this.searchResults.map(food => {
                        return (<div key={food.fdcId} title={food.name}
                                class="nutrition-foodSearcher-item clickable"
                                onClick={() => this.setFood(food)}>
                            { getImageComponent(h, 'utensils') }
                            <span>{ food.name }</span>
                        </div>)
                    }) }
                </div>
            </transition>
        },
        doSearch(evt) {
            this.searchResults = [];
            this.disabled = true;
            makeAppRequestToEndpoint(endpoints.nutrition.app.searchFoods, { }, {
                term: this.searchTerm,
                page: 0,
            })
                .then(res => {
                    this.searchResults = res.payload.foods;
                    this.disabled = false;
                })
                .catch(this.handleError);
            this.searchId = uuid();
            evt.preventDefault();
        },
        receiveClick(evt) {
            console.log(evt);
            if (!this.$el.contains(evt.target)) {
                this.$emit('close');
            }
        },
        setFood(food) {
            this.selectedFood = food;
            this.disabled = true;
            makeAppRequestToEndpoint(endpoints.nutrition.app.getNutritionFacts, { },
                { fdcId: food.fdcId },
                { catchErrors: false })
                .then(res => {
                    this.selectedFoodNutrition = res.payload[0];
                    this.disabled = false;
                })
                .catch(this.handleError);
        },
        handleError(error) {
            this.$store.dispatch(actionKeys.ADD_ERROR_MESSAGE, error);
            this.resetSearch();
            this.disabled = false;
        },
        resetSearch() {
            this.selectedFood = null;
            this.selectedFoodNutrition = null;
            this.amount = null;
            this.unit = GRAMS;
        },
        addFood(evt) {
            this.$emit('complete', {
                label: this.selectedFood.name,
                fdcId: this.selectedFood.fdcId,
                amount: this.amount,
                unit: this.unit,
                nutrition: this.selectedFoodNutrition,
            });
            evt.preventDefault();
        },
    },
    render(h) {
        // either show a pill for the selected food, or show a search box
        return <form class={`nutrition-foodSearcher ${this.disabled ? 'disabled' : ''}`}>
            <div class="nutrition-foodSearcher-searchbar">
                { this.renderSearchOrPill(h) }
                { !this.selectedFood ? 
                        <button type="submit" onClick={this.doSearch}> Search </button> :
                        null }
            </div>
            <transition mode="out-in"
                    onEnter={this.enterAnimation}
                    onLeave={this.leaveAnimation}>
                { this.selectedFood != null && this.selectedFoodNutrition ?
                    this.renderOptions(h) :
                    this.renderSearchResults(h) }
            </transition>
        </form>;
    }
}
</script>
