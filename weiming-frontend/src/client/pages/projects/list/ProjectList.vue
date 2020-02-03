<script>
import { createElement as h } from '@vue/composition-api';
import { usePageConfiguration } from '../../../mixins/PageMixin';
import endpoints from '../../../../common/endpoints';

export default {
    setup(props, ctxt) {
        usePageConfiguration({
            headerProps: { title: endpoints.projects.pages.list.label }
        });

        return () => 
            (<div class='layout-mediumWidth'>
                <h4>Projects</h4>
                <p>I am constantly working on new projects.</p>
                <h4>Currently I have:</h4>
                <div class="mt5">
                    <h5><router-link to={endpoints.projects.pages.hexagrid.fullUrl}>Hexagrid</router-link></h5>
                    <p>A fun grid of hexagons that acts as an audio visualizer by rippling out waves based on the intensity of music.</p>
                </div>
                <div class="mt5">
                    <h5><router-link to={endpoints.nutrition.pages.tracker.fullUrl}>Nutritional Tracker</router-link></h5>
                    <p>A nutritional tracking app that uses USDA's free and publicly available nutritional data to help track nutritional intake, either on a daily scale or a longer scale.</p>
                    <p>Also allows you to enter your own intake for use cases like vitamin supplements.</p>
                </div>
            </div>);
    },
}
</script>
