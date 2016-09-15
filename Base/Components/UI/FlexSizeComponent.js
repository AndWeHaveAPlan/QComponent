/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');

module.exports = UIComponent.extend('FlexSizeComponent', {

    _prop: {
        flexDefinition: new Property('String', { description: "" }, {
            get: Property.defaultGetter,
            set: function (name, value) {
                var flexDefinition = this._flexDefinition
                    ? this._flexDefinition
                    : { parts: [], starCount: 0, flexLength: 0, fixLength: 0 };
                var stringParts = value.split(' ');

                for (var i = 0; i < stringParts.length; i++) {
                    var fPart = stringParts[i];

                    if (fPart.length === 0) continue;

                    var newPart = { part: 0, flex: true };

                    var parsedFloat = parseFloat(fPart);
                    if (fPart[fPart.length - 1] === '*') {
                        newPart.flex = true;

                        if (!parsedFloat) {
                            flexDefinition.starCount += 1;
                        } else {
                            newPart.part = parsedFloat;
                            flexDefinition.flexLength += parsedFloat;
                        }

                    } else {
                        newPart.flex = false;
                        newPart.part = parsedFloat;
                        flexDefinition.fixLength += parsedFloat;
                    }

                    flexDefinition.parts.push(newPart);
                }
                this._flexDefinition = flexDefinition;
                this.updateLayout();
            }
        }, '')
    }
}, function (cfg) {
    UIComponent.call(this, cfg);
});