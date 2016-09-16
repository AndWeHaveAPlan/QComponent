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
  Lets construct a prototype chain for all events.
  It would be stack.
  New item would be based on old one with new function in proper positions.

     */
    var ListeningLayer = function (cfg) {
        var oldOne = stack[stack.length-1] || {};
        var newOne = function(){};
        newOne.prototype = oldOne;
        newOne = QObject.apply(new newOne(), cfg);
        stack.push(newOne);
        currentLayer = newOne;
        return newOne;
    };
    ListeningLayer.prototype = {
        stack: [],
        demolish: function(){
            stack.pop();
            currentLayer = stack[stack.length - 1] || {};
        }
    };
    var stack = ListeningLayer.stack = ListeningLayer.prototype.stack,
        currentLayer = {
            keyup: function(e){
                console.log(e);
            },
            mouseup: function(e){
                console.log('mouse', e);
            },
            mousemove: function(e){
                //console.log('mouse', e);
            }
        };


    var Keyboard = require('../Common/UI/Keyboard'),
        QObject = require('../QObject'),
        DOM = require('../Common/UI/DOMTools'),
        systemKeys = QObject.arrayToObject([ // keycodes that should be passed through down event
            5, 6, 8, 8, 9, 12, 13, 16, 16, 17,
            17, 19, 20, 27, 27, 33, 34, 35, 36, 37, 38,
            39, 40, 45, 46, 63, 91, 93, 112, 113,
            114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            144, 144, 145, 63272, 63275
        ]),
        fireEvent = function( name, e, pressCountCounter ){
            var listener = currentLayer[name];
            if(listener){
                return listener(e, name, pressCountCounter);
            }
        };
    var UIEventManager = function(){};
    UIEventManager.prototype = {
        /*_kbWrappers: {
            keydown: function( e ){
                pressCountCounter++;
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                var code = String.fromCharCode( e.which || e.keyCode ).toLowerCase().charCodeAt(0);
                ( code in systemKeys ) && fireEvents.call( catcher.scope, catcher, code, e, 'down' );
            },
            keyup: function( e ){
                pressCountCounter = 0;
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                var code = String.fromCharCode( e.which || e.keyCode ).toLowerCase().charCodeAt(0);
                ( code in systemKeys ) && fireEvents.call( catcher.scope, catcher, code, e, 'up' );
            },
            keypress: function( e ){
                pressCountCounter++;
                var catcher = this._catchers[0];
                if( !catcher ) return ;
                var code = String.fromCharCode(e.which || e.keyCode).toLowerCase().charCodeAt(0);
                fireEvents.call( catcher.scope, catcher, code, e, 'press' );
            }
        },
        _mouseWrappers: {
            mousemove: function (e) {
                return fireEvents( 'mousemove', e );
            },
            mousedown: function(e){

            }
        },*/
        _attach: function () {
            var mouse = ['move', 'down', 'up'].map(function(item){return 'mouse'+item}).concat('click', 'scroll'),
                keyboard = ['down', 'press', 'up'].map(function(item){return 'key'+item}),
                other = ['resize'],
                pressCountCounter = 0;
            mouse.forEach(function(eventName){
                DOM.addListener(QObject.document, eventName, function (e) {
                    return fireEvent(eventName, e);
                } );
            });
            keyboard.forEach(function(eventName){
                DOM.addListener(QObject.document, eventName, function (e) {
                    pressCountCounter++;
                    if(eventName==='keyup')
                        pressCountCounter = 0;
                    return fireEvent(eventName, e, pressCountCounter);
                } );
            });

        }
    };
    var manager = new UIEventManager();
    DOM.load(manager._attach.bind(manager));
    return manager;
})();