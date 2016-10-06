/**
 * Created by zibx on 17.08.16.
 */

var UIComponent = require('../../UIComponent');
var Property = require('../../../Property');


var BaseInput = UIComponent.extend('BaseInput', {
    mixin: 'focusable'
});

var TestInput = BaseInput.extend('TestInput', {
    createEl: function () {
        var _self = this,
            el = this.el = UIComponent.document.createElement('input'),
            fn = function(){
                _self.set('value', el.value);
            },
            changeFn = function () {
                setTimeout(fn, 0);
            };
        
        //this.focus();
        this.el.addEventListener('mousedown', function(e){
            _self.focus();
            //e.preventDefault();
            e.stopPropagation();
        });
        this.el.addEventListener('click', function(e){
            //e.preventDefault();
            e.stopPropagation();
        });
        'change,mouseup,keydown,keypress,keyup,dragend,drop,dragexit'.split(',').forEach(function(eventName){
            el.addEventListener(eventName, changeFn);
        });
        
        
        //this.el.value = this.get('value');
    },
    innerFocus: function () {
        this.el.focus();
    },
    _prop: {
        value: Property.generate.attributeProperty('value')        
    }
});

module.exports = BaseInput;