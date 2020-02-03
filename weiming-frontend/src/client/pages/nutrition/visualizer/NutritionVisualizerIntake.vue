<script>
import uuid from 'uuid/v4';
import { getImageComponent } from '../../../assets';
import { useVerticalExpansion } from '../../../common/animations/VerticalExpansion';
import NutritionFoodSearcher from '../components/NutritionFoodSearcher.vue';
import NutritionCustomEntry from '../components/NutritionCustomEntry.vue';
import Tooltip from '../../../components/tooltip/Tooltip.vue';
import { createElement as h, reactive } from '@vue/composition-api';

let i = 0;
export default {
    props: {
        addFood: {
            type: Function,
            required: true,
        },
        editFood: {
            type: Function,
            required: true,
        },
        removeFood: {
            type: Function,
            required: true,
        },
        addCustomEntry: {
            type: Function,
            required: true,
        },
        removeCustomEntry: {
            type: Function,
            required: true,
        },
        foods: {
            type: Array,
            required: true,
        },
        customEntries: {
            type: Array,
            required: true,
        },
        syncServer: {
            type: Function,
            required: true,
        },
    },
    setup(props, context) {
        const state = reactive({
            addingFood: false,
            editing: undefined,
            addingCustomEntry: false,
        });

        const { enterAnimation, leaveAnimation } = useVerticalExpansion();

        function renderListContents() {
            if (!props.foods.length) {
                return <p class="nutritionVisualizer-intake-list"></p>
            } else {
                return renderList();
            }
        };
        function renderList() {
            return <transition-group tag="ul"
                    class="nutritionVisualizer-intake-list"
                    onEnter={enterAnimation}
                    onLeave={leaveAnimation}>
                {
                    props.foods.map((foodMeta) => {
                        return state.editing === foodMeta.fdcId ?
                            renderEditor(foodMeta) :
                            renderListItem(foodMeta);
                    })
                }
            </transition-group>;
        };
        function renderListItem(foodMeta) {
            const text = `${foodMeta.amount} ${foodMeta.unit.label}`;
            return (
                <li class='nutritionVisualizer-intake-listItem' key={foodMeta.fdcId} title={foodMeta.label}>
                    <div class='clickable' onClick={() => state.editing = foodMeta.fdcId}>
                        <span class="label">{ foodMeta.label }</span>
                        <span class="serving">{text}</span>
                    </div>
                    { renderItemDeleteButton(foodMeta) }
                </li>
            );
        };
        function renderItemDeleteButton(foodMeta) {
            return <span class="nutritionVisualizer-foodItem-delete deleteIcon"
                    onClick={() => props.removeFood(foodMeta)}>
                { getImageComponent(h, 'times', { className: 'clickable' }) }
            </span>
        };
        function renderEditor(food) {
            return <NutritionFoodSearcher
                    key={food.fdcId}
                    foodProp={food}
                    onClose={() => state.editing = undefined}
                    onComplete={onEditCompletion} />
        };
        function renderManualEntries() {
            return <transition-group class='nutritionVisualizer-entries'
                    onEnter={enterAnimation}
                    onLeave={leaveAnimation}>
                {
                    props.customEntries.map(entry => 
                        <NutritionCustomEntry 
                                key={entry.id} 
                                entry={entry} 
                                triggerDelete={props.removeCustomEntry}
                                syncServer={props.syncServer} />
                    )
                }
            </transition-group>
        };
        function renderFoodTooltipContent() {
            return <div class='tooltip-defaultContents'>
                <p>Add foods that you have eaten on that day.</p>
                <p>Click on a list item if you need to change it.</p>
                <p>For better accuracy, I recommend putting in the individual ingredients (e.g. individual entries for <b>"lettuce", "tomato", and "cucumber"</b> instead of only one entry for <b>"salad"</b>)</p>
            </div>
        };
        function renderCustomEntryTooltipContent() {
            return <div class='tooltip-defaultContents'>
                <p>If you bought prepared food that has a nutrition label, you can add the info here.</p>
                <p>Each entry is grouped so that you can label each one, making it easier to keep track of.</p>
            </div>
        };

        /* Actual methods */
        function openFoodSearcher() {
            state.addingFood = true;
        };
        function closeFoodSearcher() {
            state.addingFood = false;
        };
        function onFoodSearchCompletion(foodMetadata) {
            props.addFood(foodMetadata);
            closeFoodSearcher();
        };
        function onEditCompletion(foodMetadata) {
            props.editFood(foodMetadata);
            state.editing = undefined;
        };
        function createCustomEntry() {
            const entry = { id: uuid(), label: 'Some food', nutrients: [], }
            props.addCustomEntry(entry);
        };

        return () => 
            (<div class="nutritionVisualizer-intake">
                <div class='flexBaselineAlignedRow'>
                    <h4 class='mr5'>Foods Eaten</h4>
                    <Tooltip content={renderFoodTooltipContent} />
                </div>
                { renderListContents() }
                <transition mode="out-in"
                        onEnter={enterAnimation}
                        onLeave={leaveAnimation}>
                    {
                        state.addingFood ?
                            <NutritionFoodSearcher
                                    onClose={closeFoodSearcher}
                                    onComplete={onFoodSearchCompletion} 
                            /> :
                            <button class="nutritionVisualizer-addBtn"
                                    onClick={openFoodSearcher}>
                                { getImageComponent(h, 'plus', { className: 'plusIcon mr5' }) }
                                <span>Add Food</span>
                            </button>
                    }
                </transition>
                <div class='flexBaselineAlignedRow'>
                    <h4 class='mr5'>Enter Your Own</h4>
                    <Tooltip content={renderCustomEntryTooltipContent} />
                </div>
                { renderManualEntries() }
                <button class="nutritionVisualizer-addBtn"
                        onClick={createCustomEntry}>
                    { getImageComponent(h, 'plus', { className: 'plusIcon mr5' }) }
                    <span>Add Custom Entries</span>
                </button>
            </div>)
    },
}
</script>
