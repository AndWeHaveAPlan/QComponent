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
});