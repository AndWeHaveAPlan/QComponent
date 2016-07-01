/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Some kind of namespace
 *
 * @type {{QObject: (QObject|exports|module.exports), Component: (Component|exports|module.exports), Pipe: (Pipe|exports|module.exports)}}
 */
module.exports = {
    QObject: require("./Base/QObject"),
    Component: require("./Base/Component"),
    Pipes: {
        AbstractPipe: require("./Base/Pipes/AbstractPipe"),
        SimplePipe: require("./Base/Pipes/SimplePipe"),
    }
};