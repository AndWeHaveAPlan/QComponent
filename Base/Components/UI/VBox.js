/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

module.exports = UIComponent.extend('VBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        var children = this.el.childNodes;
        var count = children.length;
        for (var i = 0, length = children.length; i < length; i++) {
            children[i].style.height = 100 / count + '%';
            children[i].style.position = 'relative';
            children[i].style.width = '100%';
        }
    }
});