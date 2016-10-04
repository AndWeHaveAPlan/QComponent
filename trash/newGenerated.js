<!DOCTYPE HTML><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><script>module = {};</script><script src="bundle.js"></script><link rel="stylesheet" type="text/css" href="qstyle.css"><link rel="stylesheet" type="text/css" href="highlight.css"></head><body><script>console.log("INIT");QObject = Base.QObject; Q = (function(){'use strict';
    var _known = QObject._knownComponents,
        cls,
        out = {},
        Page = _known['Page'],
        VBox = _known['VBox'];

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
            });	this.set('ljadw', 	VBox.extend('VBox4ba5fa7d-0e7b-4f56-a749-76d48f7fbd61', {_prop: {value: new Base.Property("Variant")}}, function(){
            VBox.apply(this, arguments);
            var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;





            // s1

            var s1 = new _known['Slider']({	'from': 11,
                'to': 255,
                'value': 50,
                id: 's1'

            });

            this._ownComponents.push(s1);
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





            this.set('s1', s1)// label7

            var label7 = new _known['Label']({	id: 'label7'

            });

            this._ownComponents.push(label7);
            label7.mainEventManager=eventManager;


// children of label7



// pipes of label7

            this.createDependency([
                    's1.value'
                ],label7.id+'.value',
                function (s1) {
                    return 'Red: '+(s1)
                });

// events of label7




// s2

            var s2 = new _known['Slider']({	'from': -255,
                'to': 255,
                'step': 1,
                'value': 100,
                id: 's2'

            });

            this._ownComponents.push(s2);
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





            this.set('s2', s2)// label8

            var label8 = new _known['Label']({	id: 'label8'

            });

            this._ownComponents.push(label8);
            label8.mainEventManager=eventManager;


// children of label8



// pipes of label8

            this.createDependency([
                    's2.value'
                ],label8.id+'.value',
                function (s2) {
                    return 'Green: '+(s2)
                });

// events of label8




// s3

            var s3 = new _known['Slider']({	'from': 0,
                'to': 255,
                'step': 5,
                'value': 200,
                id: 's3'

            });

            this._ownComponents.push(s3);
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





            this.set('s3', s3)// label9

            var label9 = new _known['Label']({	id: 'label9'

            });

            this._ownComponents.push(label9);
            label9.mainEventManager=eventManager;


// children of label9



// pipes of label9

            this.createDependency([
                    's3.value'
                ],label9.id+'.value',
                function (s3) {
                    return 'Blue: '+(s3)
                });

// events of label9




// opacity

            var opacity = new _known['Slider']({	'from': 0,
                'to': 1,
                'value': 1,
                id: 'opacity'

            });

            this._ownComponents.push(opacity);
            opacity.mainEventManager=eventManager;


// children of opacity



// pipes of opacity



// events of opacity





            this.set('opacity', opacity)// label10

            var label10 = new _known['Label']({	id: 'label10'

            });

            this._ownComponents.push(label10);
            label10.mainEventManager=eventManager;


// children of label10



// pipes of label10

            this.createDependency([
                    'opacity.value'
                ],label10.id+'.value',
                function (opacity) {
                    return 'Page opacity: '+(opacity)
                });

// events of label10




// input11

            var input11 = new _known['input']({	'type': "number",
                'value': "8",
                id: 'input11'

            });

            this._ownComponents.push(input11);
            input11.mainEventManager=eventManager;


// children of input11



// pipes of input11



// events of input11

            input11.on('click',function(){
                this.set([
                    'this',
                    'value'
                ], this.get(['value']) + 1);
            }, input11);



        }))


    });
    return out;
})();</script></head><body><script>var c=new Q.main();c.load();</script></body></html>