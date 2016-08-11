/**
 * Created by zibx on 10.08.16.
 */
var assert = require('chai').assert;
var Base = require('../Base' ),
    DQIndex = require('z-lib-structure-dqIndex'),
    ObservableSequence = require('observable-sequence');

describe('Observable dq', function() {
    var struct = new ObservableSequence(new DQIndex('id'));

    struct.on('remove', function(el){
        console.log('remove', el);
    });
    struct.on('add', function(el){
        console.log('add', el);
    });

    it('push', function () {
        struct.push({id:1});
        struct.push({id:2});
        struct.push({id:3});
    });
    it('remove', function () {
        struct.splice(0,3);
    });
    it('push', function () {
        struct.push({id:1});
        struct.push({id:2});
        struct.push({id:3});
    });
    it('remove', function () {
        struct.splice(0,3);
    });
    it('push', function () {
        struct.push({id:1});
        struct.push({id:2});
        struct.push({id:3});
    });
    it('remove', function () {
        struct.splice(0,3);
    });
});