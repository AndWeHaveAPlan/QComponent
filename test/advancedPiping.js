/**
 * Created by ravenor on 29.06.16.
 */
var assert = require('chai').assert;

var Base = require('../Base');
var Component = Base.Component.AbstractComponent;
var QObject = Base.QObject;
var SimplePipe = Base.Pipes.SimplePipe;
var EventManager = Base.EventManager;

describe("Advanced piping", function () {

    it("should create custom mutating MULTI pipes", function () {

        var eventManager = new EventManager();

        var comp3 = new Component({id: "comp3"});
        var comp4 = new Component({id: "comp4"});

        eventManager.registerComponent("comp3", comp3);
        eventManager.registerComponent("comp4", comp4);

        comp4.set("testTargetProp", 2);

        var mPipe = new Base.Pipes.MutatingPipe(
            ["comp3.testSourceProp1", "comp3.testSourceProp2"],
            {component: "comp4", property: "testTargetProp"}
        );

        mPipe.addMutator(function (a, b) {
            return a + b;
        });
        mPipe.addMutator(function (a) {
            return a ? a.toUpperCase() : void(0);
        });

        eventManager.registerPipe(mPipe);

        comp3.set("testSourceProp1", "hello ");
        comp3.set("testSourceProp2", "multipipe!");

        assert.equal(comp4.get("testTargetProp"), 'HELLO MULTIPIPE!');
    });

    it("late binding", function () {
        var eventManager = new EventManager();

        var comp3 = new Component({id: "comp3"});
        var comp4 = new Component({id: "comp4"});

        eventManager.registerComponent("comp3", comp3);
        eventManager.registerComponent("comp4", comp4);

        comp3.set("testSourceProp1", "hello ");
        comp3.set("testSourceProp2", "multipipe!");

        var mPipe = new Base.Pipes.MutatingPipe(
            ["comp3.testSourceProp1", "comp3.testSourceProp2"],
            {component: "comp4", property: "testTargetProp"}
        );

        mPipe.addMutator(function (a, b) {
            return a + b;
        });
        mPipe.addMutator(function (a) {
            return a.toUpperCase();
        });

        eventManager.registerPipe(mPipe);

        assert.equal(comp4.get("testTargetProp"), 'HELLO MULTIPIPE!');
    });
});