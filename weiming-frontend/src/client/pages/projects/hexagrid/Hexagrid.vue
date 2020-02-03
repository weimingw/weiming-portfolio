<script>
import Audiobar from '../../../components/audiobar/Audiobar.vue';

import { usePageConfiguration } from '../../../mixins/PageMixin';
import endpoints from '../../../../common/endpoints';

import { animationDuration } from './hexagridUtils';
import HexagridContainer from './HexagridContainer.vue';
import './hexagrid.scss';
import { createElement as h, reactive } from '@vue/composition-api';

export default {
    setup(props, ctxt) {
        const state = reactive({
            analyser: null,
            gridOnPlayback: () => {}
        });

        usePageConfiguration({
            headerProps: { title: endpoints.projects.pages.hexagrid.label }
        });

        function addGridOnPlayback(playbackObserver) {
            state.gridOnPlayback = playbackObserver;
        };
        function onPlayback(audioPlayer) {
            state.gridOnPlayback(audioPlayer);
        };

        return () => 
            (<div class='hexagrid layout-oneColumn'>
                <HexagridContainer subscribeToPlayback={addGridOnPlayback} />
                <div class="hexagrid-footer">
                    <Audiobar playerCallbackInterval={animationDuration * 3}
                            onPlayback={onPlayback} />
                </div>
            </div>)
    },
}
</script>
