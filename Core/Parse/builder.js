/**
 * Created by ravenor on 06.07.16.
 */

var Base = require('../../Base');
var Factory = Base.Component.Factory;
var UIComponent = Base.Component.UIComponent;
var QObject = Base.QObject;

var Core = require('../../Core'),
    parser = Core.Parse.Parser;

var f = new Factory();

module.exports.build = function (input) {

    var i = 0;

    var createdComponents = [];

    for (i = 0; i < input.length; i++) {

        var tree = input[i];

        if (tree.items[0].pureData.substring(0, 4) === 'def ') {
            //user component definition
            defineComponent(tree);
        } else {
            //component creation
            createdComponents.push(createComponent(tree));
        }
    }

    return createdComponents;
};

/**
 *
 * @param tree
 * @returns {*[]}
 */
function defineComponent(tree) {
    var parsedDeclaration = parseDefinition(tree.items);

    function generateChildren(node) {
        if (node.children) {
            var el = parseDefinition(node.items);
            var children = [];

            for (var i = 0; i < node.children.length; i++) {
                children.push(generateChildren(node.children[i]));
            }

            return {item: el.className, id: el.elementName, value: el.value, items: children};

        } else {
            var p = parseDefinition(node.items);
            return {item: p.className, id: p.elementName, value: p.value};
        }
    }

    var generatedChildren = generateChildren(tree);


    var ctor = QObject._knownComponents[parsedDeclaration.className];

    ctor.extend(parsedDeclaration.elementName, {items: generatedChildren.items});

    //TODO
}

function parseDefinition(items) {
    var itemsParts = items[0].pureData.split(":");
    var declarationParts = itemsParts[0].match(/\S+/g);

    var isPublic = declarationParts[0] === 'public';
    var isDefinition = declarationParts[0] === 'def';

    var className =
        isPublic || isDefinition
            ? declarationParts[1]
            : declarationParts[0];

    var elementName =
        isPublic || isDefinition
            ? declarationParts[2] ? declarationParts[2] : void(0)
            : declarationParts[1] ? declarationParts[1] : void(0);

    var value;

    var valuePart = itemsParts[1].trim();
    if (valuePart.length <= 0 && valuePart.length > 1) {
        valuePart = items[1];
        if (valuePart.type === 'brace') {
            console.log(valuePart.pureData);
        } else if (valuePart.type === 'text') {
            value = valuePart.pureData;
        }
    } else {
        value = valuePart;
    }

    return {
        isPublic: isPublic,
        isDefinition: isDefinition,
        className: className,
        elementName: elementName,
        value: value
    };
}

/**
 *
 * @param tree
 * @returns {{}}
 */
function createComponent(tree) {

    var items = tree.items;
    var itemsParts = items[0].pureData.split(":");
    var declarationParts = itemsParts[0].match(/\S+/g);

    var isPublic = declarationParts[0] === 'public';

    var className =
        isPublic
            ? declarationParts[1]
            : declarationParts[0];

    //TODO: if public => must be named
    var elementName =
        isPublic
            ? declarationParts[2] ? declarationParts[2] : void(0)
            : declarationParts[1] ? declarationParts[1] : void(0);

    var newComponent = {};
    var value;

    var valuePart = itemsParts[1].trim();
    if (valuePart.length <= 0 && valuePart.length > 1) {
        valuePart = items[1];
        if (valuePart.type === 'brace') {
            console.log(valuePart.pureData);
        } else if (valuePart.type === 'text') {
            //newComponent.set('value', valuePart.pureData);
            value = valuePart.pureData;
        }
    } else {
        //newComponent.set('value', valuePart);
        value = valuePart;
    }


    if (QObject._knownComponents[className]) {
        newComponent = f.build(className, {id: elementName});
        var i, _i;
        for (i = 0, _i = tree.children ? tree.children.length : 0; i < _i; i++) {
            var currentChild = createComponent(tree.children[i]);
            if (currentChild instanceof UIComponent) {
                newComponent.addChild(currentChild);
            } else {
                newComponent.set(currentChild.name, currentChild.value);
            }
        }

        newComponent.set('value', value);

    } else {
        newComponent = {name: elementName, value: value, type: 'primitive'};
    }

    return newComponent;
}

var testCase =
    'def div myDiv:\n' +
    '  Button button1: b\n' +
    '  Button: a\n' +
    'myDiv: 444\n' +
    '  div:' +
    '    button b: efsgdfsgdfsg';

testTree = parser.treeBuilder(parser.tokenizer(testCase));

var test = module.exports.build(testTree);
console.log(test);
console.log('!');