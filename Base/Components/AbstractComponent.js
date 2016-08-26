/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
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

var AbstractComponent = QObject.extend('AbstractComponent', {
    _prop: {
        id: new Property('String', {description: 'Component ID'}, {
            set: function (key, val) {
                if (this.id && this.id !== val)
                    return false;

                this.id = key;
            },
            get: Property.defaultGetter
        })
    },

    /**
     * Create own components
     *
     * @private
     */
    _initOwnComponents: function () {
        var iterator = this._ownComponents.iterator(), item, ctor, type, cmp;

        while (item = iterator.next()) {

            if (item)

                if (item instanceof ContentContainer) {
                    this._contentContainer = item;
                } else {
                    this._eventManager.registerComponent(item);
                }

            if (item instanceof UIComponent) {

                this.el.appendChild(item.el);
                item.fire('addToParent')
            }
        }
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
        this._ownComponents.forEach(function (item) {
            if (item._type === matcher)out.push(item);
            out = out.concat(item.find(matcher));
        });
        this._children.forEach(function (item) {
            if (item._type === matcher)out.push(item);
            out = out.concat(item.find(matcher));
        });
        return out;
    }
}, function (cfg) {
    var self = this;
    QObject.call(this, cfg);

    this._data.id = this.id;

    /**
     * Own Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._ownComponents = new ObservableSequence(new DQIndex('id'));

    /** instantly modify child components on append */
    this._ownComponents.on('add', function (child) {
        child.parent = self;
        self._eventManager.registerComponent(child);
        //self.set([child.id], child);
        self.el.appendChild(child.el);
    });

    /**
     * Child Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._children = new ObservableSequence(new DQIndex('id'));

    this._children.on('add', function (child) {
        child.parent = self;
        //insert to dom
        if (child.el) { /** UI Component */
            if (self._contentContainer) {
                self._contentContainer.el.appendChild(child.el);
            } else {
                self.el.appendChild(child.el);
            }
        }
    });

    this._children.on('remove', function (child) {
        child.parent = null;
        if (self._contentContainer && child.el) {
            self._contentContainer.el.removeChild(child.el);
        } else {
            self.el.removeChild(child.el);
        }
    });

    this._initOwnComponents();

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