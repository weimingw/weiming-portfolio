<script>
import { createElement as h } from '@vue/composition-api';
import { usePageConfiguration } from '../mixins/PageMixin';

export default {
    setup(props, context) {
        usePageConfiguration({
            headerProps: { title: 'Error' },
        });

        return () => 
            (<div class="main-page pageNotFound layout-oneColumn">
                <h2>Page Not Found</h2>
                An obligatory page.
            </div>)
    },
}
</script>
