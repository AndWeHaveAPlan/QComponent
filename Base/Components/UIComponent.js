/**
 * Created by zibx on 01.07.16.
 */
module.exports = (function(){
    'use strict';
    var Abstract = require('./AbstractComponent');

    var UIComponent = function(cfg){
        Abstract.call(this, cfg);

    };
    UIComponent.prototype = Object.create(Abstract.prototype);
    UIComponent.prototype.apply({
        a: 1

    });

    return UIComponent;
});


module.exports = (function(){
    'use strict';
    var UIComponent = require('./AbstractComponent').extend({
        a: 1
    });
    return UIComponent;
})();