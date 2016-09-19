/**
 * Created by zibx on 08.07.16.
 */

var Base=require('../Base');

module.exports = (function() {
    'use strict';
    var Property = Base.Property;
    
    var tools = require('./Compile/tools'),
        els = {
            QObject: require('./Shadow/QObject'),
            AbstractComponent: require('./Shadow/AbstractComponent'),
            UIComponent: require('./Shadow/UIComponent'),
            HTMLComponent: require('./Shadow/HTMLComponent'),
            Selector: require('./Shadow/Selector'),
            String: {},
            Boolean: {},
            Variant: {},
            Array: {
                _prop: {
                    push: new Property('Function'),
                    splice: new Property('Function'),
                    pop: new Property('Function'),
                    unshift: new Property('Function'),
                    length: new Property('Number'),
                    _unknownProperty: function(key){
                        if(typeof key === 'number')
                            return new Property('Variant');
                        else 
                            return false;
                    }
                }
            },
            Number: {
                linkerSetter: function (value) {

                }
            },
            Function: {
                rawChildren: true
            }
        };

    var _knownComponents=Base.QObject._knownComponents;
    for(var className in _knownComponents) {
        if (_knownComponents.hasOwnProperty(className)) {
            var obj = {
                argumentParser: function (bonus, item) {
                    var splitted = tools.split(item.items, ':', 2),
                        subTokens = tools.split(splitted[0], ' ', 2);

                    return {
                        cls: tools.detox(tools.trim(subTokens[0]), true),
                        name: tools.detox(tools.trim(subTokens[1])),
                        value: tools.detox(tools.trim(splitted[1]), true)
                    };
                },
                public:{}
            };
            
            if(els[className])
                Base.QObject.prototype.applyIfNot(els[className], obj);
            else
                els[className] = obj;

            for(var propertyName in _knownComponents[className].prototype._prop){
                var prop = _knownComponents[className].prototype._prop[propertyName];
                els[className].public[propertyName] = {
                    name: propertyName,
                    type: prop.type,
                    value: ''
                };
            }
        }
    }

    for(var j in els) {
        els[j].defined=true;
    }

    return els;
})();