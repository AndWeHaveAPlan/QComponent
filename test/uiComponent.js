'use strict';
/**
 * Created by zibx on 01.07.16.
 */
var Base = require('../Base');
var assert = require('chai').assert;

var Component = Base.Component.AbstractComponent;
var UIComponent = Base.Component.UIComponent;


describe("Basic functionality", function () {
    it("should can apply", function (){
        var x = new UIComponent();
        console.log( x )
    });
});