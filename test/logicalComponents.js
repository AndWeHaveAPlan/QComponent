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

describe("Logical Components", function () {

    it("branch", function () {

        var eventManager = new EventManager();

        var comp3 = new Component({id: "comp3"});
        var comp4 = new Component({id: "comp4"});

        var branch = new Branch({id: "branch"});

        eventManager.registerComponent("comp3", comp3);
        eventManager.registerComponent("comp4", comp4);
        eventManager.registerComponent("branch", branch);

        comp4.set("testTargetProp", 2);

        eventManager.registerPipe(new SimplePipe(
            "comp3.testSourceProp1",
            {component: "branch", property: "input"}
        ));

        eventManager.registerPipe(new SimplePipe(
            "branch.ifTrue",
            {component: "comp4", property: "ifTrue"}
        ));

        eventManager.registerPipe(new SimplePipe(
            "branch.ifFalse",
            {component: "comp4", property: "ifFalse"}
        ));

        comp3.set("testSourceProp1", (2 * 2) == 4);
        assert.equal(comp4.get("ifTrue"), true);

        comp3.set("testSourceProp1", (2 * 2) == 5);
        assert.equal(comp4.get("ifFalse"), false);
    });

    it("gate", function () {

        var eventManager = new EventManager();

        var comp3 = new Component({id: "comp3"});
        var comp4 = new Component({id: "comp4"});

        var gate = new Gate({id: "gate"});

        eventManager.registerComponent("comp3", comp3);
        eventManager.registerComponent("comp4", comp4);
        eventManager.registerComponent("gate", gate);

        comp4.set("testTargetProp", 2);

        eventManager.registerPipe(new SimplePipe(
            "comp3.testSourceProp1",
            {component: "gate", property: "input"}
        ));
        eventManager.registerPipe(new SimplePipe(
            "gate.output",
            {component: "comp4", property: "result"}
        ));

        comp3.set("testSourceProp1", 'must go');
        assert.equal(comp4.get("result"), 'must go');

        gate.set('close');
        comp3.set("testSourceProp1", 'must stop');
        assert.equal(comp4.get("result"), 'must go');

        gate.set('toggle');
        comp3.set("testSourceProp1", 'must go again');
        assert.equal(comp4.get("result"), 'must go again');
    });
});