/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    MutatingPipe = require('./../Pipes/MutatingPipe'),
    SimplePipe = require('./../Pipes/SimplePipe'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex'),
    Property = require('../Property');


/**
 * Base class for all components
 * @param cfg.parent Component: Parent component
 * @param cfg.id String: Component unique id
 * @param [cfg.leaf] Boolean: True if component may have children
 * @constructor
 */


/**
 * @type {Function}
 * @extends QObject
 */
var AbstractComponent = QObject.extend('AbstractComponent', {
    _prop: {
        value: new Property('Variant'),
        id: new Property('String', { description: 'Component ID' }, {
            set: function (key, val) {
                if (this.id && this.id !== val)
                    return false;

                this.id = key;
                return true;
            },
            get: Property.defaultGetter
        })
    },

    /**
     * 
     * @param {} from 
     * @param {} to 
     * @param {} func 
     * @returns {} 
     */
    createDependency: function (from, to, func) {
        //to = this.id + '.' + to;
        //from = this.id + '.' + from;

        if (func) {
            this._eventManager.registerPipe(new MutatingPipe(from, to).addMutator(func));
        } else {
            this._eventManager.registerPipe(new SimplePipe(from, to));
        }
    },

    addChild: function (component) {
        this._children.push(component);
        return this;
    },

    /**
     * Bind to this._children.on('add'...)
     * 
     * @param {AbstractComponent} child 
     * @returns {null} 
     */
    _onChildAdd: function (child) {
        child.parent = this;
    },

    /**
     * Bind to this._children.on('remove'...)
     * 
     * @param {AbstractComponent} child 
     * @returns {null} 
     */
    _onChildRemove: function (child) {
        child.parent = null;
    },

    /**
     * Bind to this._ownComponents.on('add'...)
     * 
     * @param {AbstractComponent} child 
     * @returns {null} 
     */
    _onOwnComponentAdd: function (child) {
        child.parent = this;
        this._eventManager.registerComponent(child);
    },

    /**
     * Bind to this._ownComponents.on('remove'...)
     * 
     * @param {AbstractComponent} child 
     * @returns {null} 
     */
    _onOwnComponentRemove: function (child) {
        //shoul not be called
    },

    _afterInit: function () {
        this._init();
        this._eventManager.releaseThePipes();
    },

    /**
     * Subscribe to _onPropertyChanged event
     *
     * @param callback Function
     */
    subscribe: function (callback) {
        this._onPropertyChanged.addFunction(callback);
    },

    find: function (matcher) {
        var out = [];
        var matches = matcher.split(' '), match = matches[0],
            tokens = match.split('#'),
            type = tokens[0],
            id = tokens[1];

        [this._ownComponents, this._children].forEach(function (item) {
            item.forEach(function (item) {
                var matched = true;
                if (id)
                    matched = (item.id === id);

                if (type)
                    matched = matched && (item._type === type);

                if (matched)
                    out.push(item);

                out = out.concat(item.find(match));
            });
        });

        return out;
    },
    findOne: function (matcher) {
        return this.find(matcher)[0];
    }
}, function (cfg) {
    QObject.call(this, cfg);

    this._data.id = this.id;

    /**
     * Own Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._ownComponents = new ObservableSequence(new DQIndex('id'));
    this._ownComponents.on('add', this._onOwnComponentAdd.bind(this));
    this._ownComponents.on('remove', this._onOwnComponentRemove.bind(this));

    /**
     * Child Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._children = new ObservableSequence(new DQIndex('id'));
    this._children.on('add', this._onChildAdd.bind(this));
    var mnu = this;
    this._children.on('remove', function (c) {
        mnu._onChildRemove.call(mnu, c)

    });

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */

    if (!this._eventManager)
        this._eventManager = new EventManager(this);

    this._eventManager.registerComponent(this);
});

module.exports = AbstractComponent;