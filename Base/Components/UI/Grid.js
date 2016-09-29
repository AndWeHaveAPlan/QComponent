/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');

var propNames = ['width', 'height', 'top', 'left'];

module.exports = UIComponent.extend('Grid', {
    _createEl: function () {
        UIComponent.prototype._createEl.apply(this, arguments);
        var self = this;
        this.el.addEventListener('resize', function () {
            self.updateLayout();
        });
    },
    updateLayout: function () {
        UIComponent.prototype.updateLayout.call(this);
    },
    addChild: function (child) {
        var self = this;
        this._calcChild(child);
        child.subscribe(function (sender, names, value, oldValue) {
            var name = names.splice(-1)[0];
            if (propNames.indexOf(name) === -1) return;
            if (self._cache[child.id + name] !== value) {
                self._calcChild(child);
            }
        });

        UIComponent.prototype.addChild.call(this, child);
    },
    _calcChild: function (cmp) {
        var rows = this._data.rows;
        var cols = this._data.columns;

        var selfWidth = this.el.clientWidth;
        var selfHeight = this.el.clientHeight;

        var width = cmp.get('width');
        var height = cmp.get('height');
        var top = cmp.get('top') || 0;
        var left = cmp.get('left') || 0;

        this._setToComponent(cmp, 'position', 'absolute');
        this._setToComponent(cmp, 'left', ((100 / cols) * left) + '%');
        this._setToComponent(cmp, 'width', ((100 / cols) * width) + '%');
        this._setToComponent(cmp, 'top', ((100 / rows) * top) + '%');
        this._setToComponent(cmp, 'height', ((100 / rows) * height) + '%');
    },
    _setToComponent: function (cmp, pName, pValue) {
        cmp.set(pName, pValue);
        this._cache[cmp.id + pName] = pValue;
    },
    _prop: {
        rows: new Property('Number', { defaultValue: 1 }),
        columns: new Property('Number', { defaultValue: 1 }),
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);
        this._cache = {};
    });