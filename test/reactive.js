/**
 * Created by ravenor on 29.06.16.
 */
var assert = require('chai').assert;

var Base = require('../Base');
var Component = Base.Component.AbstractComponent;
var QObject = Base.QObject;
var SimplePipe = Base.Pipes.SimplePipe;
var EventManager = Base.EventManager;

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
        var eventManager = new EventManager();

        eventManager.registerComponent(comp1);

        comp1.set("testSourceProp", "testValue1");
        comp1.set("testTargetProp", "hsrt gbdxgh stxdgnfc");
        eventManager.registerPipe(
            new SimplePipe(
                {component: "comp1", property: "testSourceProp"},
                {component: "comp1", property: "testTargetProp"}
            )
        );

        comp1.set("testSourceProp", "newTestSourceValue");
        assert.equal(comp1.get("testTargetProp"), "newTestSourceValue");
    });


    it("should create pipes to other components", function () {

        var eventManager = new EventManager();

        var comp1 = new Component({id: "comp1"});
        var comp2 = new Component({id: "comp2"});

        eventManager.registerComponent(comp1);
        eventManager.registerComponent(comp2);

        comp1.set("testSourceProp", "testValue1");
        comp2.set("testTargetProp", "hsrt gbdxgh stxdgnfc");

        eventManager.createSimplePipe(
            {component: "comp1", property: "testSourceProp"},
            {component: "comp2", property: "testTargetProp"}
        );

        comp1._data = {};
        //comp1.set(234, 66);

        comp1.set("testSourceProp", "newTestSourceValue");
        assert.equal(comp2.get("testTargetProp"), "newTestSourceValue");
    });

    it("should create custom filtrating pipes", function () {

        var eventManager = new EventManager();

        var comp3 = new Component({id: "comp3"});
        var comp4 = new Component({id: "comp4"});

        eventManager.registerComponent(comp3);
        eventManager.registerComponent(comp4);

        comp3.set("testSourceProp", 45634634);
        comp4.set("testTargetProp", 2);

        var fPipe = new Base.Pipes.FiltratingPipe(
            {component: "comp3", property: "testSourceProp"},
            {component: "comp4", property: "testTargetProp"}
        );

        fPipe.addFilter(function (a) {
            return a % 2 === 0;
        });
        fPipe.addFilter(function (a) {
            return a > 5;
        });

        eventManager.registerPipe(fPipe);

        comp3.set("testSourceProp", 1);
        assert.equal(comp4.get("testTargetProp"), 2);

        comp3.set("testSourceProp", 4);
        assert.equal(comp4.get("testTargetProp"), 2);

        comp3.set("testSourceProp", 6);
        assert.equal(comp4.get("testTargetProp"), 6);
    });

    it("should create custom mutating pipes", function () {

        var eventManager = new EventManager();

        var comp3 = new Component({id: "comp3"});
        var comp4 = new Component({id: "comp4"});

        eventManager.registerComponent(comp3);
        eventManager.registerComponent(comp4);

        comp3.set("testSourceProp", {a: 2, b: 3});
        comp4.set("testTargetProp", 2);

        var fPipe = new Base.Pipes.MutatingPipe(
            {component: "comp3", property: "testSourceProp"},
            {component: "comp4", property: "testTargetProp"}
        );

        fPipe.addMutator(function (a) {
            return a.a + a.b;
        });
        fPipe.addMutator(function (a) {
            return a + 8;
        });

        eventManager.registerPipe(fPipe);

        comp3.set("testSourceProp", {a: 2, b: 3});
        assert.equal(comp4.get("testTargetProp"), 13);
    });
});