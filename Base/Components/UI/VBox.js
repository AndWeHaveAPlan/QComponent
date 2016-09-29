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

        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(function () {
            var fDef = self._flexDefinition || { parts: [], starCount: 0, flexLength: 0, fixLength: 0 };
            var starCount = fDef.starCount;
            if (fDef.parts.length === 0)
                starCount = children.length;

            var freeHeight = 100 - 100 * (fDef.fixLength / self.el.clientHeight);

            for (var i = 0, length = children.length; i < length; i++) {
                var fPart = fDef.parts[i];
                var height = freeHeight / starCount + '%';
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        height = freeHeight * (fPart.part / fDef.flexLength) + '%';
                    if (!fPart.flex) { // 25
                        height = fPart.part + 'px';
                    }
                } else {
                    height = freeHeight / starCount + '%';
                }
                children[i].style.height = height;
            }
        }, 0);
        FlexSizeComponent.prototype.updateLayout.call(this);
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        div.el.style.position = 'relative';
        div.el.style.width = '100%';
        div.el.style.overflow = 'hidden';

        this.updateLayout();
    }
});