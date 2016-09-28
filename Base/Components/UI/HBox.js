/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var FlexSizeComponent = require('./FlexSizeComponent');

module.exports = FlexSizeComponent.extend('HBox', {
    _createEl: function () {
        FlexSizeComponent.prototype._createEl.apply(this, arguments);
        var self = this;
        this.el.addEventListener('resize', function () {
            self.updateLayout();
        });
    },
    updateLayout: function () {
        var self = this;
        var children = this.el.childNodes;

        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(function () {
            var fDef = self._flexDefinition || { parts: [], starCount: 0, flexLength: 0, fixLength: 0 };
            var starCount = fDef.starCount;
            if (fDef.parts.length === 0)
                starCount = children.length;

            var freeWidth = 100 - 100 * (fDef.fixLength / self.el.clientWidth);

            for (var i = 0, length = children.length; i < length; i++) {
                var fPart = fDef.parts[i];
                var width = freeWidth / starCount + '%';
                if (fPart) {
                    if (fPart.flex && fPart.part > 0) // 25*
                        width = freeWidth * (fPart.part / fDef.flexLength) + '%';
                    if (!fPart.flex) { // 25
                        width = fPart.part + 'px';
                    }
                } else {
                    width = freeWidth / starCount + '%';
                }
                children[i].style.width = width;
            }
        }, 0);
        FlexSizeComponent.prototype.updateLayout.call(this);
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