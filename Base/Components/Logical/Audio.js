/**
 * Created by mishunya on 19.09.16.
 */

var LogicalComponent = require('./LogicalComponent');
var Property = require('../../Property');

module.exports = LogicalComponent.extend('Audio', {
    play: function () {
        this.el.play();
    },
    stop: function () {
        this.el.pause();
    },
    pause: function () {
        this.el.pause();
    },
    createEl: function () {

    },
    _prop: {
        pause: new Property('Function'),
        play: new Property('Function'),
        time: new Property('Number', { description: 'Current playback position' }, {
            get: function () {
                return this.el.currentTime;
            },
            set: function (name, value, oldValue, e) {
                if(!this.updating)
                    this.el.currentTime = value;
            }
        }),
        duration: new Property('Number', { }),
        volume: new Property('Number', { description: 'Current volume' }, {
            get: function () {
                return this.el.volume;
            },
            set: function (name, value, oldValue, e) {
                this.el.volume = value;
            }
        }),
        controls: new Property('Boolean', { }, {
            get: function () {
                return this.el.controls;
            },
            set: function (name, value, oldValue, e) {
                this.el.controls = value;
            }
        }),
        muted: new Property('Boolean', { }, {
            get: function () {
                return this.el.muted;
            },
            set: function (name, value, oldValue, e) {
                this.el.muted = value;
            }
        }),
        autoplay: new Property('Boolean',
            {
                set: function(name, value) {
                    if (value)
                        this.play();
                }
            }),
        value: new Property('String', { description: 'URL of the audio' }, {
            get: Property.defaultGetter,
            set: function (name, value, oldValue, e) {
                this.stop();
                this.el.src = value;

                if (this.get('autoplay')) {
                    this.play();
                }
            }
        })
    }
}, function () {
    LogicalComponent.apply(this, arguments);
    this.el = this.audio = LogicalComponent.document.createElement('video');
    var self = this;

    this.el.addEventListener('timeupdate', function (event) {
        self.updating = true;
        self.set('time', self.el.currentTime);
        self.updating = false;
    });
    this.el.addEventListener('durationchange', function (event) {
        self.set('duration', self.el.duration);
    });
});