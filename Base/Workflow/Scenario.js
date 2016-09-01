/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('../QObject'),
    Sequence = require('./Sequence'),
    Selector = require('./Selector'),
    AbstractComponent = require('../Components/AbstractComponent');

var Scenario = AbstractComponent.extend('Scenario', {
    load: function () {
        Scenario.currentScenario = this;

        this.processSequence(this.sequences[0]);
    },
    next: function () {
        this.processSequence(this.sequences[0]);
    },
    processSequence: function (sequence) {
        if (sequence.canGoNext()) {
            var sel = sequence.next();
            if (sel instanceof Selector) {
                var p = new (sel.get('page'))();
                p.set('scenario', this);
                QObject.document.body = p.el;
            } else {
                console.log('not selector');
            }
        }
    }
}, function (cfg) {
    var self = this;
    AbstractComponent.call(this, cfg);
    this.sequences = [];

    this._ownComponents.on('add', function (child) {
        if (child instanceof Sequence)
            self.sequences.push(child);
    });
});

module.exports = Scenario;