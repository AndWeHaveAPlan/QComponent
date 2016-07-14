

module.exports = (function(){
    'use strict';
    var AbstractComponent = require('../AbstractComponent');

    var LogicalComponent = AbstractComponent.extend('LogicalComponent', {

    }, function( cfg ){
        AbstractComponent.call(this, cfg);
    });

    return LogicalComponent;
})();