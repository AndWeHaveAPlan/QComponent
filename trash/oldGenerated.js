<html><head><meta charset="utf-8"><script>module = {};</script><link rel="stylesheet" type="text/css" href="qstyle.css"><script src="bundle.js"></script><script>console.log("INIT");QObject = Base.QObject; Q = (function(){'use strict';
    var _known = QObject._knownComponents,
        cls,
        out = {},
        UIComponent = _known['UIComponent'];

    var Button = out['Button'] = UIComponent.extend('Button', {_prop: {value: new Base.Property("Variant")}}, function(){
        UIComponent.apply(this, arguments);
        var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;

        mutatingPipe = new Base.Pipes.MutatingPipe(
            ['i1.click'],
            {component: this.id, property: 'click'}
        );
        mutatingPipe.addMutator(function (i1click) {
            return i1click;
        });
        eventManager.registerPipe(mutatingPipe);
        this.set('disabled', '')
        mutatingPipe = new Base.Pipes.MutatingPipe(
            [self.id + '.value'],
            {component: this.id, property: 't'}
        );
        mutatingPipe.addMutator(function (value) {
            return value;
        });
        eventManager.registerPipe(mutatingPipe);

        tmp = (function(){
            eventManager.registerComponent(this);
            mutatingPipe = new Base.Pipes.MutatingPipe(
                [self.id + '.value'],
                {component: this.id, property: 'value'}
            );
            mutatingPipe.addMutator(function (value) {
                return value+'a';
            });
            eventManager.registerPipe(mutatingPipe);
            mutatingPipe = new Base.Pipes.MutatingPipe(
                [self.id + '.disabled'],
                {component: this.id, property: 'disabled'}
            );
            mutatingPipe.addMutator(function (disabled) {
                return disabled;
            });
            eventManager.registerPipe(mutatingPipe);
            this.set('type', 'button')
            this.set('width', '80')
            this.set('height', '30')
            parent._ownComponents.push(this);

            return this;
        }).call( new _known['input']({id: 'i'}) );

        this._init();
    });
    var main = out['main'] = UIComponent.extend('main', {_prop: {value: new Base.Property("Variant")}}, function(){
        UIComponent.apply(this, arguments);
        var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;


        tmp = (function(){
            eventManager.registerComponent(this);
            tmp = (function(parent){
                eventManager.registerComponent(this);
                this.set('value', 'text')
                this.set('t', '1')
                this._subscribeList = [];
                this._subscribe = function(){
                    this._subscribeList.push(this.removableOn('click', function(e){

                        console.log(e);
                        console.log('you clicked on button2');

                    }, this));
                };
                this._subscribe();
                parent.addChild(this);

                return this;
            }).call( new _known['Button']({id: 'b2'}), this );
            tmp = (function(parent){
                eventManager.registerComponent(this);
                this.set('value', 'bb')
                this._subscribeList = [];
                this._subscribe = function(){
                    this._subscribeList.push(this.removableOn('click,mouseup', function(em){
                        console.log(7)
                        console.log(16);
                    }, this));
                };
                this._subscribe();
                parent.addChild(this);

                return this;
            }).call( new _known['Button']({id: 'b1'}), this );
            parent._ownComponents.push(this);

            return this;
        }).call( new _known['div']({}) );

        this._init();
    });
    return out;
})();</script></head><body><script>var c=new Q.main();document.body.appendChild(c.el);</script></body></html>