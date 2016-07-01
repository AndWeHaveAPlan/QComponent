/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var Component = require("./Component");
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
        var componentPipes = self._registredPipes[sender.cname];
        if (componentPipes) {
            var propertyPipes = componentPipes[name];
            if (propertyPipes) {
                for (var i = 0; i < propertyPipes.length; i++) {
                    var currentPipe = propertyPipes[i];

                    var targetComponentName = currentPipe.targetComponent;
                    var targetProperty = currentPipe.targetPropertyName;

                    var targetComponent = self._registredComponents[targetComponentName];
                    if (targetComponent) {

                        currentPipe.process(newValue, targetComponent);
                    }
                }
            }
        }
    }
};

/**
 *
 * @param componentName String
 * @param component Component
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
    var registeredPipes = this._registredPipes;

    var sourceComponent = source.component;
    var sourcePropertyName = source.property;

    var sourceComponentPipe =
        registeredPipes[sourceComponent] ?
            registeredPipes[sourceComponent] :
            registeredPipes[sourceComponent] = {};

    (sourceComponentPipe[sourcePropertyName] ?
        sourceComponentPipe[sourcePropertyName] :
        sourceComponentPipe[sourcePropertyName] = []).push(newPipe);

    return newPipe;
};

/**
 *
 * @param pipe Pipe
 */
EventManager.prototype.registerPipe = function (pipe) {
    var sourceComponentPipe =
        this._registredPipes[pipe.sourceComponent] ?
            this._registredPipes[pipe.sourceComponent] :
            this._registredPipes[pipe.sourceComponent] = {};

    (sourceComponentPipe[pipe.sourcePropertyName] ?
        sourceComponentPipe[pipe.sourcePropertyName] :
        sourceComponentPipe[pipe.sourcePropertyName] = []).push(pipe);
};

module.exports = EventManager;