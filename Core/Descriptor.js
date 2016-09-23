var Fs = require('fs');
var Path = require('path');
var Base = require('./../Base');
var QObject = Base.QObject;


var html =
    '<!DOCTYPE HTML>' +
    '<head><' +
    'link rel= "stylesheet" type= "text/css" href= "qstyle.css">' +
    '</head>' +
    '<body>';

var header =
    '<!DOCTYPE HTML>' +
    '<head><' +
    'link rel= "stylesheet" type= "text/css" href= "qstyle.css">' +
    '</head>' +
    '<body>';

var footer =
    '</body>' +
    '</html>';

var tree = {};

function makeTree() {

}

function getMargin(level, offset) {
    offset = offset || 24;
    return 'margin-left:' + (level * offset) + 'px';
}

function getClassStructure(name, classes) {
    if (!classes)
        classes = [];
    var cmp = QObject._knownComponents[name];

    classes.push(name);

    if (cmp._prototype) {
        //console.log(cmp._prototype);
        return getClassStructure(cmp._prototype, classes);
    } else {
        return classes;
    }
}

module.exports.makeBase = function (base, level) {
    var html = '';
    level = level || 1;
    if (!base) {
        base = Base;
        html += '<h3 style="' + getMargin(level - 1) + '">Base</h3>';
    }

    for (var c in base) {
        if (base.hasOwnProperty(c)) {
            if (base[c] instanceof QObject) {
                var mName = c;
                if (mName in QObject._knownComponents) {
                    html += '<a href="/describe/' + mName + '" style="' + getMargin(level) + '; display: block;"><h3>' + mName + '</h3></a>';
                }
            } else {
                html += '<h3 style="' + getMargin(level) + '">' + c + '</h3>';
                html += module.exports.makeBase(base[c], level + 1);
            }
        }
    }

    return html;
}

module.exports.describeComponent = function (name) {
    var html = '';
    var cmp = QObject._knownComponents[name];

    if (!cmp) {
        return '<h1>Unknown component `' + name + '`</h1>';
    }

    html += '<h1>' + name + '</h1>';

    //Inheritance Hierarchy
    html += '<h2 style="padding-left: 24px">Inheritance Hierarchy</h2>';
    html += getClassStructure(name).reverse().map(function (cls, b) {
        return '<div style="' + getMargin(b + 2) + '" >⬑&nbsp;<a href="/describe/' + cls + '">' + cls + '</a></div>';
    }).join('');

    //Public properties
    var props = cmp.prototype ? cmp.prototype._prop || void 0 : void 0;
    if (props) {
        html += '<h2 style="padding-left: 24px">Public properties</h2>';
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                var prop = props[p];
                html += '<div style="margin-bottom: 6px;">';
                html += '<h3  class="highlight" style="padding-left: 48px">' + p + ': <span class="cls">' + prop.type + '<span></h3>';
                if (prop.metadata.description)
                    html += '<span style="padding-left: 48px">' + prop.metadata.description + '</span>';
                html += '</div></br>';
            }
        }
    }

    return html;
}