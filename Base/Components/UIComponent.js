/**
 * Created by zibx on 01.07.16.
 */
module.exports = (function(){
    'use strict';
    var Abstract = require('./AbstractComponent'),
        observable = require( 'z-observable' ),
        ObservableSequence = require('observable-sequence' ),

        Factory = new require( './Factory' );

    var UIComponent = Abstract.extend('UIComponent', {
        on: observable.prototype.on,
        fire: observable.prototype.fire,
        _factory: new Factory(),
        itemsSubscribe: function(  ){
            var _self = this;
            this._children.on('add', function(el){

                if(el === void 0)debugger;
                el.parent = _self;
                _self.addToTree(el);
                // best place to insert to dom.
            } );
            this._children.on('remove', function( el ){
                el.parent = null;
                _self.removeFromTree(el);
            });
        },
        _initChildren: function(){


            var iterator = new ObservableSequence( this.items || [] ).iterator(), item, ctor, type, cmp,
                items = this.items = new ObservableSequence( [] );

            this.itemsSubscribe();
            this.preInit && this.preInit();

            while( item = iterator.next() ){
                if( typeof item === 'function' )
                    ctor = item;
                else if( typeof item === 'object' )
                    ctor = item.item;
                else{
                    ctor = item;
                    item = { _type: ctor };
                }

                item.parent = this;

                if( (type = typeof ctor) === 'function' ){
                    cmp = (ctor._factory || this._factory).build( ctor, item, iterator );
                }else if( type === 'string' ){
                    cmp = this._factory.build( ctor, item, iterator );
                }
                this.addChild( cmp );

            }


        }
    }, function( cfg ){
        Abstract.call(this, cfg);
        observable.prototype._init.call(this);
        this.createEl();
        !this.leaf && this._initChildren();
    });

    return UIComponent;
})();