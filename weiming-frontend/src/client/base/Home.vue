<script>
import './basePages.scss';
import { createElement as h } from '@vue/composition-api';
import { usePageConfiguration } from '../mixins/PageMixin';


export default {
    setup(props, ctxt) {
        usePageConfiguration({
            headerProps: { title: 'Home' }
        });

        return () => 
            (<div class="main-page homePage layout-mediumWidth layout-oneColumn">
                <h2>I am Weiming,</h2>
                <h3>a software engineer with a frontend focus.</h3>
                <h4>Welcome to my personal website!</h4>
                <div>I use it to showcase my web dev skills while practicing new ones that I want to pick up. Almost every line of code is written from scratch by me.</div>
                <div>It is implemented in Vue.js and hosted on an Express server.</div>
                <div>I modeled it after the color scheme I use on my code editor (Egoist One in VS Code).</div>
            </div>)
    },
}
</script>
