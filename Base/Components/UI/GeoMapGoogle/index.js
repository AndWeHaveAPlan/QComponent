/**
 * Created by nikita on 29.08.16.
 */

var Property = require('../../../Property');
var Primitive = require('../Primitives');
var UIComponent = require('../../UIComponent');
var TextMarker = require('./TextMarker');
var symbolByNumber = require('./symbolByNumber');
var arrToLanLng = require('./arrToLanLng');
var minMax = require('./minMax');
var loadScript = require('./loadScript')

// require('./MapLabel');

function getApiByKey(apiKey) {
  return 'https://maps.googleapis.com/maps/api/js?key=' + apiKey;
}

// Available colors
// [blue, red, purple, yellow, green]
//
// function markerIconByColor(color) {
//   return(
//     'http://maps.google.com/mapfiles/ms/icons/'
//     + color
//     + '-dot.png'
//   );
// }
// https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png

module.exports = UIComponent.extend('GeoMapGoogle', {
  createEl: function () {
    var self = this;

    this.el = UIComponent.document.createElement('div');
    this.el.id = this.id;

    var apiKey = 'AIzaSyDgxDWQ9w-4tEtfV9dnACRN_eUBAp_OaBA';
    //
    loadScript({
      src: getApiByKey(apiKey),

      onload: function () {

        var elem = document.getElementById(self.id);
        //
        self.gmap = new google.maps.Map(elem, {
          center: arrToLanLng([55.76, 37.64]),
          zoom: self.get('zoom'),

          // TODO
          // make alternatives
          // controls: ['zoomControl', 'searchControl']
        });

        // TODO
        // make normal module
        require('./MapLabel');
        self.mapApi = google.maps;
        self.directionsService = new google.maps.DirectionsService;
        self.directionsDisplay = new google.maps.DirectionsRenderer;
        self.directionsDisplay.setMap(self.gmap);

        self._createHome.call(self);
        self._createPins.call(self);

        self.set('ready', true);
      }
    });
  },

  _createHome: function() {
    var homeData = this.get('home');
    //
    if(homeData) {
      this.home = TextMarker.create({
        position: arrToLanLng(homeData),
        map: this.gmap,
        label: 'A',
        text: 'You are here'
      });
    }
  },

  _removeHome: function() {
    if(this.home)
      TextMarker.remove(this.home);
  },

  _createPins: function() {
    var self = this;

    var pinsData = this.get('pins');
    //
    if(pinsData) {
      self.pins = pinsData
      .filter(function(options) { return options.coords && options.name; })
      .map(function(options, index) {
        var pos = options.coords;
        var name = options.name;

        return TextMarker.create({
          position: arrToLanLng(pos),
          map: self.gmap,
          label: symbolByNumber(index),
          text: name
        });
      });
    }
  },

  _removePins: function() {
    if(this.pins)
      this.pins.forEach(function(pin) {
        TextMarker.remove(pin);
      });
  },

  makeRoute: function(from, to) {
      var self = this;

      this.route = this.directionsService.route({
        origin: arrToLanLng(from),
        destination: arrToLanLng(to),
        travelMode: google.maps.TravelMode.TRANSIT
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {

          self.directionsDisplay.setDirections(response);
          console.log('response', response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
  },

  _prop: {
      ready: new Property('Boolean', {
          description: 'True if GoogleMap api ready'
        }, {
            get: Property.defaultGetter,
            set: function (key, value) {
            }
        }, false
      ),
      zoom: new Property('Number', {
          description: 'Map zoom level (setZoom for gmap)'
        }, {
          get: function (key, value) {
            return this.gmap? this.gmap.getZoom() : value;
          },
          set: function (key, value) {
            var zoomFixed = minMax(value, 0, 18);

            this.gmap.setZoom(zoomFixed)
            return zoomFixed;
          }
        }, 11
      ),
      pins: new Property('Array', {
          description: 'Mark on map'
        }, {
          get: Property.defaultGetter,
          set: function (key, value) {
            // CHANGE to update pins on module load
            //
            if (this.mapApi) {
              this._removePins.call(this);
              this._createPins.call(this);
            }
          }
        }
      ),
    home: new Property('Array', {description: 'You are here point'}, {
      get: Property.defaultGetter,
      set: function (key, value) {
        if (this.mapApi) {
          this._removeHome.call(this);
          this._createHome.call(this);
        }
      }
    }),
    moveList: new Property('Array', {} , {
      get: Property.defaultGetter,
      set: function(){}
    },[])
  }
});
