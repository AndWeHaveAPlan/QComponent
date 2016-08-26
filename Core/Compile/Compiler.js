/**
 * Created by zibx on 08.07.16.
 */

module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject');

    var CompileScope = require('./CompileScope');
    

    var compiler = new QObject({
        compile: function (metadata) {

            var scope = new CompileScope({
                metadata: metadata,
                varDefs: []
            });

            var source = [],
                vars = scope.vars, i;

            for (i in metadata)
                source = source.concat(scope.cls(i).compile());

            for (i in vars)
                scope.varDefs.push(vars[i] === void 0 ? i : i + ' = ' + vars[i]);

            return '(function(){\'use strict\';\nvar ' + scope.varDefs.join(',\n\t') + ';\n\n' +
                source.join('\n') + '\nreturn out;\n})()';
        }
    });
    return compiler;
})();