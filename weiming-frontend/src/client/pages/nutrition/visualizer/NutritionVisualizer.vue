<script>
import debounce from 'lodash/debounce';
import { usePageConfiguration } from '../../../mixins/PageMixin';
import Loading from '../../../base/Loading.vue';
import endpoints from '../../../../common/endpoints';
import { makeAppRequestToEndpoint } from '../../../helpers/requestUtils';
import { makeReactive } from '../../../helpers/provideInjectUtils';
import { useSessionRequired } from '../../../mixins/SessionRequiredMixin';
import { useRouter } from '../../../router';

import { nutrientIds, getNutrientAmountFromCustomEntryItem, PERCENTAGE } from '../nutritionUiCommon';
import './nutritionVisualizer.scss';
import NutritionVisualizerIntake from './NutritionVisualizerIntake.vue';
import NutritionVisualizerNutrients from './NutritionVisualizerNutrients.vue';
import Tooltip from '../../../components/tooltip/Tooltip.vue';
import DatePicker from '../../../components/datePicker/DatePicker.vue';
import { createElement as h, reactive, computed, provide, watch } from '@vue/composition-api';

function getInitialState(props, ctxt) {
    const params = new URLSearchParams(window.location.search)
    const date = params.has('date') ?
        new Date(params.get('date')) :
        undefined;
    return {
        id: undefined,
        date,
        foods: [], // a list of foods and serving sizes
        supplements: undefined,
        errored: false,
        customEntries: [],
        loaded: false,
    };
};

export default {
    setup(props, ctxt) {
        const state = reactive({
            ... getInitialState(props, ctxt),
            nutrition: { },
            selectedFoods: { },
        });

        watch(
            () => [ state.customEntries, state.foods ],
            () => {
                state.loaded ? sync() : null
                updateSelectedFoods();
                updateNutrition();
            },
            { deep: true },
        );
        
        function updateSelectedFoods() {
            state.selectedFoods = (state.foods || []).reduce((foodsMap, food) => {
                    foodsMap[food.fdcId] = true;
                    return foodsMap;
                }, {});
        }
        function updateNutrition() {
            const nutrition = getNutritionFromFood();
            state.customEntries.forEach(entry => {
                entry.nutrients.forEach(nutrient => {
                    const convertedAmount = getNutrientAmountFromCustomEntryItem(nutrient);
                    nutrition[nutrient.key].push({ from: entry.label, amount: convertedAmount });
                });
            });
            state.nutrition = nutrition;
        }

        usePageConfiguration({
            headerProps: { title: endpoints.nutrition.pages.visualizer.label }
        });
        const hasSession = useSessionRequired();
        const router = useRouter();
        provide('selectedFoods', state.selectedFoods);
        
        function addFood(foodMetadata) {
            state.foods.push(foodMetadata);
        };
        function removeFood(foodMetadata) {
            state.foods = state.foods.filter(food => food != foodMetadata);
            
        };
        function editFood(foodMetadata) {
            state.foods = state.foods.map((food) => 
                foodMetadata.fdcId === food.fdcId ? foodMetadata : food
            );
        };
        function addCustomEntry(entry) {
            state.customEntries.push(entry);
        };
        function removeCustomEntry(entry) {
            state.customEntries = state.customEntries.filter(e => e.id !== entry.id);
        };
        function setDate(date) {
            state.date = date;
            sync();
        };
        const sync = debounce(() => {
            state.errored = false;
            const endpoint = state.id === undefined ?
                endpoints.nutrition.api.createDay :
                endpoints.nutrition.api.updateDay;
            makeAppRequestToEndpoint(endpoint, { }, { 
                    date: state.date.toISOString(),
                    id: state.id,
                    entries: (state.foods || []).map(food => {
                        // take out 'nutrition' field, because it's a gigantic payload
                        const { nutrition, ...other } = food;
                        return { ...other };
                    }),
                    customEntries: state.customEntries,
                }).then(response => {
                    // if creating new day, update id and food list
                    state.id = response.payload.id;
                    if (!state.foods.length) {
                        state.foods = response.payload.entries;
                        state.loaded = true;
                    }

                    // if changing the date, refreshing the page makes the page invalid,
                    // so we need to update the URL
                    const newLocation = `${router.currentRoute.path}?date=${state.date.toISOString().substring(0, 10)}`;
                    router.replace(newLocation).catch(() => null); 
                }).catch(err => state.errored = true);
        }, 1000);
        function getNutritionFromFood() {
            const nutrition = nutrientIds.reduce((acc, nutrientId) => {
                acc[nutrientId] = [];
                return acc;
            }, {});

            state.foods
                .filter(food => food.nutrition)
                .forEach(food => { // for each food with nutrition info
                    const foodData = food.nutrition;
                    const units = food.amount;
                    const gramWeight = foodData.units.find(unit => unit.id === food.unit.id).gramWeight;
                    Object.entries(foodData.nutrients).forEach(([nutrientId, nutrientEntry]) => {
                        // nutrient amount =
                        //     nutrient amount / gram * grams / unit * number of units
                        nutrition[nutrientId].push({
                            amount: nutrientEntry.amount * gramWeight * units,
                            from: food.label,
                        });
                    });
                });
            return nutrition;
        };

        function getContents() {
            if (!state.date || state.errored) {
                return null;
            } else if (!state.loaded && state.foods.length === 0) {
                return <Loading />;
            } else {
                return getLists()
            }
        };
        function getLists() {
            return <div class="nutritionVisualizer-info layout-twoColumnFixedWidth">
                <NutritionVisualizerIntake
                        foods={state.foods}
                        addFood={addFood}
                        editFood={editFood}
                        removeFood={removeFood}
                        customEntries={state.customEntries}
                        addCustomEntry={addCustomEntry}
                        removeCustomEntry={removeCustomEntry}
                        syncServer={sync} />
                <NutritionVisualizerNutrients 
                        nutrition={state.nutrition} />
            </div>
        };

        function getSavedData() {
            makeAppRequestToEndpoint(endpoints.nutrition.api.getDays, { }, { detailed: true, date: state.date.toISOString() })
                .then(async (response) => {
                    const payload = response.payload;
                    state.date = new Date(payload.date);
                    state.foods = payload.entries;
                    state.customEntries = payload.customEntries;
                    state.id = payload.id;
                })
                .then(getFoodData)
                .then(() => state.loaded = true)
                .catch(() => state.errored = true);
        };
        function getFoodData() {
            if (!state.foods.length) {
                return;
            }

            return makeAppRequestToEndpoint(
                endpoints.nutrition.app.getNutritionFacts, 
                { },
                { fdcIds: state.foods.map(food => food.fdcId) }
            ).then((response) => {
                const fdcIdToNutrition = new Map(
                    response.payload.data.map(nutritionData => [nutritionData.fdcId, nutritionData])
                );
                // attach 'nutrition' field to each food entry, 
                // since they are retrieved by two different endpoints
                state.foods.forEach(food => 
                    // each inner object is reactive, 
                    // so use Vue.set to trigger re-render
                    food.nutrition = fdcIdToNutrition.get(food.fdcId));
                state.foods = [ ...state.foods ];
            });
        };

        if (state.date === undefined || // new entry, wait until date exists
                !hasSession) { // no session, will redirect, don't bother making requests
            return;
        }
        getSavedData();

        return () => 
            (<div class="nutritionVisualizer layout-fullWidth layout-oneColumn">
                <div class='flexBaselineAlignedRow'>
                    <h3 class='mr5'>Single-Day Nutritional Breakdown</h3>
                    <Tooltip 
                            content='Pick a date and put in the foods you ate for that day to get your nutritional intake for that day' />
                </div>
                <div class="nutritionVisualizer-date layout-smallWidth">
                    <span class='mr5'>What day is this for?</span>
                    <DatePicker placeholder='Pick a date' onChange={setDate} value={state.date} />
                </div>
                <transition name='fade' mode='out-in'>
                    { getContents() }
                </transition>
            </div>)
    },
}
</script>
