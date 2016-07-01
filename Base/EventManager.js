/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var Component = require("./Components/AbstractComponent");
var FiltratingPipe = require("./Pipes/FiltratingPipe");
var SimplePipe = require("./Pipes/SimplePipe");

/**
 *
 * @constructor
 */
function EventManager() {
    this._registredComponents = {};
    this._registredPipes = {};
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
        var propertyPipes = self._registredPipes[key];

        if (!propertyPipes) return;

        for (var i = 0; i < propertyPipes.length; i++) {
            var currentPipe = propertyPipes[i];

            var targetComponentName = currentPipe.targetComponent;

            var targetComponent = self._registredComponents[targetComponentName];
            if (targetComponent) {
                currentPipe.process(key, newValue, targetComponent);
            }
        }
    }
};

/**
 *
 * @param componentName String
 * @param component AbstractComponent
 */
EventManager.prototype.registerComponent = function (componentName, component) {
    this._registredComponents[componentName] = component;
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

    var bindingSources = pipe.sourceBindings;
    var length = bindingSources.length;
    var component

    for (var source in bindingSources) {
        if (bindingSources.hasOwnProperty(source)) {

            var currentSource = bindingSources[source];

            component = this._registredComponents[currentSource.componentName];
            currentSource.value = component ? component.get(currentSource.propertyName) : void(0);

            var pipes = this._registredPipes[currentSource.key];
            pipes ? pipes.push(pipe) : this._registredPipes[currentSource.key] = [pipe];
        }
    }

    component = this._registredComponents[pipe.targetComponent];
    if (component)
        pipe.process(null, null, component);
};

module.exports = EventManager;