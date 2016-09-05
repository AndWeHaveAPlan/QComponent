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
  return (
    'https://maps.googleapis.com/maps/api/js?key=' +
    apiKey +
    '&language=en' +
    '&libraries=places'
  )
}

// TODO
// ubrat'
//
function getElementByQuokkaId(id) {
  return window.c.get(id).el;
}

module.exports = UIComponent.extend('GeoMapGoogle', {
  createEl: function() {
    var self = this;

    this.el = UIComponent.document.createElement('div');
    this.el.id = this.id;

    var apiKey = 'AIzaSyDgxDWQ9w-4tEtfV9dnACRN_eUBAp_OaBA';
    //
    loadScript({
      src: getApiByKey(apiKey),

      onload: function() {

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
        self.directionsDisplay = new google.maps.DirectionsRenderer({
          // draggable: true,
          map: self.gmap
        });

        self._makeSearchBox(self.gmap);

        self._createHome.call(self);
        self._createPins.call(self);

        self.set('ready', true);
      }
    });
  },

  _makeSearchBox(map) {

    var input = UIComponent.document.createElement('input');
    input.type = "text";
    input.style = [
      "padding: 8px",
      "margin: 8px",
      "font-family: Roboto,Arial,sans-serif",
      "font-size: 15px",
      "box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px",
      "border-radius: 2px"
    ].join('; ');

    var searchBox = new google.maps.places.SearchBox(input);
    // var searchBox = new google.maps.places.Autocomplete(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


    console.log('_makeSearchBox', input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
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

          var newMoveList = self._updateMoveList.call(self);
          self.set('moveList', newMoveList);
        } else {
          console.error('Directions request failed due to ' + status);
          self.set('moveList', []);
        }
      });
  },

  _updateMoveList: function() {
    // Route connects start and end point
    var firstRoute = this.directionsDisplay.directions.routes[0];
    // Necessary point of route split it to legs
    // We have only 2 points === 1 leg
    var firstLeg = firstRoute.legs[0];
    // Steps are route moving guides
    var moveList = firstLeg.steps.map(function(step) {
      var instructions = step.instructions;
      var durationText = step.duration.text;
      return [instructions, durationText].join('. ')
    });

    return moveList;
  },

  _prop: {
      ready: new Property('Boolean', {
          description: 'True if GoogleMap api ready'
        }, {
          get: Property.defaultGetter,
          set: function(key, value) {}
        }, false
      ),
      zoom: new Property('Number', {
          description: 'Map zoom level (setZoom for gmap)'
        }, {
          get: function(key, value) {
            return this.gmap? this.gmap.getZoom() : value;
          },
          set: function(key, value) {
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
          set: function(key, value) {
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
      set: function(key, value) {
        if (this.mapApi) {
          this._removeHome.call(this);
          this._createHome.call(this);
        }
      }
    }),
    moveList: new Property('Array', {}, {
      get: Property.defaultGetter,
      set: function() {}
    }, []),
    type: new Property('String', {}, {
      get: Property.defaultGetter,
      set: function() {}
    }, 'yandex')
  }
});
