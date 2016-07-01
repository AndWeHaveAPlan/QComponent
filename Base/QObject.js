(function(){
    'use strict';


    /**
     * Top level class
     *
     * @constructor
     */
    function QObject( cfg ){
        cfg && this.apply( cfg );
    }

    var prototype = {

        /**
         * Copy all properties of object2 to object1, or object1 to self if object2 not set
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        apply: function( object1, object2 ){
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for( i in source )
                target[i] = source[i];
            return target;
        },

        /**
         * Copy all properties of one object to another
         * Does not copy existed properties
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        applyIfNot: function( object1, object2 ){
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for( i in source )
                source[i] === void 0 && ( target[i] = source[i] );

            return target;
        },

        /**
         * Copy all properties of one object to another and make them not enumerable and not overwritable
         *
         * @param object1
         * @param object2
         * @returns {*} Changed object
         */
        applyPrivate: function( object1, object2 ){
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for( i in source )
                Object.defineProperty( target, i, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: source[i]
                } );
            return target;
        }
    };

    // makes prototype properties not enumerable
    QObject.prototype = prototype.applyPrivate.call( {}, prototype );

    module.exports = QObject;
})();