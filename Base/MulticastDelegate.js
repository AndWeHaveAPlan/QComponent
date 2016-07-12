/**
 * Created by ravenor on 12.07.16.
 */

/**
 * Fake constructor ^_^
 * created for pretty syntax
 *
 * @constructor
 */
function MulticastDelegate() {
    var delegate = MulticastDelegate.createDelegate();

    for (var i = 0, _l = arguments.length; i < _l; i++)
        delegate.addFunction(arguments[i]);

    return delegate;
}

/**
 *  Kinda static method
 *
 *  We put function un your function, so you can call function while you calling function
 *
 * @returns Function
 */
MulticastDelegate.createDelegate = function () {
    var delegate =
            function () {
                for (var i = 0, _i = flist.length; i < _i; i++) {
                    flist[i].apply(this, arguments);
                }
            },
        flist = delegate.flist = [];

    delegate.addFunction = function (fn) {
        flist.push(fn);
    };

    return delegate;
};

module.exports = MulticastDelegate;