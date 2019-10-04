<script>
import { getImageComponent } from '../../../assets';
import VerticalExpandMixin from '../../../common/animations/VerticalExpandMixin';
import NutritionfoodSearcher from '../common/NutritionFoodSearcher.vue';

let i = 0;
export default {
    mixins: [ VerticalExpandMixin ],
    props: {
        addFood: {
            type: Function,
            required: true,
        },
        removeFood: {
            type: Function,
            required: true,
        },
        foods: {
            type: Array,
            required: true,
        },
    },
    data: function() {
        return {
            searching: false,
            duration: 150,
        }
    },
    methods: {
        renderListContents(h) {
            if (!this.foods.length) {
                return <p class="nutritionVisualizer-foods-list"></p>
            } else {
                return this.renderList(h);
            }
        },
        renderList(h) {
            return <transition-group tag="ul"
                    class="nutritionVisualizer-foods-list"
                    onEnter={this.enterAnimation}
                    onLeave={this.leaveAnimation}> {
                this.foods.map(foodMeta =>
                    <li key={foodMeta.fdcId} title={foodMeta.label}>
                        <span class="label">{ foodMeta.label }</span>
                        <span class="spacer" />
                        { this.renderListItemTail(h, foodMeta) }
                    </li>)
            } </transition-group>
        },
        renderListItemTail(h, foodMeta) {
            const text = `${foodMeta.amount} ${foodMeta.unit}`;
            return <span class="tail" title={text}>
                <span class="serving">{text}</span>
                { this.renderItemDeleteButton(h, foodMeta) }
            </span>
        },
        renderItemDeleteButton(h, foodMeta) {
            return <span class="nutritionVisualizer-foodItem-delete deleteIcon"
                    onClick={() => this.removeFood(foodMeta)}>
                { getImageComponent(h, 'times', { className: 'clickable' }) }
            </span>
        },
        renderEditor(h) {
            return <NutritionfoodSearcher
                    onClose={this.closefoodSearcher}
                    foods={this.foods}
                    addFood={this.addFood}
                    onComplete={this.onFoodSearchCompletion} />
        },
        openfoodSearcher() {
            this.searching = true;
        },
        closefoodSearcher() {
            this.searching = false;
        },
        onFoodSearchCompletion(foodMetadata) {
            this.addFood(foodMetadata);
            this.closefoodSearcher();
        },
    },
    render(h) {
        return <div class="nutritionVisualizer-foods">
            <h5>Foods Eaten</h5>
            { this.renderListContents(h) }
            <transition mode="out-in"
                    onEnter={this.enterAnimation}
                    onLeave={this.leaveAnimation}>
                { this.searching ?
                    this.renderEditor(h) :
                    <button class="nutritionVisualizer-editFoodBtn"
                            onClick={this.openfoodSearcher}>
                        { getImageComponent(h, 'plus', { className: 'plusIcon mr5' }) }
                        <span>Add Food</span>
                    </button> }
            </transition>
        </div>
    },
}
</script>
