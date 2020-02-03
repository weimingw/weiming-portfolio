<script>
import { dailyRecommendations, nutrientGroupings } from '../../../../common/app/nutrition/nutritionCommon';
import NutritionVisualizerTableEntry from './NutritionVisualizerTableEntry.vue';
import Tooltip from '../../../components/tooltip/Tooltip.vue';

export default {
    props: {
        /* each entry should have { amount, label } */
        nutrition: {
            required: true,
            default: {},
        }
    },
    computed: {
        percentages() {
        },
    },
    methods: {
        renderNutrientEntries(h) {
            const nutrition = this.nutrition;
            const groupedEntries = new Map();

            [ ...dailyRecommendations.entries() ].map(([nutrientId, data]) => {
                groupedEntries.set(data.type, groupedEntries.get(data.type) || []);

                groupedEntries.get(data.type).push(
                    <NutritionVisualizerTableEntry
                            intake={nutrition[nutrientId]}
                            nutrientData={data} />
                );
            });
            
            return <div class='nutritionVisualizer-nutrition-table'>
                { [ ...groupedEntries.values() ].map(groupedEntries =>
                <div class='nutritionVisualizer-nutrition-grouping'>
                    { groupedEntries }
                </div>
                ) }
            </div>
        },
        renderTooltipContents(h) {
            return <div class='tooltip-defaultContents'>
                <p>The table below shows your nutritional intake for the day.</p>
                <p>You can get a breakdown if you click a row in the table.</p>
            </div>
        }
    },
    render(h) {
        return <div class="nutritionVisualizer-nutrition">
            <div class='flexBaselineAlignedRow'>
                <h4 class='mr5'>Nutrition Details</h4>
                <Tooltip content={this.renderTooltipContents} />
            </div>
            { this.renderNutrientEntries(h) }
        </div>
    }
}
</script>
