/**
 * Created by zibx on 17.08.16.
 */

var UIComponent = require('../../UIComponent');
var Property = require('../../../Property');


module.exports = UIComponent.extend('BaseInput', {
    
    _prop: {
        blurOnEnter: new Property('Boolean', {description: 'input would be blured on pressing enter key'},{},true),
        createBlurElement: new Property('Boolean', {description: 'input would be blured on pressing enter key'},{},true),
        checked: Property.generate.attributeProperty('checked'),
        value: new Property('String', {},{overrideKey: 'checked'})
    },
    simlink: {

    }
});