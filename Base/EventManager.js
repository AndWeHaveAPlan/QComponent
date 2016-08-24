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
    this.owner = owner;
}

EventManager.prototype = new QObject();

/**
 * Generates callback function
 *
 * @returns Function
 */
EventManager.prototype.getOnValueChangedEventListener = function () {
    var self = this;

    return function (sender, name, newValue, oldValue) {
        // TODO think about getting id through getter
        var key = sender.id + '.' + name;
        if (sender.id == self.owner.id)
            key = name;

        var propertyPipes = self._registredPipes[key];

        if (propertyPipes) {
            for (var i = 0; i < propertyPipes.length; i++) {
                var currentPipe = propertyPipes[i];

                var val = sender.get(currentPipe.sourceBindings[key].propertyName);
                if (key == sender.id + '.' + currentPipe.sourceBindings[key].propertyName)
                    val = newValue;

                var targetComponent = self._registredComponents[currentPipe.targetComponent];
                if (targetComponent) {
                    currentPipe.process(key, val, targetComponent);
                }
            }
        }

        /** Женя, посмотри на это. Скорее всего оно криво. */
        var main = self.owner.mainEventManager,
            owner = main && main.owner;
        if(owner && owner !== self.owner)
            owner._onPropertyChanged(owner, sender.id);
    }
};

/**
 *
 * @param component AbstractComponent
 */
EventManager.prototype.registerComponent = function (component) {
    this._registredComponents[component.id] = component;
    component.subscribe(this.getOnValueChangedEventListener());
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

module.exports = EventManager;