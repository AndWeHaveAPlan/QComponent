/**
 * Created by zibx on 15.07.16.
 */
var http = require('http'), url  = require('url'), fs = require('fs'),
    Core = require('./Core');

var server = http.createServer(function(req, res){
    try {
        try {
            var path = req.url.substr(1),
                source = fs.readFileSync('public/' + path) + '';
        }catch(e){
            try {
                source = fs.readFileSync(path) + '';
            }catch(e){
                throw e;
            }
        }
        if(path.indexOf('.qs')===-1)
            return res.end(source);

        var p = new Core.Compile.Linker({mapping: {
            id: 'id',
            code: 'code'
        }});

        p.add({
            id: path,
            code: source
        });
        try {
            var meta = p.getMetadata(),
                subObj = {},
                compiled;
            for(var i in meta)
                meta[i].type && (subObj[i] = meta[i]);
            
            compiled = Core.Compile.Compiler.compile(subObj);

            return res.end('<html><head>' +
                '<script>module = {};</script>'+
                '<script src="bundle.js"></script>' +
                '<script>QObject = Base.QObject; Q = '+compiled+';</script></head><body><script>var c=new Q.main();document.body.appendChild(c.el);</script></body></html>');
        }catch(e){
            return res.end(e.message);
        }



    }catch(e){
        return res.end('Поебень ('+path+')');
    }



});

server.listen(8000);
console.log('listen on 8000');