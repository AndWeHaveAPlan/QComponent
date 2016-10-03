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
            }, null),
        next: new Property('Function'),
        back: new Property('Function'),
        dataContext: new Property('Variant')
    },
    _afterInit: function () {
        AbstractComponent.prototype._afterInit.call(this);
        for (var prop in this._prop) {
            if (this._prop.hasOwnProperty(prop))
                this.dataContext[prop] = this._data[prop];
        }
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
        var self = this;
        page.set('scenario', this);
        page.set('dataContext', this.dataContext);
        this.set('currentPage', page);

        page.on('next', function () {
            var pValue = page.get('dataContext');
            if (pValue) {
                for (var key in pValue) {
                    if (pValue.hasOwnProperty(key)) {
                        self.set(key, pValue[key]);
                        self.dataContext[key] = pValue[key];
                    }
                }
            }
            self.next();
        });

        page.on('back', function () {
            self.back();
        });

        QObject.document.body.innerHTML = '';
        QObject.document.body.appendChild(page.el);
    }
}, function (cfg) {
    var self = this;
    AbstractComponent.call(this, cfg);
    this.sequences = [];
    this.dataContext = {};

    this._ownComponents.on('add', function (child) {
        if (child instanceof Sequence)
            self.sequences.push(child);
    });
});

module.exports = Scenario;