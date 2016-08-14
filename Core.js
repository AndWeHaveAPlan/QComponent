/**
 * Created by zibx on 06.07.16.
 */
module.exports = {};
var Base = require('./Base'),
    Core = module.exports;

Core.Base = Base;// Core requires Base if is running on server

Base.QObject.apply(module.exports, {
    Parse: {
        Parser: require("./Core/Parse/Parser")
    },
    Compile: {
        VariableExtractor: require('./Core/Compile/VariableExtractor'),
        tools: require("./Core/Compile/tools"),
        Linker: require("./Core/Compile/Linker"),
        Compiler: require("./Core/Compile/Compiler")
    }
});
Core.Compile.ASTtransformer = require("./Core/Compile/ASTtransformer");
