var Fs = require('fs'),
    Path = require('path');

var classTree = {};

function buildTree(path) {
    var absolutePath = Path.join(__dirname, path);
    var files = Fs.readdirSync(absolutePath);
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var filePath = Path.join(absolutePath, file);
        var stat = Fs.statSync(filePath);
        if (stat.isFile()) {
            handleFileName(Path.join(path, file));
        }
        if (stat.isDirectory())
            buildTree(Path.join(path, file));
    }
}

function handleFileName(path) {
    if (!(path.substring(path.length - 3) === '.js'))
        return;
    var path2 = path.substring(0, path.length - 3);
    var parts = path2.split(/[/\\]/g);
    var toSet = classTree;
    for (var i = 0; i < parts.length - 1; i++) {
        var part = parts[i];
        if (!toSet[part])
            toSet[part] = {};
        toSet = toSet[part];
    }
    toSet[parts[parts.length - 1]] = path;
}

function handleFile(path, aPath, name) {
    
    var absolutePath = Path.join(__dirname, path);
    var content = Fs.readFileSync(absolutePath).toString();
    content = content.replace(/module.exports\s+=\s+/g, 'return ');
    
    content = content.replace(/require\('([\w./]+)'\)/g, function (a, b, c, d, e) {
        var parts = b.split('/');
        var folders = aPath;
        
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            
            if (part === '..') {
                folders = folders.slice(0, -2);
            } else if (part === '.') {
                folders = folders.slice(0, -1);
            } else {
                folders.push(part);
            }
        }
        
        folders.unshift(name);
        return folders.join('.');
    });
    
    return content;
}

/**
 *
 * @param tree
 * @param name
 */
function rebuildTree(tree, name, targetFile) {
    
    var aPath = [];
    
    Fs.appendFileSync(targetFile, 'var ' + name + ' = {');
    
    function recursion(subtree) {
        for (var key in subtree) {
            if (subtree.hasOwnProperty(key)) {
                var st = subtree[key];
                aPath.push(key);
                if (typeof st == 'string') {
                    Fs.appendFileSync(targetFile, key + ': (function(){');
                    Fs.appendFileSync(targetFile, handleFile(st, aPath, name));
                    Fs.appendFileSync(targetFile, '})(),\n');

                } else {
                    Fs.appendFileSync(targetFile, '\n' + key + ': {\n');
                    recursion(st);
                    Fs.appendFileSync(targetFile, '},\n');
                }
                aPath.splice(-1);
            }
        }
    }
    
    recursion(tree[name]);
    
    Fs.appendFileSync(targetFile, '}');
}

try {
    Fs.unlinkSync('public/bundle3.js');
} catch (e) {
    
}

buildTree('Base');
rebuildTree(classTree, 'Base', 'public/bundle3.js');

//Fs.appendFileSync('bundle3.js', JSON.stringify(classTree, null, '\t'));

console.log(__dirname);