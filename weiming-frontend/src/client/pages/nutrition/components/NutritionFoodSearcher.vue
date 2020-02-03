<script>
import uuid from 'uuid/v4';
import get from 'lodash/get';
import './nutritionFoodSearcher.scss';
import { useVerticalExpansion } from '../../../common/animations/VerticalExpansion';
import { useMouseListener } from '../../../mixins/EventListeners';
import Select from '../../../components/select/Select.vue';
import { getImageComponent } from '../../../assets';
import { makeAppRequestToEndpoint } from '../../../helpers/requestUtils';
import endpoints from '../../../../common/endpoints';
import { actionKeys, useStore } from '../../../vuex';
import { createElement as h, onMounted, onUpdated, reactive, inject } from '@vue/composition-api';

function getInitialState(props) {
    const foodProp = props.foodProp || {};
    const { amount, unit, nutrition } = foodProp;

    return {
        // needed for the search to happen
        searchTerm: '',
        page: 0,
        disabled: false,

        searchResults: [],
        searchId: null, // used to show animation when changing a search

        // values received from the API, to be returned
        food: foodProp || null,
        foodNutrition: nutrition,

        // values given by the user, to be returned
        amount,
        unit,
    }
};

export default {
    props: { 
        onClose: { type: Function },
        onComplete: { type: Function },
        foodProp: { 
            // Object with fdcId, label, amount, nutrition, and unit
            // used to pre-populate the searcher so that we can edit
            type: Object 
        },     
    },
    setup(props, context) {
        const state = reactive(getInitialState(props));

        const store = useStore();
        const { enterAnimation, leaveAnimation } = useVerticalExpansion();
        useMouseListener({
            onMousedown(evt) {
                if (!context.refs.el.contains(evt.target)) {
                    context.emit('close');
                }
            },
        });
        const selectedFoods = inject('selectedFoods', []);

        function focusOnInput() {
            const input = (context.refs.searchTermInput || context.refs.amountInput);
            input ? input.focus() : null;
        };
        onMounted(focusOnInput);
        onUpdated(focusOnInput);

        function renderSearchOrPill() {
            return (state.food && state.food.fdcId) ?
                <div title={state.food.label} class="nutrition-foodSearcher-pill">
                    <span>{ state.food.label }</span>
                    { renderResetButton() }
                </div> :
                <input placeholder="Search for a food to add (e.g. broccoli)" 
                        ref='searchTermInput'
                        value={state.searchTerm}
                        onInput={(evt) => state.searchTerm = evt.target.value} />
        };
        function renderResetButton() {
            return !props.foodProp ?
                <span class="clickable nutrition-foodSearcher-clearSearch" 
                        onClick={() => resetSearch()}>
                    { getImageComponent(h, 'times') }
                </span> :
                null;
        };
        function renderOptions() {
            return <div class="nutrition-foodSearcher-optionsContainer">
                <div>How much did you eat?</div>
                <div class="nutrition-foodSearcher-optionsEntry">
                    <input type="number" class="nutrition-foodSearcher-amount"
                            step='0.001'
                            ref='amountInput'
                            placeholder="Enter a number"     
                            onInput={(evt) => state.amount = parseFloat(evt.target.value)}
                            value={state.amount} />
                    <Select className="nutrition-foodSearcher-unitSelector" 
                            onChange={setUnit}
                            selected={state.unit.id}
                            selection={getPossibleUnits()} />
                </div>
                <transition name="fade">
                    { state.amount && state.unit ?
                        <button type="submit" onClick={addFood}>
                            { props.foodProp ? 'Save' : 'Add' }
                        </button> :
                        null }
                </transition>
            </div>
        };
        function renderSearchResults() {
            return <transition mode='out-in'
                    onEnter={enterAnimation}
                    onLeave={leaveAnimation}> {
                    state.disabled ?
                    null :
                    <div key={state.searchId}
                            class="nutrition-foodSearcher-results">
                        { state.searchResults.map(food => {
                            return (<div key={food.fdcId} title={food.name}
                                    class="nutrition-foodSearcher-item clickable"
                                    onClick={() => setFood(food)}>
                                { getImageComponent(h, 'utensils') }
                                <span>{ food.name }</span>
                            </div>)
                        }) }
                    </div>
                } </transition>
        };

        function resetSearch() {
            state.food = null;
            state.foodNutrition = null;
            state.amount = null;
            state.unit = null;
        };

        function getPossibleUnits() {
            return state.foodNutrition.units.map(u => ({
                key: u.id,
                label: u.label,
            }));
        };        
        function doSearch(evt) {
            state.searchResults = [];
            state.disabled = true;
            makeAppRequestToEndpoint(endpoints.nutrition.app.searchFoods, { }, {
                term: state.searchTerm,
                page: 0,
            })
                .then(res => {
                    console.log(selectedFoods);
                    // don't show foods already selected
                    state.searchResults = res.payload.foods
                        .filter(food => !selectedFoods || !selectedFoods[food.fdcId]);
                    state.disabled = false;
                })
                .catch(handleError);
            state.searchId = uuid();
            evt.preventDefault();
        };
        function setFood(food) {
            state.food = { fdcId: food.fdcId, label: food.name, };

            state.disabled = true;
            makeAppRequestToEndpoint(endpoints.nutrition.app.getNutritionFacts, { },
                { fdcIds: [ food.fdcId ] },
                { catchErrors: false })
                .then(res => {
                    const foodNutrition = res.payload.data[0];
                    state.foodNutrition = foodNutrition;
                    state.unit = foodNutrition.units[0];
                    state.disabled = false;
                })
                .catch(handleError);
        };
        function setUnit(unitKey) {
            state.unit = state.foodNutrition.units.find(u => u.id === unitKey);
        };
        function handleError(error) {
            store.dispatch(actionKeys.ADD_ERROR_MESSAGE, error);
            resetSearch();
            state.disabled = false;
        };
        
        function addFood(evt) {
            context.emit('complete', {
                label: state.food.label,
                fdcId: state.food.fdcId,
                amount: state.amount,
                unit: state.unit,
                nutrition: state.foodNutrition,
            });
            evt.preventDefault();
        };

        return () => {
            // either show a pill for the selected food, or show a search box
            return <form ref='el'
                    class={`nutrition-foodSearcher ${state.disabled ? 'disabled' : ''}`}>
                <div class="nutrition-foodSearcher-searchbar">
                    { renderSearchOrPill() }
                    { !get(state, 'food.fdcId') ? 
                            <button type="submit" onClick={doSearch}> Search </button> :
                            null }
                </div>
                <transition mode="out-in"
                        onEnter={enterAnimation}
                        onLeave={leaveAnimation}>
                    { state.food != null && state.foodNutrition ?
                        renderOptions() :
                        renderSearchResults() }
                </transition>
            </form>;
        };
    },
}
</script>
