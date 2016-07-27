/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject'),
        parser = require('../Parse/Parser'),
        shadow = require('../Shadow'),
        cmetadata = {};

    return new QObject({
        compile: function (metadata) {
            cmetadata = metadata;

            var source = [],
                vars = {_known: 'QObject._knownComponents', cls: void 0, out: '{}'},
                varDefs = [], i;

            for (i in metadata)
                source = source.concat(this.compileClass(metadata, i, vars));

            for (i in vars)
                varDefs.push(vars[i] === void 0 ? i : i + ' = ' + vars[i]);

            return '(function(){\'use strict\';\nvar ' + varDefs.join(',\n\t') + ';\n\n' +
                source.join('\n') + '\nreturn out;\n})()';
        },
        compileClass: function (metadata, name, vars) {
            var item = metadata[name],
                source;
            vars[item.type] = '_known[\'' + item.type + '\']';

            var out='';
            for (var i in item.prop) {
                var prop = item.prop[i];
                var pipes = prop.value;
                if (pipes.isPipe) {
                    out += this.makePipe(pipes, 'self.id', i);
                } else {
                    var propVal = this.propertyGetter(prop);
                    out += '\t\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }

            source = [

                'var ' + name + ' = out[\'' + name + '\'] = ' + item.type + '.extend(\'' + name + '\', {}, function(){',
                '    ' + item.type + '.apply(this, arguments);',
                '    var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;',
                '',
                this.makePublic(item.public),
                item.children ? item.children.map(this.compileChild.bind(this)).join('') : '//no children\n',
                '    this._init();',
                '});'
            ];
            return source;
        },
        makePipe: function (pipe, sourceComponent, targetProperty) {
            var regEx = new RegExp('(self|top|' + pipe.vars.join('|') + ').([\\w^\\.]+)', 'g');
            var vars = [];
            var args = [];

            var fn = pipe.fn.replace(regEx, function (m, cName, pName) {

                var pNameClear = pName.replace('.', '');
                var v = {pname: pName, pnameClear: pNameClear, cname: '\'' + cName + '\'', full: cName + pNameClear};
                args.push(v.full);

                if (cName == 'self')
                    v.cname = 'this.id';
                if (cName == 'top')
                    v.cname = 'self.id';

                vars.push(v);

                return cName + pNameClear;
            });

            var pipeString = '\tmutatingPipe = new Base.Pipes.MutatingPipe(\n' +
                '\t    [' +
                vars.map(function (name) {
                    return name.cname + ' + \'.' + name.pname + '\'';
                }).join(',') +
                '],\n' +
                '\t    {component: this.id, property: \'' + targetProperty + '\'}\n' +
                '\t);\n' +
                '\tmutatingPipe.addMutator(function (' + args.join(',') + ') {\n' +
                '\t    return ' + fn + ';\n' +
                '\t});\n' +
                '\teventManager.registerPipe(mutatingPipe);\n';
            return pipeString;
        },
        makePublic: function (props) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += this.makePipe(pipes, 'this.id', i);
                } else {
                    propVal = this.propertyGetter(prop);
                    out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        },
        compileChild2: function (child) {
            var type = child.type;

            if (!cmetadata[type])
                if (!QObject._knownComponents[type] || !(QObject._knownComponents[type].prototype instanceof QObject._knownComponents.AbstractComponent))
                    return '';

            var compiledChildren = '';
            if (child.children)
                compiledChildren = child.children.map(this.compileChild2.bind(this)).join('');

            var out = '\ttmp = (function(parent){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren,
                i, prop, propVal, pipes;

            if (child.value)
                if (child.value.isPipe) {
                    var pipe = child.value;
                    out += this.makePipe(pipe, 'self.id', 'value');
                } else {
                    propVal = this.propertyGetter(child);
                    out += '\t\tthis.set(\'value\', ' + propVal + ')\n';
                }

            for (i in child.prop) {
                prop = child.prop[i];
                pipes = prop.value;
                if (pipes.isPipe) {
                    //var pipe = this.getPipe(pipes[i]);
                    out += this.makePipe(pipes, 'self.id', i);
                } else {
                    propVal = this.propertyGetter(prop);
                    out += '\t\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }

            out += '\t\tparent.addChild(this);\n\n';
            out += '\t\treturn this;\n' +
                '\t}).call( new _known[\'' + child.type/*TODO: escape*/ + '\']({' +
                (child.name ? 'id: \'' + child.name + '\'' : '') + '}), this );\n';

            return out;

        },
        compileChild: function (child) {
            var type = child.type;

            if (!cmetadata[type])
                if (!QObject._knownComponents[type] || !(QObject._knownComponents[type].prototype instanceof QObject._knownComponents.AbstractComponent))
                    return '';

            var compiledChildren = '';
            if (child.children)
                compiledChildren = child.children.map(this.compileChild2.bind(this)).join('');

            var out = '\ttmp = (function(){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren,
                i, prop, propVal, pipes;

            if (child.value)
                if (child.value.isPipe) {
                    var pipe = child.value;
                    out += this.makePipe(pipe, 'self.id', 'value');
                } else {
                    propVal = this.propertyGetter(child);
                    out += '\t\tthis.set(\'value\', ' + propVal + ')\n';
                }

            for (i in child.prop) {
                prop = child.prop[i];
                pipes = prop.value;
                if (pipes.isPipe) {
                    //var pipe = this.getPipe(pipes[i]);
                    out += this.makePipe(pipes, 'self.id', i);
                } else {
                    propVal = this.propertyGetter(prop);
                    out += '\t\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }

            out += '\t\tparent._ownComponents.push(this);\n\n';
            out += '\t\treturn this;\n' +
                '\t}).call( new _known[\'' + child.type/*TODO: escape*/ + '\']({' +
                (child.name ? 'id: \'' + child.name + '\'' : '') + '}) );\n';

            return out;

        },
        getPipe: function (items) {
            return items[0];
        },
        propertyGetter: function (prop) {

            if (Array.isArray(prop.value))
                return prop.value[0].data;

            return '\'' + prop.value + '\'';
        }
    });
})();