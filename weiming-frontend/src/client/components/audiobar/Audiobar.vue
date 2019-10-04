<script>
import AudioPlayer from '../../helpers/audioPlayer.js';

import VolumeSlider from '../sliders/VolumeSlider.vue';
import PlaybackSlider from '../sliders/PlaybackSlider.vue';
import store, { actionKeys } from '../../vuex';
import { getImageComponent } from '../../assets';
import './audiobar.scss';

import song from '../../assets/files/Ace Attorney Remix Objection 2001 by RetroSpecter.mp3'

export default {
    store,
    props: {
        showFileInput: {
            type: Boolean,
            default: true,
        },
        playerCallbackInterval: {
            type: Number,
        },
    },
    data() {
        return {
            audioPlayer: new AudioPlayer({ 
                volume: this.$store.state.hexagridVolume, 
                callbackInterval: this.playerCallbackInterval }),
            fileName: '',
            playing: false,
            showVolumeSlider: false,
            playbackLocation: 0,
        }
    },
    methods: {
        /* Render helpers */
        getFileInputButton(h) {
            if (this.showFileInput) {
                return <button class="audiobar-fileInput">
                    Play File
                </button>
            }
            return null;
        },
        getPlayButton(h) {
            return <button class='audiobar-playButton' onClick={this.togglePlayback}>
                { this.playing ? 
                    getImageComponent(h, 'pause', { className: 'audiobar-icon' }) :
                    getImageComponent(h, 'play', { className: 'audiobar-icon' }) }
            </button>
        },
        getVolumeSlider(h) {
            let volumeSliderStyle = {
                visibility: this.showVolumeSlider ? 'visible' : 'hidden',
            }
            return <div class="audiobar-volumeSlider" style={volumeSliderStyle}>
                <VolumeSlider x={1}
                        y={this.$store.state.hexagridVolume}
                        onVolumeChange={this.handleVolumeChange} />
            </div>;
        },
        getVolumeButton(h) {
            return <button class="audiobar-volumeButton" onClick={this.toggleVolumeSlider}>
                { getImageComponent(h, 'volume-up', { className: 'audiobar-icon'}) }
            </button>
        },
        /* Render helpers end */

        /* Event handlers */
        togglePlayback() {
            this.playing = !this.playing;
        },
        toggleVolumeSlider() {
            this.showVolumeSlider = !this.showVolumeSlider;
        },
        handleVolumeChange(volume) {
            this.$store.dispatch(actionKeys.SET_HEXAGRID_VOLUME, volume);
            this.audioPlayer.setVolume(volume);
        },
        handlePlaybackChange(percentage) {
            this.playbackLocation = percentage;
            this.audioPlayer.setPlaybackLocation(percentage);
        },
        togglePlayback() {
            if (this.playbackLocation > 1) {
                this.playbackLocation = 0;
            }
            this.playing ?
                this.audioPlayer.pause() :
                this.audioPlayer.play();
            this.playing = !this.playing;
        },
        onPlayback(audioPlayer) {
            if (audioPlayer.isPlaying) {
                let location = audioPlayer.location;
                if (location > 1) { // stop playback if we're finished with the track
                    this.playing = false;
                } else {
                    this.emitOnPlayback(audioPlayer);
                    this.playbackLocation = location; // sync UI with playback
                }
            } else {
                this.playing = false;
            }
        },
        /* Event handlers end */

        /* Misc */
        emitOnPlayback(audioPlayer) {
            this.$emit('playback', audioPlayer);
        },
    },
    mounted: async function() {
        await this.audioPlayer.load(song);
        this.audioPlayer.addPlaybackSubscriber(this.onPlayback);
        this.playing = true;
        let name = song.split('/').pop().split('.')[0];
        this.fileName = name;
    },
    render(h) {
        return <div class="audiobar">
            <div class="audiobar-row audiobar-playbackMeter">
                <PlaybackSlider x={this.playbackLocation} y={1} onPlaybackChange={this.handlePlaybackChange} />
            </div>
            <div class="audiobar-row audiobar-buttons">
                { /* this.getFileInputButton() */ }
                { this.getPlayButton(h) }
                <div class="audiobar-fileName">
                    {this.playing ? `Now playing: ${this.fileName}` : 'Playback paused'}
                </div>
                { this.getVolumeButton(h) }
                { this.getVolumeSlider(h) }
            </div>
        </div>
    },
    destroyed() {
        this.audioPlayer.destroy();
    }
}
</script>
