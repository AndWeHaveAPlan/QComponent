/**
 * Created by zibx on 17.08.16.
 */
module.exports = (function(){
    'use strict';
    /*
    Ok, lets reinvent the Event Manager!
    What do we need from it?
    First of all - we need a single point of catching and processing of events.
    Catching is for logging\user behaviour analysis\debugging\recording unit tests.
    Processing is for security (Event manager can be placed on server), running unit tests.

    So, lets design.


  KEYBOARD AND ANY BUTTONS:

    Active Element (keyboard) <- tab mixture
          | if not used
          v
    Shortcut manager
          | if not used
          v
    Parent element <- tab mixture (if custom tab behavior)
          |
          v
         ... till parent is null

  -------------------------------------

  MOUSE (mousedown, scroll, over):

    Undermouse Element
          |
          v
    Parent element <- tab mixture (if custom tab behavior)
          |
          v
         ... till parent is null


  MOUSE (mouseup, mousemove, leave):

    Mousedown\over[] captured Element
         |
         v
    Parent element <- tab mixture (if custom tab behavior)
         |
         v
        ... till parent is null

  -------------------------------------

  So. We can do it in the way of honor, but it would be slow.
  

     */

    var Keyboard = require('../Common/UI/Keyboard'),
        QObject = require('../QObject'),
        DOM = require('../Common/UI/DOMTools'),
        pressCountCounter = 0,
        systemKeys = QObject.arrayToObject([ // keycodes that should be passed through down event
            5, 6, 8, 8, 9, 12, 13, 16, 16, 17,
            17, 19, 20, 27, 27, 33, 34, 35, 36, 37, 38,
            39, 40, 45, 46, 63, 91, 93, 112, 113,
            114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            144, 144, 145, 63272, 63275
        ]),
        fireEvents = function( catcher, code, e, type ){
            var events, i, _i;
            if (events = [].concat(catcher.listeners[code] || [], catcher.listeners[-1] || [])) {
                for( i = 0, _i = events.length; i < _i; i++ ){
                    events[ i ].call( this, e, pressCountCounter, Math.floor( Math.sqrt(pressCountCounter) ), type );
                }
            }
        };
    var UIEventManager = function(){
        this._catchers = [{scope: {}, listeners: {'-1': [function(){
            console.log(arguments);
            //debugger;
        }
        ]}}];
    };
    UIEventManager.prototype = {
        _kbWrappers: {
            down: function( e ){
                pressCountCounter++;
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                var code = String.fromCharCode( e.which || e.keyCode ).toLowerCase().charCodeAt(0);
                ( code in systemKeys ) && fireEvents.call( catcher.scope, catcher, code, e, 'down' );
            },
            up: function( e ){
                pressCountCounter = 0;
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                var code = String.fromCharCode( e.which || e.keyCode ).toLowerCase().charCodeAt(0);
                ( code in systemKeys ) && fireEvents.call( catcher.scope, catcher, code, e, 'up' );
            },
            press: function( e ){
                pressCountCounter++;
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                var code = String.fromCharCode(e.which || e.keyCode).toLowerCase().charCodeAt(0);
                fireEvents.call( catcher.scope, catcher, code, e, 'press' );
            }
        },
        _mouseWrappers: {
            move: function (e) {
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                fireEvents.call( catcher.scope, catcher, code, e, 'press' );
            }
        },
        _attach: function () {
            for( var event in this._kbWrappers )
                if( this._kbWrappers.hasOwnProperty( event ) )
                    DOM.addListener(QObject.document, 'key' + event, this._kbWrappers[event].bind(this) );
        }
    };
    var manager = new UIEventManager();
    DOM.load(manager._attach.bind(manager));
    return manager;
})();