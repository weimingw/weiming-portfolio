import WriteupSectionImport from './WriteupSection.vue';
import './writeup.scss';

function baseRenderFunction(h) {
    return this.contents instanceof Function ?
        this.contents(h) :
        this.contents;
}

function createBasicWriteupComponent(tag, options={}) {
    return {
        name: `Writeup-${tag}`,
        props: {
            contents: {  
                default: function() {
                    return this.$slots.default;
                },
            },
            className: {
                type: String,
                default: '',   
            },
        },
        methods: {
            renderContents: options.renderContents || baseRenderFunction,
        },
        render(h) {
            return h(
                tag, {
                  attrs: { class: `writeup-${tag} ${this.className}` }
                },
                this.renderContents(h),
            );
        },
    }
}

export const WriteupSection = WriteupSectionImport;
export const WriteupHeader4 = createBasicWriteupComponent('h4');
export const WriteupHeader5 = createBasicWriteupComponent('h5');
export const WriteupParagraph = createBasicWriteupComponent('p');
export const WriteupListItem = createBasicWriteupComponent('li');
export const WriteupDiv = createBasicWriteupComponent('div');
export const WriteupList = createBasicWriteupComponent('ul', {
    renderContents(h) {
        if (this.contents instanceof Function) {
            return this.contents(h);
        } else if (this.contents instanceof Array) {
            return this.contents.map(item => 
                item instanceof String ?
                    <WriteupListItem contents={item} /> : 
                    item
            );
        } else {
            return this.contents;
        }
    }
});
