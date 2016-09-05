/**
 * Created by ravenor on 30.06.16.
 */

var AbstractComponent = require('../Components/AbstractComponent');

module.exports = AbstractComponent.extend('Sequence', {
    canGoNext: function () {
        return (this.cursor + 1) < this._ownComponents.length;

    },
    canGoBack: function () {
        return (this.cursor - 1) >= 0;

    },
    next: function () {
        if (!this.canGoNext()) {
            return void(0);
        }

        this.cursor += 1;

        if ((this.cursor + 1) === this._ownComponents.length) {
            this.fire('complete');
        }

        return this._ownComponents.get(this.cursor);
    },
    back: function () {
        if (!this.canGoBack()) {
            return void(0);
        }

        this.cursor -= 1;
        return this._ownComponents.get(this.cursor);
    }
}, function (cfg) {
    var self = this;
    AbstractComponent.call(this, cfg);
    this.cursor = -1;

    this._children.on('add', function (child) {
        self._ownComponents.push(child);
    });
});