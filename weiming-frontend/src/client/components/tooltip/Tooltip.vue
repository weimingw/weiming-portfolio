<script>
import { getImageComponent } from '../../assets';
import Dropdown from '../dropdown/Dropdown.vue'
import './tooltip.scss';

export default {
    props: {
        content: {
            type: [ Function, String ],
            required: true,
        },
        className: {
            type: String,
            default: '',
        }
    },
    methods: {
        renderButton(h) {
            return getImageComponent(h, 'question-circle', { className: 'tooltip-icon clickable' });
        },
        renderContents(h) {
            return this.content instanceof Function ? 
                this.content(h) :
                <p class='tooltip-defaultContents'>{this.content}</p>;
        },
    },
    render(h) {
        return <Dropdown
                renderButton={this.renderButton}
                renderContents={this.renderContents}
                expandOnHover={true}
                className={`tooltip ${this.className}`}
                ignoreMouseOverContent={true}
                contentClass='tooltip-contents'
        />
    }
}
</script>