<script>
import Audiobar from '../../../components/audiobar/Audiobar.vue';

import PageMixin from '../../../mixins/PageMixin';
import endpoints from '../../../../common/endpoints';

import { animationDuration } from './hexagridUtils';
import HexagridContainer from './HexagridContainer.vue';
import './hexagrid.scss';

export default {
    mixins: [PageMixin],
    data() {
        return {
            analyser: null,
            gridOnPlayback: () => {},
        }
    },
    methods: {
        getHeaderProps() {
            return { title: endpoints.projects.pages.hexagrid.label }
        },

        addGridOnPlayback(child) {
            this.gridOnPlayback = child.onPlayback;
        },
        onPlayback(audioPlayer) {
            this.gridOnPlayback(audioPlayer);
        },
    },
    render(h) {
        return (<div class='hexagrid layout-oneColumn'>
            <HexagridContainer subscribeToPlayback={this.addGridOnPlayback.bind(this)} />
            <div class="hexagrid-footer">
                <Audiobar playerCallbackInterval={animationDuration * 3}
                        onPlayback={this.onPlayback} />
            </div>
        </div>)
    }
}
</script>
