/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var Component = require("./Components/AbstractComponent");
var SimplePipe = require("./Pipes/SimplePipe");

/**
 *
 * @constructor
 */
function EventManager(owner) {
    this._registredComponents = {};
    this._registredPipes = {};
    this._tempPipes = [];
    this._listeners = {};
    this.owner = owner;
}

EventManager.prototype = new QObject();

/**
 * Generates callback function
 *
 * @returns Function
 */
EventManager.prototype.getOnValueChangedEventListener = function (sender, name, newValue, oldValue) {
    // TODO think about getting id through getter
    var key = sender.id + '.' + name, i, _i,
        sid = sender.id;
    if (sender.id == this.owner.id)
        key = name;

    var listeners = this._listeners[sid];

    if(listeners) {
        listeners = listeners.deeper[name];
        if(listeners)
            for (i = 0, _i = listeners.length; i < _i; i++) {

                listeners[i].call(this, sid, newValue);
            }
    }
    var propertyPipes = this._registredPipes[key];

    if (propertyPipes) {
        for (var i = 0; i < propertyPipes.length; i++) {
            var currentPipe = propertyPipes[i];

            var val = sender.get(currentPipe.sourceBindings[key].propertyName);
            if (key == sender.id + '.' + currentPipe.sourceBindings[key].propertyName)
                val = newValue;

            var targetComponent = this._registredComponents[currentPipe.targetComponent];
            if (targetComponent) {
                currentPipe.process(key, val, targetComponent);
            }
        }
    }

    /** Женя, посмотри на это. Скорее всего оно криво. */
    /*var main = this.owner.mainEventManager,
        owner = main && main.owner;
    if (owner && owner !== this.owner)
        owner._onPropertyChanged(owner, sender.id);*/
};

/**
 *
 * @param component AbstractComponent
 */
EventManager.prototype.registerComponent = function (component) {
    this._registredComponents[component.id] = component;
    component.subscribe(this.getOnValueChangedEventListener.bind(this));
};

/**
 *
 * @param source
 * @param target
 */
EventManager.prototype.createSimplePipe = function (source, target) {

    var newPipe = new SimplePipe(source, target);

    this.registerPipe(newPipe);

    return newPipe;
};

/**
 *
 * @param pipe Pipe
 */
EventManager.prototype.registerPipe = function (pipe) {
    if (this._tempPipes)
        this._tempPipes.push(pipe);
    else
        this._release(pipe);
};

EventManager.prototype._release = function (pipe) {
    var bindingSources = pipe.sourceBindings;
    var component;

    for (var source in bindingSources) {
        if (bindingSources.hasOwnProperty(source)) {

            var currentSource = bindingSources[source];
            var componentName = currentSource.componentName || this.owner.id;
            component = this._registredComponents[componentName];
            currentSource.value = component ? component.get(currentSource.propertyName) : void(0);

            var pipes = this._registredPipes[currentSource.key];
            pipes ? pipes.push(pipe) : this._registredPipes[currentSource.key] = [pipe];
        }
    }

    component = this._registredComponents[pipe.targetComponent];
    if (component)
        pipe.process(null, null, component);
};

/**
 *
 */
EventManager.prototype.releaseThePipes = function () {

    for (var i = 0; i < this._tempPipes.length; i++) {
        var pipe = this._tempPipes[i];
        this._release(pipe);
    }

    delete this._tempPipes;
};


EventManager.prototype.s = function(key, val){
    var who = key[0], what = key[1];

    var cmp = this._registredComponents[ who === 'main'?this.owner.id:who];
    cmp && cmp.set(what, val);

};
var P = function(){};
P.prototype = {
    i: 0,
    needProcess: false,
    after: function(fn){
        this._done = fn;
        if(this.needProcess)
            this.done.apply(this, this.needProcess);

    },
    done: function(){
        if(this._done) {
            this._done.apply(this, arguments);
            this.needProcess = false;
        } else {
            this.needProcess = arguments;
        }
    }
};
/**
 * tiny promise
 */
EventManager.prototype.p = function(args, fn){
    var vals = [], i, _i,
        lastValue, firstCall = true,
        res = new P(),
        callFn = function () {
            var out = fn.apply(this, vals);
            if(firstCall || lastValue !== out){
                res.done(out, lastValue);
                lastValue = out; firstCall = false;
            }
        },
        wrap = function (name, i) {  
            var lastValue, firstCall = true;
            return function (key, val) {
                if(firstCall || lastValue !== val){
                    vals[i] = val;
                    callFn();
                    lastValue = val; firstCall = false;
                }
            }
        },
        arg,
        pointer,
        filled = 0;
    for(i = 0, _i = args.length; i <_i;i++){
        arg = args[i];
        if ('after' in arg) {
            arg.i = i;
            arg.after(function (val) {
                vals[this.i] = val;
                callFn();
            })
        } else {
            var point = this._listeners[arg[0]] || (this._listeners[arg[0]] = {fns: [], deeper: {}});
            point = point.deeper[arg[1]] || (point.deeper[arg[1]] = []);
            //debugger;
            point.push(wrap(arg, i));

            pointer = this._registredComponents[arg[0]];
            if(pointer) {
                vals[i] = pointer.get(arg[1]);
                filled++;
            }
        }
    }
    if(filled === _i)
        callFn();
    return res;
};

module.exports = EventManager;