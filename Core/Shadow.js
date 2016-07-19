/**
 * Created by zibx on 08.07.16.
 */

var Base=require('../Base');

module.exports = (function() {
    'use strict';
    var tools = require('./Compile/tools'),
        els = {
            QObject: require('./Shadow/QObject'),
            AbstractComponent: require('./Shadow/AbstractComponent'),
            UIComponent: require('./Shadow/UIComponent'),
            HTMLComponent: require('./Shadow/HTMLComponent'),
            String: {},
            Boolean: {},
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
            els[className] = {
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

            for(var propertyName in _knownComponents[className].prototype._setter){
                if(propertyName!=='default')
                els[className].public[propertyName]= {
                    name: propertyName,
                    type: 'String',
                    value: ''
                }
            }
        }
    }

    for(var j in els) {
        els[j].defined=true;
    }

    return els;
})();