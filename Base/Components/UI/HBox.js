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

        setTimeout(function () {
            var freeWidth = 100 - 100 * (fDef.fixLength / self.el.clientWidth);
            var startUndef = -1;
            for (var i = 0, length = children.length; i < length; i++) {
                var fPart = fDef.parts[i];
                var width = freeWidth / (fDef.starCount > 0 ? fDef.starCount : 1) + '%';
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        width = freeWidth * (fPart.part / fDef.flexLength) + '%';
                    if (!fPart.flex) { // 25
                        width = fPart.part + 'px';
                    }
                } else {
                    if (startUndef < 0)
                        startUndef = i;
                    width = freeWidth / (children.length - startUndef) + '%';
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