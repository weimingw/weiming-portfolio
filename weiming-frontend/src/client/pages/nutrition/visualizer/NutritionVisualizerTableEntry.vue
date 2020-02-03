<script>
import { roundNumber, asPercentage } from '../../../helpers/numberUtil';

import Dropdown from '../../../components/dropdown/Dropdown.vue';
import ProgressBar from '../../../components/progressBar/progressBar.vue';

export default {
    props: {
        intake: { },
        nutrientData: { },
    },
    computed: {
        fullIntake() {
            return this.intake.reduce(
                (fullIntake, intake) => fullIntake + intake.amount,
                0
            );
        },
        intakeRatio() {
            return roundNumber( this.fullIntake / this.nutrientData.amount, 2);
        }
    },
    methods: {
        renderEntry(h) {
            return <div class='nutritionVisualizer-nutrition-entryContents clickable'>
                <div class='nutritionVisualizer-nutrition-nutrientLabel'>{this.nutrientData.label}</div>
                <div class='nutritionVisualizer-nutrition-nutrientAmount'>
                    <ProgressBar progress={this.intakeRatio} />
                    <div class='nutritionVisualizer-nutrition-percentage'>
                        { asPercentage(this.intakeRatio) }
                    </div>
                </div>
            </div>
        },  
        renderBreakdown(h) {
            const items = this.intake.map(item => {
                const itemRatio = roundNumber(item.amount / this.fullIntake, 2);
                const ratioToRecommendation = roundNumber(item.amount / this.nutrientData.amount, 2);
                return <div class='nutritionVisualizer-nutrition-breakdownEntry'>
                    <div class='nutritionVisualizer-nutrition-breakdownEntryLabel'
                            title={item.from}>
                        {item.from}
                    </div>
                    <ProgressBar progress={itemRatio} color='green' />
                    <div class='nutritionVisualizer-nutrition-breakdownEntryPercentage'>{ asPercentage(itemRatio) }</div>
                </div>
            })
            return <div class='nutritionVisualizer-nutrition-breakdown'>
                <h5>Breakdown:</h5>
                { items }
            </div>
        },
    },
    render(h) {
        return <Dropdown
                className='nutritionVisualizer-nutrition-entry'
                renderButton={this.renderEntry}
                renderContents={this.renderBreakdown} />
    }
}
</script>