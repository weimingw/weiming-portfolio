<script>
import PageMixin from '../../../mixins/PageMixin';
import endpoints from '../../../../common/endpoints';

export default {
    mixins: [PageMixin],
    methods: {
        getHeaderProps() {
            return { title: endpoints.projects.pages.list.label }
        }
    },
    render(h) {
        return (<div>Projects</div>)
    }
}
</script>
