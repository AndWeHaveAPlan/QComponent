/**
 * Created by deNULL on 16.09.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');

module.exports = UIComponent.extend('Video', {
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
      var self = this;
      this.el = UIComponent.document.createElement('video');

      //this.sourceEl = UIComponent.document.createElement('source');
      //this.sourceEl.type = 'video/mp4';
      //this.el.appendChild(this.sourceEl);

      this.el.addEventListener('timeupdate', function (event) {
        self.updating = true;
        self.set('time', self.el.currentTime);
        self.updating = false;
      });
      this.el.addEventListener('durationchange', function (event) {
        self.set('duration', self.el.duration);
      });
    },
    _prop: {
      pause: new Property('Function'),
      play: new Property('Function'),
      stop: new Property('Function'),
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
      autoplay: new Property('Boolean',
      {
          set: function(name, value) {
              if (value)
                  this.play();
          }
      }),
      value: new Property('String', { description: 'URL of the video' }, {
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
});
