/**
 * Created by nikita on 30.09.16.
 */

var Property = require('../../Property');
var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
// var QObject = require('../../QObject');
var GeoMapGoogle = require('./GeoMapGoogle');
var GeoMapYandex = require('./GeoMapYandex');
var MutatingPipe = require('../../Pipes/MutatingPipe');
var EventManager = require('../../EventManager')

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
      if(this.myMap) this.el.removeChild(this.myMap.el);

      // create and append new map
      self.myMap = self._createMap(mapType);
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
    },

    _createMap: function(type) {
      console.log('_createMap, type = '+ type);

      var mapProps = {
        height: '100%',
        width: '100%'
      };

      // Get some using props
      var zoom = this.get('zoom');
      var pins = this.get('pins');
      var home = this.get('home');

      // And use them as child map props
      if(zoom) mapProps.zoom = zoom;
      if(pins) mapProps.pins = pins;
      if(home) mapProps.home = home;

      // console.log('_createMap, mapProps = ', mapProps);

      var MapComponent;
      //
      if(type === 'yandex') {
        MapComponent = GeoMapYandex;
      } else if(type === 'google') {
        MapComponent = GeoMapGoogle;
      }

      if(MapComponent) {
        return new MapComponent(mapProps);
      } else {
        console.error('GeoMap._createMap can\'t handle "'+ type +'" type');
      }
    },

    _prop: {
      ready: new Property('Boolean', {
          description: 'True if GeoMap api ready'
        }, {
          get: function(key, value) {
            console.log('geomap '+key+' get', value);
            //
            // if(this.myMap) return this.myMap.get(key, value);
            return value
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
          if(this.myMap) return this.myMap.get(key, value);
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
          //
          if(this.myMap) return this.myMap.get(key, value);
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
      }, 'yandex')
      // }, 'google')
    }
});
