<script>
import { useStore, actionKeys } from '../../../vuex';
import { useRouter } from '../../../router';

import Loading from '../../../base/Loading.vue'; 
import { useSessionRequired } from '../../../mixins/SessionRequiredMixin';
import { dialogHandler } from '../../../components/dialog/Dialog.vue';
import { useVerticalExpansion } from '../../../common/animations/VerticalExpansion';

import './nutritionTracker.scss';
import nutritionEndpoints from '../../../../common/endpoints/nutritionEndpoints'; 
import { getImageComponent } from '../../../assets';
import { makeAppRequestToEndpoint } from '../../../helpers/requestUtils';
import { getNutrientPercentageFromAmount, getNutrientAmountFromCustomEntryItem, nutrientIds } from '../nutritionUiCommon';
import { MACRONUTRIENTS, HELPFUL, VITAMINS, OTHER, BLANK_NUTRIENT_MAP } from './nutritionTrackerHelpers';
import Tooltip from '../../../components/tooltip/Tooltip.vue';
import PolarChart from '../../../components/charts/PolarChart.vue';
import * as colors from '../../../common/colors';
import { createElement as h, reactive, watch } from '@vue/composition-api';

const colorOrdering = [ colors.BLUE, colors.GREEN, colors.PURPLE, colors.YELLOW ];
const fillColorOrdering = colorOrdering.map(c => colors.hexToRgb(c, 0.25));

function getNutrientsFromCustomEntries(props, state) {
    const nutrients = { ...BLANK_NUTRIENT_MAP };
    state.daysList.forEach(day => {
        day.customEntries.forEach(entry => {
            entry.nutrients.forEach(nutrient => {
                nutrients[nutrient.key] += getNutrientAmountFromCustomEntryItem(nutrient);
            });
        });
    });
    return nutrients;
};

function getIntakesFromFood(props, state) {
    const intakes = new Map();
    state.daysList.forEach(day => {
        day.entries.forEach(entry => {
            const intakeForFood = intakes.get(entry.fdcId) || [];
            intakeForFood.push(entry);
            intakes.set(entry.fdcId, intakeForFood);
        });
    });
    return intakes;
};

async function getNutrientsFromFoods(props, state) {
    const intakes = getIntakesFromFood(props, state);
    const nutrientsFromFoods = { ...BLANK_NUTRIENT_MAP };

    if (intakes.size) {
        const response = await makeAppRequestToEndpoint(
        nutritionEndpoints.app.getNutritionFacts, 
            { },
            { fdcIds: [ ...intakes.keys() ] }
        );
        response.payload.data.forEach(food => { // for each food eaten
            const foodIntake = intakes.get(food.fdcId);
            foodIntake.forEach(({ amount, unit }) => {  // go through each time the user ate the food
                Object.entries(food.nutrients).forEach(([ nutrientId, nutrientData ]) => { 
                    // go through each nutrient that food had
                    // and add its nutritional value to the total
                    nutrientsFromFoods[nutrientId] += nutrientData.amount * amount * unit.gramWeight;
                }); 
            });
        });
    }
    return nutrientsFromFoods;
};

async function recalculateNutrition(props, state) {
    const nutrientsFromCustomEntries = getNutrientsFromCustomEntries(props, state);
    const nutrientsFromFoods = await getNutrientsFromFoods(props, state);

    const nutrients = {};
    Object.keys(nutrientsFromFoods).forEach(nutrientId => {
        const totalAmount = (nutrientsFromCustomEntries[nutrientId] + nutrientsFromFoods[nutrientId]) / state.daysList.length;
        nutrients[nutrientId] = Math.min(getNutrientPercentageFromAmount(nutrientId, totalAmount), 100);
    })

    state.nutrients = nutrients;
};

/* Gets days from server */
function getDays(props, state) {
    makeAppRequestToEndpoint(nutritionEndpoints.api.getDays, { }, { detailed: true })
            .then(response => state.daysList = response.payload)
            .catch(err => null);
};

export default {
    setup(props, context) {
        const state = reactive({
            daysList: undefined,
            duration: 200,
            openDialog: false,
            isDeleting: false,
            nutrients: undefined,
        });

        const store = useStore();
        const router = useRouter();
        const { hasSession } = useSessionRequired();
        const { enterAnimation, leaveAnimation } = useVerticalExpansion();

        if (hasSession) {
            getDays(props, state);
        }

        watch(() => {
            state.daysList ?
                recalculateNutrition(props, state) :
                null
        });

        function renderContents() {
            return state.daysList === undefined ?
                    <Loading /> :
                    renderDaysList();
        };
        function renderDaysList() {
            return <transition-group tag='ul' class='nutritionTracker-daysList'
                    onEnter={enterAnimation}
                    onLeave={leaveAnimation}>
                <button class='nutritionTracker-addDay mt10 mb10' key='addDayBtn'
                        onClick={() => router.push({ path: nutritionEndpoints.pages.visualizer.fullUrl })}>
                    { getImageComponent(h, 'plus', { className: 'plusIcon mr5' }) }
                    Add a new day
                </button>
                <div class='flexBaselineAlignedRow' key='header'>
                    <h3 class='mr5' key='header'>Most Recent Entries</h3>
                    <Tooltip content='Add days to start tracking!' />
                </div>
                { state.daysList.map(day => renderDaysListItem(day)) }
            </transition-group>
        };
        function renderDaysListItem(day) {
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
                <div class='nutritionTracker-removeDay' onClick={() => showDeleteConfirmation(day)}>
                    { getImageComponent(h, 'times', { className: 'deleteIcon clickable' }) }
                </div>
            </li>
        };
        function renderDeletionDialog(closeDialog, day) {
            return <form class={`${state.isDeleting ? 'disabled' : ''} nutritionTracker-deletionDialog`}
                    onSubmit={(evt) => deleteDay(evt, day, closeDialog)}>
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
        };
        function renderGraphs() {
            if (!state.nutrients) {
                return;
            }

            return <div key='graphs' class='nutritionTracker-graphs'>
                 { renderGraph(MACRONUTRIENTS, 1) }
                 { renderGraph(HELPFUL, 2) }
                 { renderGraph(OTHER, 3) }
                 { renderGraph(VITAMINS, 4) }
            </div>
        };
        function renderGraph(nutrientList, colorNumber) {
            const options = getChartOptions('', nutrientList, colorNumber);
            return <div class={`nutritionTracker-graphContainer nutritionTracker-graphContainer-${colorNumber}`}>
                <PolarChart options={options} />
            </div>
        };
        
        function showDeleteConfirmation(day) {
            // delete with a dialog...
            dialogHandler.displayDialog({
                renderBodyElements: (h, closeDialog) => renderDeletionDialog(closeDialog, day),
                useDefaultFooter: false,
            });
        };
        function deleteDay(evt, deleteDay, closeDialog) {
            state.isDeleting = true;
            makeAppRequestToEndpoint(nutritionEndpoints.api.deleteDay, { }, { id: deleteDay.id })
                    .then(() => {
                        state.daysList = state.daysList.filter(day => day.id != deleteDay.id);
                        closeDialog();
                        state.isDeleting = false;
                    });
            evt.preventDefault();
        };
        function getChartOptions(label, nutrientList, colorNumber) {
            const options = {
                chart: {
                    width: 300,
                    height: 240,
                    margin: [0, 70, 0, 70],
                },
                title: {
                    text: null,
                },
                xAxis: { 
                    categories: nutrientList.map(macronutrient => macronutrient.label),
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    tickInterval: 25,
                },
                legend: {
                    enabled: false,
                },
                series: [{
                    type: 'area',
                    data: nutrientList.map(n => state.nutrients[n.nutrientId]),
                    color: colorOrdering[colorNumber-1],
                    fillColor: fillColorOrdering[colorNumber-1],
                }],
            }
            return options;
        };

        return () => 
            (<div class='nutritionTracker layout-mediumWidth layout-oneColumn'>
                <div class='flexBaselineAlignedRow'>
                    <h3 class='mr5'>Nutritional Intake Overview</h3>
                    <Tooltip content='The graphs below display the average intake of each nutrient tracked over the days you have listed.' />
                </div>
                <transition-group name='fade'>
                    
                    { renderGraphs() }
                </transition-group>
                <div class='nutritionTracker-contents'>
                    <transition mode='out-in' name='fade'>
                        { renderContents() }
                    </transition>
                </div>
            </div>)
    },
}
</script>
