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

module.exports = UIComponent.extend('GeoMap2', {
    createEl: function () {
        var self = this;

        // UIComponent.prototype.createEl.call(this);
        self.el = UIComponent.document.createElement('div');
        self.el.id = self.id;

        var mapType = self.get('type');
        self.myMap = self._createMap(mapType);
        // self.el.appendChild(self.myMap.el);
        self._ownComponents.push(self.myMap);


        // this._ownComponents.remove(self.myMap);
        // this._ownComponents.push(self.myMap);

        // Make pipe to connect 'ready' and child 'ready' props
        self.localEventManager = new EventManager(self);
        self.localEventManager.registerComponent(self);
        self.localEventManager.registerComponent(self.myMap);
        self.localEventManager.releaseThePipes();

        self.localEventManager.createSimplePipe(
          {component: self.myMap.id, property: "ready"},
          {component: self.id,       property: "ready"}
        );

        // var mutatingPipe = new MutatingPipe(
        //   {component: self.myMap.id, property: "ready"},
        //   {component: self.id,       property: "ready"}
        // );
        // mutatingPipe.addMutator(function (value) {
        //
        //     // self.myMap._renderEl();
        //     // if (!number)
        //     //     return '';
        //     //
        //     // if (number.substring(0, 1) == 4) {
        //     //     return self.visaImg;
        //     // }
        //     // var n = parseInt(number.substring(0, 2));
        //     // if (n >= 51 && n <= 55) {
        //     //     return self.masterCardImg;
        //     // }
        //
        //     console.log('geomap mutatingPipe');
        //
        //     return value;
        // });

        // this.localEventManager.registerPipe(mutatingPipe);
    },

    makeRoute: function(from, to) {
      if(this.myMap) this.myMap.makeRoute(from, to);
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
            console.log('geomap2 '+key+' get', value);
            //
            // if(this.myMap) return this.myMap.get(key, value);
            return value
          },
          set: function(key, value) {
            console.log('geomap2 '+key+' set', value);
          }
        }, false
      ),

      zoom: new Property('Number', {
          description: 'Map zoom level'
        }, {
          get: function(key, value) {
            console.log('geomap2 get '+ key, value);
            //
            if(this.myMap) return this.myMap.get(key, value);
          },
          set: function(key, value) {
            console.log('geomap2 set '+ key, value);
            //
            if(this.myMap) this.myMap.set(key, value);
          }
        }// , 11
      ),
      pins: new Property('Array', {
          description: 'Markers on map'
        }, {
          get: function(key, value) {
            console.log('geomap2 get '+ key, value);
            //
            if(this.myMap) return this.myMap.get(key, value);
          },
          set: function(key, value) {
            console.log('geomap2 set '+ key, value);
            //
            if(this.myMap) this.myMap.set(key, value);
          }
        }
      ),
      home: new Property('Array', {description: 'You are here point'}, {
        get: function(key, value) {
          console.log('geomap2 get '+ key, value);
          //
          if(this.myMap) return this.myMap.get(key, value);
        },
        set: function(key, value) {
          console.log('geomap2 set '+ key, value);
          //
          if(this.myMap) this.myMap.set(key, value);
        }
      }),
      moveList: new Property('Array', {}, {
        get: function(key, value) {
          console.log('geomap2 get '+ key, value);
          //
          if(this.myMap) return this.myMap.get(key, value);
        },
        set: function(key, value) {}
      }, []),
      type: new Property('String', {}, {
        get: Property.defaultGetter,
        set: function(key, value) {
          console.log('geomap2 set '+ key, value);
          //
          // !push === pop ???
          // if(this.myMap) {
          //   this._ownComponents.remove(this.myMap);
          // }
          // console.log("set('type') this.myMap = ", this.myMap);


          // // remove inner map
          // this.el.removeChild(this.myMap.el);
          //
          // // create new map and append it
          // var mapType = value;
          //
          // this.myMap = this._createMap(mapType);
          // this.el.appendChild(this.myMap.el);



          // this._createMap(value);
          // this.gmap._printEl();
          // this.gmap._renderEl();

          // this._ownComponents.add(this.myMap);

          // if(value === 'yandex') { this.myMap = this.ymap; }
          // else if(value === 'google') { this.myMap = this.gmap; }
          // else {
          //   console.error('GeoMap.set(\'type\') can\'t handle "'+ value +'" value');
          // }
          // this._ownComponents.push(this.myMap);
        }
      // }, 'yandex')
      }, 'google')
    }
});
