/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Some kind of namespace
 *
 * @type {{QObject: (QObject|exports|module.exports), Component: (AbstractComponent|exports|module.exports), Pipe: (Pipe|exports|module.exports)}}
 */
module.exports = {
    QObject: require("./Base/QObject"),
    Component: {
        AbstractComponent: require("./Base/Components/AbstractComponent"),
        UIComponent: require("./Base/Components/UIComponent"),
        ContentContainer: require('./Base/Components/ContentContainer'),
        UI: {
            Primitives: require('./Base/Components/UI/Primitives'),
            Checkbox: require('./Base/Components/UI/Checkbox'),
            ListBox: require('./Base/Components/UI/ListBox'),
            HBox: require('./Base/Components/UI/HBox')
        },
        Factory: require("./Base/Components/Factory"),
        Logical: {
            LogicalComponent: require('./Base/Components/Logical/LogicalComponent'),
            Branch: require('./Base/Components/Logical/Branch'),
            Gate: require('./Base/Components/Logical/Gate'),
            Timer: require('./Base/Components/Logical/Timer')
        }
    },
    EventManager: require("./Base/EventManager"),
    Pipes: {
        AbstractPipe: require("./Base/Pipes/AbstractPipe"),
        SimplePipe: require("./Base/Pipes/SimplePipe"),
        FiltratingPipe: require("./Base/Pipes/FiltratingPipe"),
        MutatingPipe: require("./Base/Pipes/MutatingPipe")
    }
};