/**
 * Created by deNULL on 16.09.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');

module.exports = UIComponent.extend('Video', {
    play: function () {
      this.el.play();
    },
    pause: function () {
      this.el.pause();
    },
    createEl: function () {
      var self = this;
      this.el = UIComponent.document.createElement('video');

      this.sourceEl = UIComponent.document.createElement('source');
      this.sourceEl.type = 'video/mp4';
      this.el.appendChild(this.sourceEl);

      this.el.addEventListener('timeupdate', function (event) {
        self.set('time', self.el.currentTime);
        self.fire('time', this);
      });
      this.el.addEventListener('durationchange', function (event) {
        self.set('duration', self.el.duration);
        self.fire('duration', this);
      });
    },
    _prop: {
      width: new Property('Number', { }, {
        get: function () {
          return this.el.offsetWidth;
        },
        set: function (name, value, oldValue, e) {
          this.el.style.width = value + 'px';
        }
      }),
      height: new Property('Number', { }, {
        get: function () {
          return this.el.offsetHeight;
        },
        set: function (name, value, oldValue, e) {
          this.el.style.height = value + 'px';
        }
      }),
      pause: new Property('Function'),
      play: new Property('Function'),
      time: new Property('Number', { description: 'Current playback position' }, {
        get: function () {
          return this.el.currentTime;
        },
        set: function (name, value, oldValue, e) {
          this.el.currentTime = value;
        }
      }),
      duration: new Property('Number', { }, {
        get: function () {
          return this.el.duration;
        },
        set: function (name, value, oldValue, e) {
          //
        }
      }),
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
      fullscreen: new Property('Boolean', { }, {
        get: function () {
          return !!(UIComponent.document.fullscreenElement);
        },
        set: function (name, value, oldValue, e) {
          if (value) {
            var el = this.el;
            if (el.requestFullscreen) {
              el.requestFullscreen();
            } else
            if (el.mozRequestFullScreen) {
              el.mozRequestFullScreen();
            } else if (el.webkitRequestFullScreen) {
              el.webkitRequestFullScreen();
            }
          } else {
            var doc = UIComponent.document;
            if (doc.exitFullscreen) {
              doc.exitFullscreen();
            } else
            if (doc.cancelFullscreen) {
              doc.cancelFullscreen();
            } else
            if (doc.mozCancelFullScreen) {
              doc.mozCancelFullScreen();
            }
          }
        }
      }),
      autoplay: new Property('Boolean'),
      value: new Property('String', { description: 'URL of the video' }, {
        get: Property.defaultGetter,
        set: function (name, value, oldValue, e) {
          this.sourceEl.src = value;

          if (this.get('autoplay')) {
            this.play();
          }
        }
      })
    }
});
