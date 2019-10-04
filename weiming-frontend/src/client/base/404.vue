<script>
import PageMixin from '../mixins/PageMixin';

export default {
    mixins: [PageMixin],
    methods: {
        getHeaderProps() {
            return {
                title: 'Error'
            }
        }
    },
    render(h) {
        return (<div class="main-page pageNotFound layout-oneColumn">
            <h2>Page Not Found</h2>
            An obligatory page.
        </div>)
    }
}
</script>
