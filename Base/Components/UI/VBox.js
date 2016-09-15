/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var FlexSizeComponent = require('./FlexSizeComponent');

module.exports = FlexSizeComponent.extend('VBox', {
    updateLayout: function () {
        var self = this;
        var children = this.el.childNodes;
        var fDef = this._flexDefinition || { parts: [], starCount: 0, flexLength: 0, fixLength: 0 };
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(function () {
            var freePixelHeight = self.el.clientHeight,
                flexHeights = 0,
                pixelHeights = 0,
                height,
                i, length, fPart;

            for (i = 0, length = children.length; i < length; i++) {
                fPart = fDef.parts[i < fDef.parts.length ? i : fDef.parts.length - 1];
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        flexHeights += fPart.part;
                    if (!fPart.flex) { // 25
                        pixelHeights += fPart.part;
                    }
                } else {
                    flexHeights += 1;
                }
            }
            for (i = 0, length = children.length; i < length; i++) {
                fPart = fDef.parts[i < fDef.parts.length ? i : fDef.parts.length - 1];
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        height = (freePixelHeight - pixelHeights) / flexHeights * fPart.part + 'px';
                    if (!fPart.flex) { // 25
                        height = fPart.part + 'px';
                    }
                } else {
                    height = (freePixelHeight - pixelHeights) / flexHeights + 'px';
                }
                children[i].style.height = height;
            }
        }, 0);
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        div.el.style.position = 'relative';
        div.el.style.height = '100%';
        div.el.style.overflow = 'hidden';
    }
});