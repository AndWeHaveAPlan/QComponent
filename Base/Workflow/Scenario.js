/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('../QObject'),
    EventManager = require('../EventManager'),
    Page = require('../Components/UI/Page'),
    Property = require('../Property');

var Scenario = QObject.extend('Scenario', {
    load: function(entryPoint){
        Scenario.currentScenario=this;

        /**
         *
         */
    }
}, function (cfg) {
    QObject.call(this, cfg);
});

module.exports = Scenario;