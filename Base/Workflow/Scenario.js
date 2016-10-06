/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('../QObject'),
    Sequence = require('./Sequence'),
    Selector = require('./Selector'),
    AbstractComponent = require('../Components/AbstractComponent'),
    UIComponent = require('../Components/UIComponent'),
    Property = require('../Property');

var Scenario = UIComponent.extend('Scenario', {
    _prop: {
        value: new Property('Scenario', {},
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
    load: function (parent) {
        if (!parent) {
            QObject.document.body.innerHTML = '';
            QObject.document.body.appendChild(this.el);
        }
        if (!this._loaded) {
            this._currentSequence = this.sequences[this._sequenceCursor].fromStart();
            this._loaded = true;
            this.next();
        }
    },
    next: function () {
        var sequence = this._currentSequence;
        if (sequence.canGoNext()) {
            var sel = sequence.next();
            if (sel instanceof Selector) {

                if (!sel.get('value'))
                    return this.next();

                var p;
                if (this._nestedCache[sel.id]) {
                    var p = this._nestedCache[sel.id]
                    this._setScene(p, true);
                } else {
                    p = new (sel.get('scene'))();
                    this._setScene(p, false);
                }

                if (p instanceof Scenario) {
                    this._nestedCache[sel.id] = p;
                }
            } else {
                console.log('not selector');
            }
        } else {
            if (this._sequenceCursor < this.sequences.length - 1) {
                this._sequenceCursor += 1;
                this._currentSequence = this.sequences[this._sequenceCursor].fromStart();
                this.next();
            } else {
                this.fire('next');
            }
        }
    },
    back: function () {
        var sequence = this._currentSequence;
        if (sequence.canGoBack()) {

            var sel = sequence.back();
            if (sel instanceof Selector) {

                if (!sel.get('value'))
                    return this.back();

                var p;
                if (this._nestedCache[sel.id]) {
                    var p = this._nestedCache[sel.id]
                    this._setScene(p, true);
                } else {
                    p = new (sel.get('scene'))();
                    this._setScene(p, false);
                }

                if (p instanceof Scenario) {
                    this._nestedCache[sel.id] = p;
                }

            } else {
                console.log('not selector');
            }
        } else {
            if (this._sequenceCursor > 0) {
                this._sequenceCursor -= 1;
                this._currentSequence = this.sequences[this._sequenceCursor].fromEnd();
                this.back();
            } else {
                this.fire('back');
            }
        }
    },
    _setScene: function (scene, fromCache) {
        var self = this;
        scene.set('dataContext', this.dataContext);

        if (!fromCache) {
            scene.on('next', function () {
                var pValue = scene.get('dataContext');
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

            scene.on('back', function () {
                self.back();
            });
        }

        this.el.innerHTML = '';
        this.el.appendChild(scene.el);
        scene.load(this);
    }
}, function (cfg) {
    cfg = cfg || {};
    cfg.width = cfg.width || '100%';
    cfg.height = cfg.height || '100%';

    var self = this;

    UIComponent.call(this, cfg);
    this.sequences = [];
    this.dataContext = {};
    this._sequenceCursor = 0;
    this._loaded = false;

    this._nestedCache = {};

    this._ownComponents.on('add', function (child) {
        if (child instanceof Sequence)
            self.sequences.push(child);
    });
});

module.exports = Scenario;
