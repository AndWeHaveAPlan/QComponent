/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('../QObject'),
    Sequence = require('./Sequence'),
    Selector = require('./Selector'),
    AbstractComponent = require('../Components/AbstractComponent'),
    Property = require('../Property');

var Scenario = AbstractComponent.extend('Scenario', {
    _prop: {
        value: new Property('Scenario', {},
            {
                get: Property.defaultGetter,
                set: Property.defaultSetter
            }, null),
        currentPage: new Property('Page', {},
            {
                get: Property.defaultGetter,
                set: Property.defaultSetter
            }, null)
    },
    load: function () {
        this.next();
    },
    next: function () {
        var sequence = (this.sequences[0]);
        if (sequence.canGoNext()) {
            var sel = sequence.next();
            if (sel instanceof Selector) {

                if (!sel.get('value'))
                    return this.next();

                var p = new (sel.get('page'))();
                this._setPage(p);
            } else {
                console.log('not selector');
            }
        }
    },
    back: function () {
        var sequence = (this.sequences[0]);
        if (sequence.canGoBack()) {
            var sel = sequence.back();
            if (sel instanceof Selector) {

                if (!sel.get('value'))
                    return this.back();

                var p = new (sel.get('page'))();
                this._setPage(p);
            } else {
                console.log('not selector');
            }
        }
    },
    _setPage: function (page) {
        page.set('scenario', this);
        this.set('currentPage', page);
        QObject.document.body.innerHTML = '';
        QObject.document.body.appendChild(page.el);

        //p.on('finish', this.processSequence(sequence));
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