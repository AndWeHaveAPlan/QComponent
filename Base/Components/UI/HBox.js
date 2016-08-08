/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');

module.exports = UIComponent.extend('HBox', {
    updateLayout: function () {
        var self = this;
        var children = this.el.childNodes;
        var count = children.length;
        var fDef = this._flexDefinition || {parts: [], starCount: 0, flexLength: 0, fixLength: 0};

        setTimeout(function () {
            var freeWidth = 100 - 100 * (fDef.fixLength / self.el.clientWidth);

            for (var i = 0, length = children.length; i < length; i++) {
                var fPart = fDef.parts[i];
                var width = freeWidth / (fDef.starCount > 0 ? fDef.starCount : 1) + '%';
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        width = freeWidth * (fPart.part / fDef.flexLength) + '%';
                    if (!fPart.flex) { // 25
                        width = fPart.part + 'px';
                    }
                }

                children[i].style.width = width;
            }
        }, 0);
    },
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    },
    _prop: {
        flexDefinition: new Property('String', {description: ""}, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this._flexDefinition = {parts: [], starCount: 0, flexLength: 0, fixLength:0};
                var fDef = this._flexDefinition;
                var parts = this._data['flexDefinition'].split(' ');

                for (var i = 0; i < parts.length; i++) {
                    var fPart = parts[i];
                    var flex = false;
                    if (fPart[fPart.length - 1] === '*') {
                        flex = true;
                        fPart = fPart.substring(0, fPart.length - 1);
                    }

                    var parsedFloat = parseFloat(fPart);
                    if (fPart.length === 0) {
                        fDef.starCount += 1;
                        fDef.parts.push({flex: flex, part: 0})
                    } else if (parsedFloat == fPart) {
                        fDef.parts.push({flex: flex, part: parsedFloat});
                        if (flex)
                            fDef.flexLength += parsedFloat;
                        else
                            fDef.fixLength += parsedFloat;
                    }
                }

                this.updateLayout();
            }
        }, '*')
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        div.el.style.float = 'left';
        div.el.style.position = 'relative';
        div.el.style.height = '100%';

        this.updateLayout();
    }
});