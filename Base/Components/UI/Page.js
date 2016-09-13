/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent'),
    QObject = require('../../QObject'),
    Property = require('../../Property');

module.exports = UIComponent.extend('Page', {
    createEl: function () {
        this.el = QObject.document.createElement('div');
    },
    load: function () {
        QObject.document.body.appendChild(this.el);
        this.fire('loaded');
    },
    _prop: {
        title: new Property('String', { description: 'Page Title' }, {
            set: function (name, value) {
                document.title = value;
            },
            get: function (name, value) {
                return document.title;
            }
        }, ''),
        /**
        *  @type Scenario
        */
        scenario: new Property('Scenario')
    }
},
    function (cfg) {
        cfg = cfg || {};
        cfg.height = cfg.height || '100%';
        cfg.width = cfg.width || '100%';
        UIComponent.call(this, cfg);
    });