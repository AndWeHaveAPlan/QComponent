/**
 * Created by zibx on 08.07.16.
 */
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
        },
        i;


    ('a,b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
    'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
    'input,label,li,ol,option,p,pre,span,sub,sup,' +
    'table,tbody,td,textarea,th,thead,tr,u,ul,header').split(',').forEach(function (name) {
        els[name] = {
            argumentParser: function (bonus, item) {
                var splitted = tools.split(item.items, ':', 2),
                    subTokens = tools.split(splitted[0], ' ', 2);

                return {
                    cls: tools.detox(tools.trim(subTokens[0]), true),
                    name: tools.detox(tools.trim(subTokens[1])),
                    value: tools.detox(tools.trim(splitted[1]), true)
                };
            }
        };
    });
    for (i in els)
        els[i].defined = true;

    els.input.public = {
        type: {name: 'type', type: 'String', value: 'Text'},
        checked: {name: 'checked', type: 'String', value: void 0},
        value: {name: 'value', type: 'String', value: ''}
    };

    return els;
})();