/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var FlexSizeComponent = require('./FlexSizeComponent');

module.exports = FlexSizeComponent.extend('HBox', {
    updateLayout: function () {
        var self = this;
        var children = this.el.childNodes;
        var fDef = this._flexDefinition || {parts: [], starCount: 0, flexLength: 0, fixLength: 0};
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(function () {
            var freePixelWidth = self.el.clientWidth,
                flexWidths = 0,
                pixelWidths = 0,
                width,
                i, length, fPart;

            for (i = 0, length = children.length; i < length; i++) {
                fPart = fDef.parts[i < fDef.parts.length ? i : fDef.parts.length - 1];
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        flexWidths += fPart.part;
                    if (!fPart.flex) { // 25
                        pixelWidths += fPart.part;
                    }
                } else {
                    flexWidths += 1;
                }
            }
            for (i = 0, length = children.length; i < length; i++) {
                fPart = fDef.parts[i < fDef.parts.length ? i : fDef.parts.length - 1];
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        width = (freePixelWidth-pixelWidths)/flexWidths*fPart.part + 'px';
                    if (!fPart.flex) { // 25
                        width = fPart.part + 'px';
                    }
                } else {
                    width = (freePixelWidth-pixelWidths)/flexWidths + 'px';
                }
                children[i].style.width = width;
            }
        }, 0);
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        div.el.style.float = 'left';
        div.el.style.position = 'relative';
        div.el.style.height = '100%';
        div.el.style.overflow = 'hidden';

        this.updateLayout();
    }
});