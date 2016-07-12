/**
 * Created by ravenor on 29.06.16.
 */

var assert = require('chai').assert;

var Base = require('../Base');
var Component = Base.Component.AbstractComponent;
var QObject = Base.QObject;
var SimplePipe = Base.Pipes.SimplePipe;
var EventManager = Base.EventManager;
var Branch = Base.Component.Logical.Branch;
var Gate = Base.Component.Logical.Gate;
var Timer = Base.Component.Logical.Timer;

describe("Timer", function () {

    var eventManager = new EventManager();
    var comp3 = new Component({id: "comp3"});
    var comp4 = new Component({id: "comp4"});
    var timer = new Timer({id: "timer"});

    eventManager.registerComponent("comp3", comp3);
    eventManager.registerComponent("comp4", comp4);
    eventManager.registerComponent("timer", timer);

    comp4.set("testTargetProp", 2);

    eventManager.registerPipe(new SimplePipe(
        "comp3.testSourceProp1",
        {component: "timer", property: "start"}
    ));
    eventManager.registerPipe(new SimplePipe(
        "timer.tick",
        {component: "comp4", property: "result"}
    ));

    before(function (done) {
        comp3.set("testSourceProp1", 100);
        setTimeout(function () {
            done();
        }, 200);
    });

    it("timer", function () {

        assert.equal(comp4.get("result"), true);

    });
});