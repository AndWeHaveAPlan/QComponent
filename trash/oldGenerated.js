console.log("INIT");
QObject = Base.QObject;
Q = (function() {
    'use strict';
    var _known = QObject._knownComponents, cls, out = {}, ItemTemplate = _known['ItemTemplate'], Page = _known['Page'];
    var WrapTemplate = out['WrapTemplate'] = ItemTemplate.extend('WrapTemplate', {
        _prop: {
            value: new Base.Property("Variant"),
            icon: new Base.Property('Image')
        }
    }, function() {
        ItemTemplate.apply(this, arguments);
        var tmp, eventManager = this._eventManager, mutatingPipe, parent = this, self = this;
        this._subscribeList = [];
        this._subscribeEvents = function() {
            this._subscribeList.push(this.removableOn('mouseenter', function() {
                self.set('scale', 1.5);
            }, self));
            this._subscribeList.push(this.removableOn('mouseleave', function() {
                self.set('scale', 1);
            }, self));
        }
        ;
        this._subscribeEvents();
        this.set('padding', '13px 0')
        this.set('transition', 'all 0.2s ease')
        tmp = (function() {
                eventManager.registerComponent(this);
                var icon = (function(parent) {
                        eventManager.registerComponent(this);
                        mutatingPipe = new Base.Pipes.MutatingPipe(['img'],{
                            component: this.id,
                            property: 'source'
                        });
                        mutatingPipe.addMutator(function(img) {
                            return img;
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
        ).call(new _known['div']({}));
        tmp.set('padding', '26px 26px 0');
        tmp = (function() {
                eventManager.registerComponent(this);
                mutatingPipe = new Base.Pipes.MutatingPipe(['name'],{
                    component: this.id,
                    property: 'value'
                });
                mutatingPipe.addMutator(function(name) {
                    return name;
                });
                eventManager.registerPipe(mutatingPipe);
                parent._ownComponents.push(this);
                return this;
            }
        ).call(new _known['center']({}));
        tmp.set('color', 'white');
        tmp.set('margin', '6.5px 0 0');
        this._init();
    });
    var main = out['main'] = Page.extend('main', {
        _prop: {
            value: new Base.Property("Variant"),
            wp1: new Base.Property('WrapPanel')
        }
    }, function() {
        Page.apply(this, arguments);
        var tmp, eventManager = this._eventManager, mutatingPipe, parent = this, self = this;
        this.set('height', '100%')
        tmp = (function() {
                eventManager.registerComponent(this);
                var wp1 = (function(parent) {
                        eventManager.registerComponent(this);
                        parent.addChild(this);
                        return this;
                    }
                ).call(new _known['WrapPanel']({
                    id: 'wp1'
                }), this);
                wp1.set('selectionColor', 'transparent;');
                wp1.set('background', '#339');
                wp1.set('margin', '0 auto');
                wp1.set('width', '500px');
                wp1.set('height', '100%');
                wp1.set('padding', '26px');
                wp1.set('itemWidth', '25%');
                wp1.set('itemTemplate', 'WrapTemplate');
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
                tmp = (function(parent) {
                        eventManager.registerComponent(this);
                        tmp = (function(parent) {
                                eventManager.registerComponent(this);
                                mutatingPipe = new Base.Pipes.MutatingPipe(['wp1.selectedItem.name'],{
                                    component: this.id,
                                    property: 'value'
                                });
                                mutatingPipe.addMutator(function(wp1selectedItemname) {
                                    return wp1selectedItemname;
                                });
                                eventManager.registerPipe(mutatingPipe);
                                parent.addChild(this);
                                return this;
                            }
                        ).call(new _known['h1']({}), this);
                        tmp = (function(parent) {
                                eventManager.registerComponent(this);
                                mutatingPipe = new Base.Pipes.MutatingPipe(['wp1.selectedItem.img'],{
                                    component: this.id,
                                    property: 'source'
                                });
                                mutatingPipe.addMutator(function(wp1selectedItemimg) {
                                    return wp1selectedItemimg;
                                });
                                eventManager.registerPipe(mutatingPipe);
                                parent.addChild(this);
                                return this;
                            }
                        ).call(new _known['Image']({}), this);
                        tmp.set('width', '100%');
                        tmp.set('padding', '0 0 100%');
                        tmp.set('rotation', '5');
                        tmp.set('stretch', 'uniform');
                        parent.addChild(this);
                        return this;
                    }
                ).call(new _known['div']({}), this);
                parent._ownComponents.push(this);
                return this;
            }
        ).call(new _known['HBox']({}));
        tmp.set('height', '100%');
        tmp.set('flexDefinition', '* 500');
        this._init();
    });
    return out;
})();