/**
 * Created by zibx on 18.08.16.
 */
module.exports = (function () {
    'use strict';
    var QObject = require('../QObject'),
        Property = require('../Property'),
        DOMTools = require('../Common/UI/DOMTools'),
        Keyboard = require('../Common/UI/Keyboard'),
        UIEventManager = require('../Common/UIEventManager'),
        console = QObject.console('focusable'),
        tabCycle = require('./tabCycle');
    QObject.logging('focusable');

    QObject.mixin('focusable', {
        focusable: true,
        _init: function(){

            return;
            var item,
                tabIndex = this.get('tabIndex')|0, i;

            for(i = list.length - 1; i >= 0; i--){
                item = list[i];
                if((item.get('tabIndex')|0) <= tabIndex)
                    break;
            }
            i++;
            list.splice(i,0,this);
            this.on('tab', function (direction) {
                var i = list.indexOf(this),
                    next = ((i + direction)+list.length) % list.length;
                console.log('tab from', this.id);
                console.log('call focus on', list[next].id);
                list[next].focus();

            });
            this.on('focus', function (direction) {
                console.log('focused', this.id);
            });
            console.log(list.map(QObject.getProperty('id')));
        },
        blur: function () {
            if( !this._data.focused || this.fire('tryBlur') === false )
                return false;

            this.set('focused', false);


            this.fire('blur');

            this._unbindListeners();
            if( this.focusValue !== this.value )
                this.fire( 'changed', this.get('value') );

            return true;
        },
        focus: function (direction) {
            if (this.fire('tryFocus') === false || (this.disabled === true || this.enabled === false) )
                return false;

            if (!this._data.focused)
                this.focusValue = this.get('value');
            this.set('focused', true);
            this._bindListeners();
            this.innerFocus();
            this.fire('focus');

            return direction;
        },
        innerFocus: function(  ){
            if( this.createBlurElement ){
                this._createBlurElement();
                this.blurEl && this.blurEl.focus();//setTimeout( JS.bind(this.blurEl, 'focus'),10);
            }
        },
        innerBlur: function(  ){
            this.blur();
            this.innerFocus();
        },
        destroy: function () {
            this._unbindListeners();
        },
        _bindListeners: function () {
            var blurFn = this.blur.bind(this);
            this.listen = {
                windowBlur: DOMTools.addRemovableListener(window, 'blur', blurFn),
                windowClick: DOMTools.addRemovableListener(document, 'click', blurFn),
                layer: UIEventManager.getLayer({owner: this}),
            };

            this.listen.keyboard = new Keyboard(this.listen.layer);
            this.listen.keyboard.on({
                'escape': function (e) {
                    if( this.fire('escapeKey', e) !== false ){
                        if (!this.focused) throw '!!! this was not designed';

                        this.changeValue(this.focusValue);
                        if( this.enterBlur )
                            this.innerBlur();
                        else
                            this.blur();

                        e.preventDefault();
                        e.stopPropagation();
                    }
                },
                'enter': function( e ){
                    if( this.fire('enterKey', e) !== false )
                        this.enterBlur && this.innerBlur();
                },
                'space': function( e ){
                    this.fire('spaceKey', e);
                }
            });
            if( this.get('autoTab') || true ){ // TODO: remove after debug
                this.listen.keyboard.on({
                    'tab': function(e){
                        this.blur();
                        this.fire( 'tab', e.shiftKey ? -1 : 1 );
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
            }
        },
        _unbindListeners: function () {
            var listen = this[ arguments[0] || 'listen' ];

            if (listen) {
                QObject.each(listen, function() {
                    if (this && typeof this.remove == "function")
                        this.remove();
                    else if (typeof this === 'function')
                        this();
                });
            }
        },
        _createBlurElement: function(  ){
            var recreate;
            // maybe we are out of dom
            if(
                (!this._blurElementCreated && this.renderTo && js.util.Dom.elementInDocument(this.renderTo)) ||
                (this._blurElementCreated && (recreate = !js.util.Dom.elementInDocument(this.blurEl))) // maybe the form was deleted, but field was moved to document. Strange case
            ){
                this._blurElementCreated = true;
                if (recreate && this.blurEl && this.blurEl.parentNode)
                    this.blurEl.parentNode.removeChild(this.blurEl);

                this.blurEl = document.createElement('input');
                $(this.blurEl).addClass("blur-input");

                js.util.Dom.addListener(this.blurEl, 'click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                this.renderTo.parentNode.appendChild( this.blurEl );
                js.util.Dom.addListener(this.blurEl,'keydown', function(e){
                    var code = js.util.Keyboard.getCode(e);
                    if( code === js.util.Dom.keyCode.tab ){
                        this.fire('tab', e.shiftKey ? -1 : 1 );
                    }else if( code === js.util.Dom.keyCode.enter || code === js.util.Dom.keyCode.space ){

                        this.fire((code === js.util.Dom.keyCode.enter ? 'enter' : 'space') + 'Key', e);
                        this.blurEl.blur();
                        this.focus( void 0 );
                    }else{
                        return true;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }.bind( this ));
            }
        },
        _prop: {
            blurOnEnter: new Property('Boolean', {description: 'input would be blured on pressing enter key'},{},true),
            createBlurElement: new Property('Boolean', {description: ''},{},true),
            autoTab: new Property('Boolean', {description: 'default tab behaviour'},{},true),
            focused: new Property('Boolean', {description: 'focus flag'},{},false),
            tabIndex: new Property('Number', {description: 'priority of element in tab queue'},{},0)
        }
    });
})();
