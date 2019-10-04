<script>
import { getImageComponent } from '../../../assets';
import Collapser from '../../../components/collapser/Collapser.vue';

export default {
    props: {
        item: { type: Object }
    },
    methods: {
        getLines(h) {
            return this.item.content.map(line => (
                <div class="aboutMe-line">
                    { line.icon ? getImageComponent(h, line.icon, { className: 'aboutMe-lineIcon' }) : null }
                    {line.text}
                </div>
            ))
        }
    },
    render(h) {
        const item = this.item;
        return (<Collapser class="aboutMe-entry">
            <h4 class="aboutMe-header" slot="collapserToggler">
                { getImageComponent(h, item.icon, { className: 'aboutMe-mainIcon' }) }
                {item.title}
            </h4>
            <div slot="collapserContent">
                { this.getLines(h) }
            </div>
            
        </Collapser>)
    }
}
</script>
