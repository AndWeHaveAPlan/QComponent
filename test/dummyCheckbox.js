/**
 * Created by zibx on 14.07.16.
 */

/*
def UIComponent Checkbox
   public Boolean checked: {{value}}
   input i1
     type: checkbox
     checked: {{checked?'checked':void 0}}*/

var assert = require('chai').assert;
var Base = require('../Base'),
    UIComponent = Base.Component.UIComponent,


    Checkbox = UIComponent.extend('Checkbox', {}, function(cfg) {

        UIComponent.apply(this, arguments);
        var eventManager = this._eventManager;
        var i1 = new Base.Component.UI.Primitives.input();
        eventManager.registerComponent(i1.id, i1);

        i1.set('type', 'checkbox');

        
        var mutatingPipe = new Base.Pipes.MutatingPipe(
            this.id + '.checked',
            {component: i1.id, property: 'checked'}
        );
        mutatingPipe.addMutator(function (checked) {
            return checked ? 'checked' : void 0;
        });
        eventManager.registerPipe(mutatingPipe);

        this._ownComponents.push(i1);
        
        mutatingPipe = new Base.Pipes.MutatingPipe(
            this.id + '.value',
            {component: this.id, property: 'checked'}
        );
        mutatingPipe.addMutator(function (value) {
            //console.log('$',2)
            return value;
        });
        eventManager.registerPipe(mutatingPipe);

        this._init();
    });

/** +\- generated shit */
var QObject = require('../Base').QObject;
var _known = QObject._knownComponents,
    cls,
    UIComponent = _known['UIComponent'];

UIComponent.extend('checkbox', {}, function(){
    UIComponent.apply(this, arguments);
    var tmp, eventManager = this._eventManager, mutatingPipe,
        input = _known.input;

/* removed code */
    tmp = (function(tmp){
        eventManager.registerComponent(tmp.id, tmp);
        tmp.set('type', 'checkbox')
        mutatingPipe = new Base.Pipes.MutatingPipe(
            [this.id + '.checked'],
            {component: tmp.id, property: 'checked'}
        );
        mutatingPipe.addMutator(function (checked) {
            return checked?'checked':void 0;
        });
        eventManager.registerPipe(mutatingPipe);
        return tmp;
    }).call( this, new input({id: 'i1'}) );
    this._ownComponents.push(tmp);


    mutatingPipe = new Base.Pipes.MutatingPipe(
        [this.id + '.value'],
        {component: this.id, property: 'checked'}
    );
    mutatingPipe.addMutator(function (value) {
        return value;
    });
    eventManager.registerPipe(mutatingPipe);

    this._init();
});


describe('new component', function(){
    "use strict";
    var c1, c2;
    it('instantiate', function(){
        c1 = new Checkbox();
        c2 = new Checkbox();
        c1.set('value', true);
        assert.equal(c1.el.outerHTML, '<div><input type="checkbox" checked="checked"></div>');
        assert.equal(c1.get('checked'), true);
        //assert.equal(c2.get('checked'), false);
        assert.equal(c2.el.outerHTML, '<div><input type="checkbox"></div>');
    });

});

