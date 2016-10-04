<!DOCTYPE HTML><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><script>module = {};</script><script src="bundle.js"></script><link rel="stylesheet" type="text/css" href="qstyle.css"><link rel="stylesheet" type="text/css" href="highlight.css"></head><body><script>console.log("INIT");QObject = Base.QObject; Q = (function(){'use strict';
    var _known = QObject._knownComponents,
        cls,
        out = {},
        Page = _known['Page'];

    var main = out['main'] = Page.extend('main', {_prop: {value: new Base.Property("Variant")}}, function(){
        Page.apply(this, arguments);
        var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;




        this.createDependency([
                'opacity.value'
            ],self.id+'.opacity',
            function (opacity) {
                return (opacity)
            });this.createDependency([
                's1.value','s2.value','s3.value'
            ],self.id+'.background',
            function (s1,s2value,s3) {
                return 'rgba('+(s1|0)+','+(s2value)+','+(s3)+',1)'
            });
        // vBox32

        var vBox32 = new _known['VBox']({	id: 'vBox32'

        });

        this._ownComponents.push(vBox32);
        vBox32.mainEventManager=eventManager;


// children of vBox32

        // s1

        var s1 = new _known['Slider']({	'from': 11,
            'to': 255,
            'value': 50,
            id: 's1'

        });

        vBox32.addChild(s1);
        eventManager.registerComponent(s1);
        s1.mainEventManager=eventManager;


        // children of s1



        // pipes of s1

        this.createDependency([
                's1.value'
            ],s1.id+'.fillColor',
            function (s1value) {
                return 'rgb('+(s1value|0)+', 0, 0)'
            });

        // events of s1





        this.set('s1', s1);
        // label33

        var label33 = new _known['Label']({	id: 'label33'

        });

        vBox32.addChild(label33);
        eventManager.registerComponent(label33);
        label33.mainEventManager=eventManager;


        // children of label33



        // pipes of label33

        this.createDependency([
                's1.value'
            ],label33.id+'.value',
            function (s1) {
                return 'Red: '+(s1)
            });

        // events of label33




        ;
        // s2

        var s2 = new _known['Slider']({	'from': -255,
            'to': 255,
            'step': 1,
            'value': 100,
            id: 's2'

        });

        vBox32.addChild(s2);
        eventManager.registerComponent(s2);
        s2.mainEventManager=eventManager;


        // children of s2



        // pipes of s2

        this.createDependency([
                's2.value'
            ],s2.id+'.fillColor',
            function (s2) {
                return 'rgb(0, '+(s2)+', 0)'
            });

        // events of s2





        this.set('s2', s2);
        // label34

        var label34 = new _known['Label']({	id: 'label34'

        });

        vBox32.addChild(label34);
        eventManager.registerComponent(label34);
        label34.mainEventManager=eventManager;


        // children of label34



        // pipes of label34

        this.createDependency([
                's2.value'
            ],label34.id+'.value',
            function (s2) {
                return 'Green: '+(s2)
            });

        // events of label34




        ;
        // s3

        var s3 = new _known['Slider']({	'from': 0,
            'to': 255,
            'step': 5,
            'value': 200,
            id: 's3'

        });

        vBox32.addChild(s3);
        eventManager.registerComponent(s3);
        s3.mainEventManager=eventManager;


        // children of s3



        // pipes of s3

        this.createDependency([
                's3.value'
            ],s3.id+'.fillColor',
            function (s3) {
                return 'rgb(0, 0, '+(s3)+')'
            });

        // events of s3





        this.set('s3', s3);
        // label35

        var label35 = new _known['Label']({	id: 'label35'

        });

        vBox32.addChild(label35);
        eventManager.registerComponent(label35);
        label35.mainEventManager=eventManager;


        // children of label35



        // pipes of label35

        this.createDependency([
                's3.value'
            ],label35.id+'.value',
            function (s3) {
                return 'Blue: '+(s3)
            });

        // events of label35




        ;
        // opacity

        var opacity = new _known['Slider']({	'from': 0,
            'to': 1,
            'value': 1,
            id: 'opacity'

        });

        vBox32.addChild(opacity);
        eventManager.registerComponent(opacity);
        opacity.mainEventManager=eventManager;


        // children of opacity



        // pipes of opacity



        // events of opacity





        this.set('opacity', opacity);
        // label36

        var label36 = new _known['Label']({	id: 'label36'

        });

        vBox32.addChild(label36);
        eventManager.registerComponent(label36);
        label36.mainEventManager=eventManager;


        // children of label36



        // pipes of label36

        this.createDependency([
                'opacity.value'
            ],label36.id+'.value',
            function (opacity) {
                return 'Page opacity: '+(opacity)
            });

        // events of label36




        ;
        // input37

        var input37 = new _known['input']({	'type': "number",
            'value': "8",
            id: 'input37'

        });

        vBox32.addChild(input37);
        eventManager.registerComponent(input37);
        input37.mainEventManager=eventManager;


        // children of input37



        // pipes of input37



        // events of input37

        input37.on('click',function(){
            this.set(['value'], this.get(['value']) + 1);
        }, input37);




// pipes of vBox32



// events of vBox32





    });
    return out;
})();</script></head><body><script>var c=new Q.main();c.load();</script></body></html>