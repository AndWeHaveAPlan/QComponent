/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var document = require("dom-lite").document;

module.exports = UIComponent.extend('HBox', {
    createEl: function () {
        this.el = document.createElement('div');
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        var children = this.el.childNodes;
        var count = children.length;
        for (var i = 0, length = children.length; i < length; i++) {
            children[i].style.width = 100 / count + '%';
            children[i].style.float = 'left';
            children[i].style.position = 'relative';
            children[i].style.height = '100%';
        }
    }
});