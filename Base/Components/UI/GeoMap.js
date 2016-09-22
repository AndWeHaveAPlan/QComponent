/**
 * Created by nikita on 30.09.16.
 */

var Property = require('../../Property');
var UIComponent = require('../UIComponent');
var GeoMapGoogle = require('./GeoMapGoogle');
var GeoMapYandex = require('./GeoMapYandex');
var EventManager = require('../../EventManager');

module.exports = UIComponent.extend('GeoMap', {
    createEl: function () {
        var self = this;

        // UIComponent.prototype.createEl.call(this);
        self.el = UIComponent.document.createElement('div');
        self.el.id = self.id;

        self._remakeMapByType(self.get('type'));
    },

    makeRoute: function(from, to) {
      if(this.myMap) this.myMap.makeRoute(from, to);
    },

    _remakeMapByType: function(mapType) {
      var self = this;

      // remove previous map
      var savedProps = {};
      if(this.myMap) {
        console.log('get savedProps');

        savedProps = {
          zoom: this.myMap.get('zoom'),
          pins: this.myMap.get('pins'),
          home: this.myMap.get('home'),
          center: this.myMap.get('center')
        };
        this.el.removeChild(this.myMap.el);
      }

      // create and append new map
      self.myMap = self._createMap(mapType, savedProps);
      self.el.appendChild(self.myMap.el);
      // self._ownComponents.push(self.myMap);

      // Make pipe to connect 'ready' and child 'ready' props
      self.localEventManager = new EventManager(self);
      self.localEventManager.registerComponent(self);
      self.localEventManager.registerComponent(self.myMap);
      self.localEventManager.releaseThePipes();

      self.localEventManager.createSimplePipe(
        {component: self.myMap.id, property: "ready"},
        {component: self.id,       property: "ready"}
      );
      self.localEventManager.createSimplePipe(
        {component: self.myMap.id, property: "moveList"},
        {component: self.id,       property: "moveList"}
      );
      self.localEventManager.createSimplePipe(
        {component: self.myMap.id, property: "center"},
        {component: self.id,       property: "center"}
      );
      // self.localEventManager.createSimplePipe(
      //   {component: self.id,       property: "center"},
      //   {component: self.myMap.id, property: "center"}
      // );
    },

    _createMap: function(type, savedProps) {
      console.log('_createMap, type/savedProps = '+ type, savedProps);

      var mapProps = {
        height: '100%',
        width: '100%',
        zoom: savedProps.zoom || this.get('zoom'),
        pins: savedProps.pins || this.get('pins'),
        home: savedProps.home || this.get('home'),
        center: savedProps.center || this.get('center')
      };

      // console.log('_createMap, mapProps = ', mapProps);

      var MapComponent;
      //
      if(type === 'yandex') {
        MapComponent = GeoMapYandex;
      } else if(type === 'google') {
        MapComponent = GeoMapGoogle;
      }

      if(MapComponent) {
        // ReSharper disable once InvokedExpressionMaybeNonFunction
        return new MapComponent(mapProps);
      } else {
        return console.error('GeoMap._createMap can\'t handle "'+ type +'" type');
      }
    },

    _prop: {
      ready: new Property('Boolean', {
          description: 'True if GeoMap api ready'
        }, {
          get: function(key, value) {
            console.log('geomap '+key+' get', value);
              return value;
          },
          set: function(key, value) {
            console.log('geomap '+key+' set', value);
          }
        }, false
      ),

      zoom: new Property('Number', {
          description: 'Map zoom level'
        }, {
          get: function(key, value) {
            console.log('geomap get '+ key, value);
            //
            if(this.myMap) return this.myMap.get(key, value);
          },
          set: function(key, value) {
            console.log('geomap set '+ key, value);
            //
            if(this.myMap) this.myMap.set(key, value);
          }
        }// , 11
      ),
      pins: new Property('Array', {
          description: 'Markers on map'
        }, {
          get: function(key, value) {
            console.log('geomap get '+ key, value);
            //
            if(this.myMap) return this.myMap.get(key, value);
          },
          set: function(key, value) {
            console.log('geomap set '+ key, value);
            //
            if(this.myMap) this.myMap.set(key, value);
          }
        }
      ),
      home: new Property('Array', {description: 'You are here point'}, {
        get: function(key, value) {
          console.log('geomap get '+ key, value);
          //
          if(this.myMap) return this.myMap.get(key);
        },
        set: function(key, value) {
          console.log('geomap set '+ key, value);
          //
          if(this.myMap) this.myMap.set(key, value);
        }
      }),
      moveList: new Property('Array', {}, {
        get: function(key, value) {
          console.log('geomap get '+ key, value);
          if(this.myMap) return this.myMap.get(key);
        },
        set: function(key, value) {}
      }, []),
      type: new Property('String', {}, {
        get: Property.defaultGetter,
        set: function(key, value) {
          console.log('geomap set '+ key, value);
          var self = this;

          self.set('ready', false);
          self._remakeMapByType(value);
        }
      }, 'yandex'),
      center: new Property('Array', {description: 'Map viewport center position'}, {
          get: Property.defaultGetter,
          set: function (key, value) {
            var thisCenter = this.get('center');
            if(this.myMap) {
              console.log('geomap set true', value, thisCenter);
              this.myMap.set(key, value);
            } else {
              console.log('geomap set false', value, thisCenter);
            }
          }
      }, [55.76, 37.64])
    }
});
