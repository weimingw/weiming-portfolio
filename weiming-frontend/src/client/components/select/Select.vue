<script>
import Dropdown from '../dropdown/Dropdown.vue';
import './select.scss';
import { getImageComponent } from '../../assets';

/**
 * How to use:
 *   Render Select
 *   Pass in selection (Array<KeyLabel>)
 *   Pass in selected (String)
 */ 
export default {
    props: {
        rightAligned: {
            type: Boolean,
            default: false,
        },
        selection: {
            type: Array,
            required: true,
        },
        selected: {
            type: [ String, Number ],
        },
        className: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            hovering: undefined, // index of the element being hovered over
            expanded: false,
        }
    },
    methods: {
        renderSelected(h) {
            const selected = this.formattedSelection.find(keyLabel => keyLabel.key === this.selected);
            return <div class='select-clicker' 
                    tabindex="0"
                    onKeydown={this.onKeydown}
                    title={ selected ? selected.label : '' }
                    value={ selected ? selected.key : undefined }
                    onClick={() => this.expanded = true}>
                <span>{ selected ? selected.label : '' }</span>
                { getImageComponent(h, 'caret-down', {}) }
                </div>
        },
        renderSelection(h) {
            return <div class='select-options'>
                { this.formattedSelection.map((option, index) => 
                    <option class={`${this.hovering === index ? 'hover' : ''}`}
                            value={option.key} 
                            title={option.label}
                            onMouseover={(evt) => this.mouseover(evt, index)}
                            onMouseleave={(evt) => this.mouseleave(evt, index)}
                            onClick={this.onClick}>
                        { option.label }
                    </option>) }
            </div>
        },
        select() {
            this.$emit('change', this.formattedSelection[this.hovering].key);
        },
        onKeydown(evt) {
            evt.preventDefault();
            const numSelections = this.formattedSelection.length;
            this.expanded = true;
            switch (evt.key) {
                case 'ArrowDown':
                    this.hovering = this.hovering === undefined ?
                        0 :
                        Math.min(this.hovering + 1, numSelections - 1);
                    return;
                case 'ArrowUp':
                    this.hovering = this.hovering === undefined ? 
                        numSelections - 1 :
                        Math.max(this.hovering - 1, 0);
                    return;
                case 'PageDown':
                    this.hovering = this.hovering === undefined ?
                        0 :
                        Math.min(this.hovering + 5, numSelections - 1);
                    return;
                case 'PageUp':
                    this.hovering = this.hovering === undefined ? 
                        numSelections - 1 :
                        Math.max(this.hovering - 5, 0);
                    return;
                case 'Enter':
                    if (this.hovering) {
                        this.select(this.hovering);
                        this.collapse();
                    }
                    return;
                case 'Escape': 
                    this.collapse();
                    return;
            }
        },
        collapse() {
            this.expanded = false;
            this.hovering = undefined;
        },
        onClick(evt) {
            this.select();
            this.expanded = false;
        },
        mouseover(evt, index) {
            this.hovering = index;
        },
        mouseleave(evt, index) {
            if (this.hovering === index)
                this.hovering = undefined;
        },
    },
    computed: {
        formattedSelection() {
            return this.selection.map(option => {
                if (typeof option === 'string' || option instanceof String) {
                    return { key: option, label: option };
                } else if (option instanceof Object) {
                    return { key: option.key, label: option.label || option.key };
                } else {
                    return null;
                }
            }).filter(option => !!option);
        }
    },
    render(h) {
        return <Dropdown
                ref='dropdown'
                duration={100}
                rightAlign={true}
                className={`select clickable ${this.className}`}
                expanded={this.expanded}
                renderButton={this.renderSelected} 
                renderContents={this.renderSelection} />
    },
    
}
</script>
