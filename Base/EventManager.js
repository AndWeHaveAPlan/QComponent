/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var Component = require("./Components/AbstractComponent");

/**
 * TODO Что то надо с этим делать :(
 * Пока кладется "статиком" в Component
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
EventManager.prototype.getOnValueChangedEventListener = function(){
    var self = this;

    return function (sender, name, newValue, OldValue) {
        var componentPipes = self._registredPipes[sender.id];
        if (componentPipes) {
            var propertyPipes = componentPipes[name];
            if (propertyPipes) {
                for (var i = 0; i < propertyPipes.length; i++) {
                    var currentPipe = propertyPipes[i];

                    var targetComponentName = currentPipe.targetComponent;
                    var targetProperty = currentPipe.targetPropertyName;

                    var targetComponent = self._registredComponents[targetComponentName];
                    if (targetComponent)
                        targetComponent.set(targetProperty, newValue);
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