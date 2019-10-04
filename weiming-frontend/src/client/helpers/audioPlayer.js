const analyserPresets = {
    'default': {
        fftSize: 32,
        maxDecibels: -30,
        smoothingTimeConstant: 0,
    }
}

function getAnalyserSettings(preset) {
    return {
        ... analyserPresets[preset] || {},
        ... analyserPresets['default']
    }
}

export default class AudioPlayer {
    constructor(options) {
        const { volume, analyserPreset, callbackInterval } = options;

        this.audioContext = new AudioContext();
        // node that controls volume
        this.gainNode = this.audioContext.createGain();
        // node that is used for analyzing the audio
        this.initializeAnalyser(analyserPreset);

        // audio data source
        this.audioBuffer = undefined;
        // source node that provides a one-way audio stream
        this.sourceNode = undefined; 

        // int - where playback started or would have started
        this.playbackStart = 0;
        // int - playback location after pause or change
        this.playbackLocation = 0;
        // float - percentage of playback location relative to length of song
        this.location = 0;
        // array<function> - functions to call periodically as the audio plays
        this.playbackSubscribers = [];
        this.playbackCallbackTimer = undefined;
        this.isPlaying = false;
        this.callbackInterval = callbackInterval;

        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = volume;
    }

    initializeAnalyser(preset) {
        this.analyser = this.audioContext.createAnalyser();
        const {
            smoothingTimeConstant,
            fftSize,
            maxDecibels
        } = getAnalyserSettings(preset);

        this.analyser.smoothingTimeConstant = smoothingTimeConstant;
        this.analyser.fftSize = fftSize;
        this.analyser.maxDecibels = maxDecibels;
    }

    async load(uri) {
        const buffer = await new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', uri, true);
            req.responseType = 'arraybuffer';

            req.onload = function (evt) {
                resolve(req.response);
            }

            req.send();
        });
        this.loadBuffer(buffer);
        return;
    }

    loadBuffer(buffer) {
        this.buffer = buffer;
        return new Promise(async (resolve, reject) => {
            try {
                await this.audioContext.resume();
                const audioBuffer = await this.audioContext.decodeAudioData(buffer);
                this.resetPlayer(audioBuffer);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    resetPlayer(audioBuffer) {
        this.disconnectNode();
        this.audioBuffer = audioBuffer;
        this.playbackLocation = 0;
        this.play();

        if (this.playbackSubscribers.length) {
            clearInterval(this.playbackCallbackTimer);
            this.playbackCallbackTimer = setInterval(() => {
                // find percentage of playback
                this.location = (this.audioContext.currentTime - this.playbackStart) / this.audioBuffer.duration;
                // call subscribers; let them deal with handling playing / paused
                this.playbackSubscribers.forEach(fn => fn(this));
                if (this.isPlaying && this.location > 1) {
                    // stop playback if we're finished with the track
                    this.isPlaying = false;
                    this.playbackLocation = 0;
                }
            }, this.callbackInterval);
        }
    }

    /* Changes gainNode gain (aka volume) */
    setVolume(amt) {
        this.gainNode.gain.value = amt * 0.5;
    }

    /*
     * Removes current audio source node from the pipeline,
     * therefore stopping any playback
     */
    disconnectNode() {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
    }

    /*
     * Connects an audio source node and starts playback at location
     * Location is calculated based on offset and duration of audio being played
     */
    play() {
        if (this.audioBuffer) {
            this.audioContext.resume().then(() => {
                this.sourceNode = this.audioContext.createBufferSource();
                this.sourceNode.connect(this.analyser);
                this.sourceNode.buffer = this.audioBuffer;

                // gets location of playback based on where it was last, but modded to avoid overflow if playback goes past audio length
                let location = this.playbackLocation % this.audioBuffer.duration;
                this.playbackStart = this.audioContext.currentTime - location;
                this.sourceNode.start(0, location); // start(when, offset)
                this.isPlaying = true;
            });
        } else if (this.buffer) {
            this.load(this.buffer);
        }
    }

    /*
     * Stops playback by disconnecting the audio source node
     * Sets playback location to where playback is at the time of pause
     * The location will be used to restart playback with a fresh audio node on resume
    */
    pause() {
        if (this.audioBuffer) {
            this.disconnectNode();
            this.playbackLocation = this.audioContext.currentTime - this.playbackStart;
        }
        this.isPlaying = false;
    }

    /*
     * Sets playback at some percentage of the audio's length
     * Disconnects audio source node to prevent multiple streams of audio being played concurrently
     * Finds location by converting percentage of audio to number of seconds
     */
    setPlaybackLocation(percentage) {
        if (this.audioBuffer) {
            this.disconnectNode();
            this.playbackLocation = percentage * this.audioBuffer.duration;
            if (this.isPlaying) {
                this.play();
            }
        }
    }

    /**
     * Adds a callback to be called periodically as playback occurs
     * @param {Function} callback function that accepts audioPlayer as an argument
     */
    addPlaybackSubscriber(callback) {
        this.playbackSubscribers.push(callback);
        return callback;
    }


    removePlaybackSubscriber(callback) {
        this.playbackSubscribers.filter(fn => fn != callback);
    }

    destroy() {
        if (this.sourceNode) this.sourceNode.disconnect();
        this.analyser.disconnect();
        this.gainNode.disconnect();
        clearInterval(this.playbackCallbackTimer);
        this.playbackSubscribers = [];
    }
}