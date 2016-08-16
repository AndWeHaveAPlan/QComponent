console.log("INIT");
QObject = Base.QObject;
Q = (function() {
    'use strict';
    var _known = QObject._knownComponents, cls, out = {}, Page = _known['Page'], ItemTemplate = _known['ItemTemplate'];
    var main = out['main'] = Page.extend('main', {
        _prop: {
            value: new Base.Property("Variant"),
            wp1: new Base.Property('WrapPanel'),
            i2: new Base.Property('Image')
        }
    }, function() {
        Page.apply(this, arguments);
        var tmp, eventManager = this._eventManager, mutatingPipe, parent = this, self = this;
        this.set('height', '100%')
        tmp = (function() {
                eventManager.registerComponent(this);
                var wp1 = (function(parent) {
                        eventManager.registerComponent(this);
                        parent._ownComponents.push(this);
                        return this;
                    }
                ).call(new _known['WrapPanel']({
                    id: 'wp1'
                }), this);
                wp1.set('scroll', 'vertical');
                wp1.set('selectionColor', 'transparent;');
                wp1.set('background', '#339');
                wp1.set('margin', '0 auto');
                wp1.set('width', '500px');
                wp1.set('height', '100%');
                wp1.set('padding', '26px');
                wp1.set('itemWidth', '25%');
                wp1.set('itemTemplate', ItemTemplate.extend('ItemTemplateebf45a52-bab3-4195-bb22-d6537906eeab', {
                    _prop: {
                        value: new Base.Property("Variant"),
                        icon: new Base.Property('Image')
                    }
                }, function() {
                    ItemTemplate.apply(this, arguments);
                    var tmp, eventManager = this._eventManager, mutatingPipe, parent = this, self = this;
                    this._subscribeList = [];
                    this._subscr = function() {
                        this._subscribeList.push(this.removableOn('mouseenter', function() {
                            self.get(['set'])('scale', [1.5, 1.5]);
                        }, this));
                        this._subscribeList.push(this.removableOn('mouseleave', function() {
                            self.get(['set'])('scale', [1, 1]);
                        }, this));
                    }
                    ;
                    this._subscr();
                    this.set('padding', '13px 0')
                    this.set('transition', '[object Object]')
                    tmp = (function() {
                            eventManager.registerComponent(this);
                            var icon = (function(parent) {
                                    eventManager.registerComponent(this);
                                    mutatingPipe = new Base.Pipes.MutatingPipe(['img'],{
                                        component: this.id,
                                        property: 'source'
                                    });
                                    mutatingPipe.addMutator(function(img) {
                                        return ( img) ;
                                    });
                                    eventManager.registerPipe(mutatingPipe);
                                    parent.addChild(this);
                                    return this;
                                }
                            ).call(new _known['Image']({
                                id: 'icon'
                            }), this);
                            icon.set('background', 'white');
                            icon.set('border-radius', '25%');
                            icon.set('padding', '0 0 100% 0');
                            icon.set('stretch', 'uniformToFill');
                            self.set('icon', icon);
                            parent._ownComponents.push(this);
                            return this;
                        }
                    ).call(new _known['div']({}), this);
                    tmp.set('padding', '26px 26px 0');
                    tmp = (function() {
                            eventManager.registerComponent(this);
                            mutatingPipe = new Base.Pipes.MutatingPipe(['name'],{
                                component: this.id,
                                property: 'value'
                            });
                            mutatingPipe.addMutator(function(name) {
                                return ( name) ;
                            });
                            eventManager.registerPipe(mutatingPipe);
                            parent._ownComponents.push(this);
                            return this;
                        }
                    ).call(new _known['center']({}), this);
                    tmp.set('color', 'white');
                    tmp.set('margin', '6.5px 0 0');
                    this._init();
                }));
                wp1.set('itemSource', ((function() {
                    var arr = [];
                    for (var i = 1; i < 100; i++) {
                        arr = arr.concat([{
                            name: 'Phone' + i,
                            img: 'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'
                        }, {
                            name: 'Yandex taxi' + i,
                            img: 'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'
                        }, {
                            name: 'Qiwi wallet' + i,
                            img: 'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'
                        }, {
                            name: 'Maps' + i,
                            img: 'http://i.utdstc.com/icons/256/yandex-maps-android.png'
                        }, {
                            name: 'Telegram' + i,
                            img: 'http://www.freeiconspng.com/uploads/telegram-icon-14.png'
                        }]);
                    }
                    return arr;
                })()));
                self.set('wp1', wp1);
                tmp = (function() {
                        eventManager.registerComponent(this);
                        tmp = (function(parent) {
                                eventManager.registerComponent(this);
                                mutatingPipe = new Base.Pipes.MutatingPipe(['wp1', 'wp1.selectedItem.name'],{
                                    component: this.id,
                                    property: 'value'
                                });
                                mutatingPipe.addMutator(function(wp1, wp1selectedItemname) {
                                    return ( wp1selectedItemname) ;
                                });
                                eventManager.registerPipe(mutatingPipe);
                                parent.addChild(this);
                                return this;
                            }
                        ).call(new _known['h1']({}), this);
                        var i2 = (function(parent) {
                                eventManager.registerComponent(this);
                                mutatingPipe = new Base.Pipes.MutatingPipe(['wp1', 'wp1.selectedItem.img'],{
                                    component: this.id,
                                    property: 'source'
                                });
                                mutatingPipe.addMutator(function(wp1, wp1selectedItemimg) {
                                    return ( wp1selectedItemimg) ;
                                });
                                eventManager.registerPipe(mutatingPipe);
                                parent.addChild(this);
                                return this;
                            }
                        ).call(new _known['Image']({
                            id: 'i2'
                        }), this);
                        i2.set('width', '100%');
                        i2.set('padding', '0 0 100%');
                        i2.set('rotation', 5);
                        i2.set('transform', [{
                            type: 'rotation',
                            angle: 30
                        }, {
                            type: 'scale',
                            x: 0.5,
                            y: 0.5
                        }, {
                            type: 'translation',
                            x: 50,
                            y: 50
                        }]);
                        i2.set('stretch', 'uniform');
                        self.set('i2', i2);
                        parent._ownComponents.push(this);
                        return this;
                    }
                ).call(new _known['div']({}), this);
                parent._ownComponents.push(this);
                return this;
            }
        ).call(new _known['HBox']({}), this);
        tmp.set('height', '100%');
        tmp.set('flexDefinition', '* 500');
        this._init();
    });
    return out;
})();