/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');

module.exports = UIComponent.extend('FlexSizeComponent', {

    _prop: {
        flexDefinition: new Property('String', {description: ""}, {
            get: Property.defaultGetter,
            set: function (name, value) {
                var fDef = this._flexDefinition
                    ? this._flexDefinition
                    : (this._flexDefinition = {parts: [], starCount: 0, flexLength: 0, fixLength: 0});
                var parts = this._data['flexDefinition'].split(' ');

                for (var i = 0; i < parts.length; i++) {
                    var fPart = parts[i];
                    var flex = false;
                    if (fPart[fPart.length - 1] === '*') {
                        flex = true;
                        fPart = fPart.substring(0, fPart.length - 1);
                    }

                    var parsedFloat = parseFloat(fPart);
                    if (fPart.length === 0) {
                        fDef.starCount += 1;
                        fDef.parts.push({flex: flex, part: 0})
                    } else if (parsedFloat == fPart) {
                        fDef.parts.push({flex: flex, part: parsedFloat});
                        if (flex)
                            fDef.flexLength += parsedFloat;
                        else
                            fDef.fixLength += parsedFloat;
                    }
                }

                this.updateLayout();
            }
        }, '*')
    }
}, function (cfg) {
    UIComponent.call(this, cfg);
});