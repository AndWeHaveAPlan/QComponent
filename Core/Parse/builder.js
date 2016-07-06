/**
 * Created by ravenor on 06.07.16.
 */

var Base = require('../../Base');
var Factory = Base.Component.Factory;
var UIComponent = Base.Component.UIComponent;

var f = new Factory();


('div,Button')
    .split(',')
    .forEach(function (name) {
        UIComponent.extend(name, {
            createEl: function () {
            },
            addToTree: function (child) {
                //console.log(child)
                child.el && (this.el || this.parent.el).appendChild(child.el);
                //(this.el || this.parent.el).appendChild(document.createTextNode('84'))
            },
        });
    });


module.exports.build = function (input) {

    var i = 0;

    var tree = input[i];

    if (tree.items[0].pureData.substring(0, 4) === 'def ') {
        //user component definition
        var newComponent = defineComponent(tree);

        //newComponent._eventManager.regis

        return newComponent;
    } else {
        //component creation
        return createComponent(tree);

    }
};

function defineComponent(tree) {
    var items = tree.items;
    var itemsParts = items[0].pureData.split(":");
    var declarationParts = itemsParts[0].match(/\S+/g);

    var parentClassName = declarationParts[1];
    var newClassName = declarationParts[2];

    return [parentClassName, newClassName];
}


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

    var newComponent = f.build(className, {id: elementName});

    var i, _i;
    for (i = 0, _i = tree.children ? tree.children.length : 0; i < _i; i++) {
        var currentChild = createComponent(tree.children[i]);

        newComponent.addChild(currentChild);
    }

    // TODO itemsParts[1] is undefined
    var valuePart = itemsParts[1].trim();
    if (valuePart.length <= 0) {
        valuePart = items[1];
        if (valuePart.type === 'bind') {
            console.log(valuePart.pureData);
        } else if (valuePart.type === 'text') {
            newComponent.set('value', valuePart.pureData);
        }
    } else {
        newComponent.set('value', valuePart);
    }

    return newComponent;
}

var testTree = tree = [{
    col: 1,
    row: 1,
    pureLine: 'def div: 123',
    type: 'div',
    rawLine: 'def div: 123',
    bonus: ': 123',
    rawChildren: '  Button button1: {{\n1+2\n}}\n  Button: b',
    pureChildren: 'Button button1: {{\n1+2\n}}\nButton: b',
    items: [{col: 1, row: 1, data: 'def div: 123', pureData: 'def div: 123', type: 'text'}],
    children: [
        {
            col: 3,
            row: 2,
            pureLine: 'Button button1: {{\n1+2\n}}',
            type: 'Button',
            rawLine: '  Button button1: {{\n1+2\n}}',
            bonus: ': {{\n1+2\n}}',
            items: [{col: 1, row: 2, data: '  Button button1: ', pureData: 'Button button1: ', type: 'text'}, {
                col: 12,
                row: 2,
                data: '{{\n1+2\n}}',
                pureData: '{\n1+2\n}',
                type: 'bind'
            }]
        },
        {
            col: 3,
            row: 3,
            pureLine: 'Button: b',
            type: 'Button',
            rawLine: '  Button: b',
            bonus: ': b',
            items: [{col: 1, row: 3, data: '  Button: b', pureData: 'Button: b ', type: 'text'}]
        }
    ]
}];

var test = module.exports.build(testTree);
console.log(test);
console.log('!');

/*

 Ivan Kubota, [6 июля 2016 г., 16:15]:
 div: 123
 Button: a {{
 1+2
 }}
 Button: b

 tree = [{
 col: 1,
 row: 1,
 pureLine: 'div: 123',
 type: 'div',
 rawLine: 'div: 123',
 bonus: ': 123',
 rawChildren:  '  Button: a {{\n1+2\n}}\n  Button: b',
 pureChildren: 'Button: a {{\n1+2\n}}\nButton: b',
 items: [{col:1, row:1, data: 'div: 123', pureData: 'div: 123', type: 'text'}],
 children: [
 {
 col: 3,
 row: 2,
 pureLine: 'Button: a {{\n1+2\n}}',
 type: 'Button',
 rawLine: '  Button: a {{\n1+2\n}}',
 bonus: ': a {{\n1+2\n}}',
 items: [{col:1, row:2, data: '  Button: a ', pureData: 'Button: a ', type: 'text'}, {col: 12, row: 2, data: '{{\n1+2\n}}', pureData: '{\n1+2\n}'}]
 },
 {
 col: 3,
 row: 3,
 pureLine: 'Button: b',
 type: 'Button',
 rawLine: '  Button: b',
 bonus: ': b',
 items: [{col:1, row:3, data: '  Button: b', pureData: 'Button: b ', type: 'text'}]
 }
 ]
 }

 */