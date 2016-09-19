/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Some kind of namespace
 *
 * @type {{QObject: (QObject|exports|module.exports), Component: (AbstractComponent|exports|module.exports), Pipe: (Pipe|exports|module.exports)}}
 */
module.exports = {
    QObject: require('./Base/QObject'),
    Component: {
        AbstractComponent: require('./Base/Components/AbstractComponent'),
        UIComponent: require('./Base/Components/UIComponent'),
        ContentContainer: require('./Base/Components/ContentContainer'),
        mixins: {
            focusable: require('./Base/Mixins/focusable')
        },
        Workflow: {
            Scenario: require('./Base/Workflow/Scenario'),
            Selector: require('./Base/Workflow/Selector'),
            Sequence: require('./Base/Workflow/Sequence')
        },
        Common: {
            UIEventManager: require('./Base/Common/UIEventManager')
        },
        UI: {

            Fields: {
                Base: require('./Base/Components/UI/Field/Base')
            },
            Primitives: require('./Base/Components/UI/Primitives'),
            Checkbox: require('./Base/Components/UI/Checkbox'),
            RadioButton: require('./Base/Components/UI/RadioButton'),
            RadioButtonGroup: require('./Base/Components/UI/RadioButtonGroup'),
            TextBox: require('./Base/Components/UI/TextBox'),
            NumberBox: require('./Base/Components/UI/NumberBox'),
            MaskedInput: require('./Base/Components/UI/MaskedInput'),
            ListBox: require('./Base/Components/UI/ListBox'),
            WrapPanel: require('./Base/Components/UI/WrapPanel'),
            HBox: require('./Base/Components/UI/HBox'),
            Button: require('./Base/Components/UI/Button'),
            NumberKeyboard: require('./Base/Components/UI/NumberKeyboard'),
            ItemTemplate: require('./Base/Components/UI/ItemTemplate'),
            Slider: require('./Base/Components/UI/Slider'),
            Page: require('./Base/Components/UI/Page'),
            VBox: require('./Base/Components/UI/VBox'),
            Image: require('./Base/Components/UI/Image'),
            GeoMap: require('./Base/Components/UI/GeoMap'),
            CardForm: require('./Base/Components/UI/CardForm'),
            DOMTools: require('./Base/Common/UI/DOMTools'),
            If: require('./Base/Components/UI/If')
        },
        Factory: require('./Base/Components/Factory'),
        Logical: {
            LogicalComponent: require('./Base/Components/Logical/LogicalComponent'),
            Branch: require('./Base/Components/Logical/Branch'),
            Gate: require('./Base/Components/Logical/Gate'),
            Timer: require('./Base/Components/Logical/Timer'),
            Random: require('./Base/Components/Logical/Random'),
            Title: require('./Base/Components/Logical/Title'),
            AJAX: require('./Base/Components/Logical/AJAX'),
            Audio: require('./Base/Components/Logical/Audio')
        }
    },
    EventManager: require('./Base/EventManager'),
    Property: require('./Base/Property'),
    Pipes: {
        AbstractPipe: require('./Base/Pipes/AbstractPipe'),
        SimplePipe: require('./Base/Pipes/SimplePipe'),
        FiltratingPipe: require('./Base/Pipes/FiltratingPipe'),
        MutatingPipe: require('./Base/Pipes/MutatingPipe')
    }
};