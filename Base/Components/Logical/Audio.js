/**
 * Created by mishunya on 19.09.16.
 */

var LogicalComponent = require('./LogicalComponent');
var Property = require('../../Property');

module.exports = LogicalComponent.extend('Audio', {
    play: function () {
        this.audio.play();
    },
    pause: function () {
        this.audio.pause();
    },
    _prop: {
        pause: new Property('Function'),
        play: new Property('Function'),
        time: new Property('Number', {}, {
            set: function (key, val) {
                this.audio.currentTime = val;
            }, 
            get: function () {
                return this.audio.currentTime;
            }
        }),
        playOnStart: new Property('Boolean', {description: 'Do we need play audio on start?'}, void 0, true),
        value: new Property('String', {description: 'Url of audio source'},
            {
                get: Property.defaultGetter,
                set: function (name, value) {
                    this.audio.src = value;
                    if (this.get('playOnStart'))
                        this.play();
                }
            })
    }
}, function () {
    LogicalComponent.apply(this, arguments);
    this.audio = new Audio();
});