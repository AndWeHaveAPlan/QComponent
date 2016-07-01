/**
 * Created by ravenor on 29.06.16.
 */
var assert = require('chai').assert;

var Base = require('../Base');
var Component = Base.Component.AbstractComponent;
var QObject = Base.QObject;
var SimplePipe=Base.Pipes.SimplePipe;

describe("Reactive tests", function () {

    it("should set property", function () {
        var comp = new Component();
        comp.set("testProperty", "testValue");

        assert.equal(comp.get("testProperty"), "testValue");
    });


    it("should fire events", function () {
        var comp = new Component();

        comp.subscribe(function (sender, name, newValue, oldValue) {
            assert.equal(name, "testReactiveProperty");
            assert.equal(newValue, "testReactiveValue");
        });

        comp.set("testReactiveProperty", "testReactiveValue");
    });


    it("should create pipes to self", function () {
        var comp1 = new Component({id: "comp1"});

        comp1.set("testSourceProp","testValue1");
        comp1.set("testTargetProp","hsrt gbdxgh stxdgnfc");

        Component.eventManager.registerPipe(
            new SimplePipe(
                {component:"comp1",property:"testSourceProp"},
                {component:"comp1",property:"testTargetProp"}
            )
        );

        comp1.set("testSourceProp","newTestSourceValue");
        assert.equal(comp1.get("testTargetProp"), "newTestSourceValue");
    });


    it("should create pipes to other components", function () {
        var comp1 = new Component({id: "comp1"});
        var comp2 = new Component({id: "comp2"});

        comp1.set("testSourceProp","testValue1");
        comp2.set("testTargetProp","hsrt gbdxgh stxdgnfc");

        Component.eventManager.registerPipe(
            new SimplePipe(
                {component:"comp1", property:"testSourceProp"},
                {component:"comp2", property:"testTargetProp"}
            )
        );

        comp1._data={};
        comp1.set(234,66);

        comp1.set("testSourceProp","newTestSourceValue");
        assert.equal(comp2.get("testTargetProp"), "newTestSourceValue");
    });
});