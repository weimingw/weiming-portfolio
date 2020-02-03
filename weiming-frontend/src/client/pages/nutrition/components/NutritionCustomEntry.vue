<script>
import { dailyRecommendations } from '../../../../common/app/nutrition/nutritionCommon';
import { PERCENTAGE } from '../nutritionUiCommon';
import { useVerticalExpansion } from '../../../common/animations/VerticalExpansion';
import Select from '../../../components/select/Select.vue';
import { useMouseListener } from '../../../mixins/EventListeners';
import { getImageComponent } from '../../../assets';

import './nutritionCustomEntry.scss';
import { createElement as h, reactive, computed } from '@vue/composition-api';

const nutrientMetadataSorted = [ ...dailyRecommendations.entries() ]
    .map(entry => ({ key: entry[0], ...entry[1] }))
    .sort((a, b) => a.label.localeCompare(b.label));

export default {
    props: {
        entry: { type: Object, required: true },
        triggerDelete: { type: Function, }
    },
    setup(props, context) {
        const state = reactive({
            editing: false,
            unlistedNutrientsSorted: computed(() => {
                const listedNutrients = new Set(props.entry.nutrients.map(n => n.key));
                return nutrientMetadataSorted.filter(n => !listedNutrients.has(n.key));
            }),
        });

        useMouseListener({
            onMousedown(clickEvt) {
                if (!context.refs.el.$el.contains(clickEvt.target)) {
                    state.editing = false;
                }
            },
        });
        const { enterAnimation, leaveAnimation } = useVerticalExpansion();

        function renderLabel() {
            return state.editing ?
                [
                    <div key='instructions' class='nutritionCustomEntry-instructions'>
                        What did you eat?
                    </div>,
                    <input key='labelInput'
                            class='nutritionCustomEntry-labelInput'
                            placeholder='Enter a label for this item'
                            value={props.entry.label}
                            onChange={onLabelChange} />
                ] :
                <div key='label' class='nutritionCustomEntry-label'>
                    <h5>{props.entry.label}</h5>
                    <span onClick={() => props.triggerDelete(props.entry)}>
                        { getImageComponent(h, 'times', { className:'nutrientCustomEntry-deleteIcon deleteIcon clickable' }) }
                    </span>
                </div>
        };
        function renderEntry() {
            if (state.editing) {
                return [
                    <p class={`nutritionCustomEntry-description edit`} key='description-edit'>
                        What nutrients did it have?
                    </p>,
                    ...props.entry.nutrients.map(nutrient => renderNutrientItem(nutrient)),
                    <button key='addNutrient' type='button' 
                            class='nutritionCustomEntry-addNutrient' 
                            onClick={addNutrient}>
                        { getImageComponent(h, 'plus-square') }
                        Add Nutrient
                    </button>,
                    <button key='submit' type='submit' class='hidden' />, // allows Enter to finish
                ];
            } else {
                if (!props.entry.nutrients.length) {
                    return <div class='nutrientCustomEntry-row' key='no-nutrients'>No nutrients</div>
                }

                return [
                    ... props.entry.nutrients.map(nutrient => {
                        const nutrientMetadata = dailyRecommendations.get(nutrient.key)
                        return <li class='nutrientCustomEntry-row' key={nutrient.key}>
                            <span>{ nutrientMetadata.label }</span>
                            <span>{ nutrient.amount } { nutrient.unit }</span>
                        </li>
                    })
                ];
            }
        };
        function renderNutrientItem(nutrient) {
            const nutrientMetadata = dailyRecommendations.get(nutrient.key);
            const selection = [ 
                { key: nutrient.key, label: nutrientMetadata.label },
                ... state.unlistedNutrientsSorted
            ];
            const unitSelection = [
                { key: PERCENTAGE },
                { key: nutrientMetadata.unit }
            ]
            return <div class='nutrientCustomEntry-editRow' key={`${nutrient.key}-edit`}>
                    <Select className='nutrientCustomEntry-editRow-nutrient'
                            onChange={(key) => onNutrientChange(nutrient, key)}
                            selected={nutrient.key}
                            selection={selection} />
                    <input class='nutrientCustomEntry-editRow-amount'
                            type='number'
                            step='0.001'
                            onChange={(evt) => 
                                nutrient.amount = parseFloat(evt.target.value)}
                            placeholder='How much was the intake?'
                            value={nutrient.amount} />
                    <Select className='nutrientCustomEntry-editRow-unit'
                            onChange={(unit) => nutrient.unit = unit}
                            selected={nutrient.unit} 
                            selection={unitSelection} />
                    <span onClick={() => removeNutrient(nutrient)}>
                        { getImageComponent(h, 'times', { className: 'nutrientCustomEntry-deleteIcon deleteIcon clickable' }) }
                    </span>
                </div>
        };

        function onLabelChange(evt) {
            props.entry.label = evt.target.value;
        };
        function onNutrientChange(nutrient, nutrientId) {
            nutrient.key = nutrientId;
            nutrient.unit = PERCENTAGE;
        };
        function addNutrient() {
            const nutrient = state.unlistedNutrientsSorted[0];
            props.entry.nutrients.push({
                key: nutrient.key,
                amount: 0,
                unit: PERCENTAGE,
            });
        };
        function removeNutrient(nutrient) {
            props.entry.nutrients = props.entry.nutrients.filter(n => n.key !== nutrient.key);
        };
        function startEditing(evt) {
            if (!state.editing) { // doesn't apply to save button
                state.editing = true;
            }
        };
        function finish(evt) {
            state.editing = false;
            evt.preventDefault();
        };

        !props.entry.nutrients.length ? 
            addNutrient() : 
            null;

        return () => 
            (<transition-group   
                    tag="form" nativeOnSubmit={finish}
                    class={`nutritionCustomEntry ${state.editing ? '' : 'clickable'}`}
                    nativeOnClick={startEditing}
                    mode="out-in"
                    ref="el"
                    onEnter={enterAnimation}
                    onLeave={leaveAnimation}>
                { renderLabel() }
                { renderEntry() } 
            </transition-group>)
    },
}
</script>