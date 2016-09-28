/**
 * Created by mishunya on 19.09.16.
 */

var LogicalComponent = require('./LogicalComponent');
var Property = require('../../Property');

module.exports = LogicalComponent.extend('Audio', {
    play: function () {
        this.audio.play();
    },
    stop: function () {
        this.audio.pause();
    },
    pause: function () {
        this.audio.pause();
    },
    _prop: {
        pause: new Property('Function'),
        play: new Property('Function'),
        time: new Property('Number', { description: 'Current playback position' }, {
            get: function () {
                return this.audio.currentTime;
            },
            set: function (name, value, oldValue, e) {
                if (!this.updating)
                    this.audio.currentTime = value;
            }
        }),
        duration: new Property('Number', {}),
        volume: new Property('Number', { description: 'Current volume' }, {
            get: function () {
                return this.audio.volume;
            },
            set: function (name, value, oldValue, e) {
                this.audio.volume = value;
            }
        }),
        controls: new Property('Boolean', {}, {
            get: function () {
                return this.audio.controls;
            },
            set: function (name, value, oldValue, e) {
                this.audio.controls = value;
            }
        }),
        muted: new Property('Boolean', {}, {
            get: function () {
                return this.audio.muted;
            },
            set: function (name, value, oldValue, e) {
                this.audio.muted = value;
            }
        }),
        autoplay: new Property('Boolean',
            {
                set: function (name, value) {
                    if (value)
                        this.play();
                }
            }),
        value: new Property('String', { description: 'URL of the audio' }, {
            get: Property.defaultGetter,
            set: function (name, value, oldValue, e) {
                this.stop();
                this.audio.src = value;

                if (this.get('autoplay')) {
                    this.play();
                }
            }
        })
    }
}, function () {
    LogicalComponent.apply(this, arguments);
    this.audio = LogicalComponent.document.createElement('video');

    var self = this;

    this.audio.addEventListener('timeupdate', function (event) {
        self.updating = true;
        self.set('time', self.audio.currentTime);
        self.updating = false;
    });

    this.audio.addEventListener('durationchange', function (event) {
        self.set('duration', self.audio.duration);
    });
});