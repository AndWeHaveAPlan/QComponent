/**
 * Created by zibx on 06.07.16.
 */
module.exports = {
    QObject: require("./Base/QObject"),
    Parse: {
        Parser: require("./Core/Parse/Parser")        
    },
    Compile: {
        VariableExtractor: require('./Core/Compile/VariableExtractor'),
        tools: require("./Core/Compile/tools"),
        Linker: require("./Core/Compile/Linker"),
        Compiler: require("./Core/Compile/Compiler")
    }
};