/**
 * Created by zibx on 15.07.16.
 */
var http = require('http'), url  = require('url'), fs = require('fs'),
    Core = require('./Core'),
    debug = process.env.debug || true;

var server = http.createServer(function(req, res){
    console.log(123)
    try {
        try {
            var path = req.url.substr(1);
            console.log(path)
            var source = fs.readFileSync('public/' + path) + '';

        }catch(e){
            try {
                source = fs.readFileSync(path) + '';
            }catch(e){
                //throw e;
                return res.end('no file');
            }
        }
        if(path.indexOf('.qs')===-1)
            return res.end(source);

        var p = new Core.Compile.Linker({mapping: {
            id: 'id',
            code: 'code'
        }});
        console.log('file exists. it`s qs!')
        p.add({
            id: path,
            code: source
        });
        console.log('source added');
        try {
            var meta = p.getMetadata(),
                subObj = {},
                compiled;
            console.log('metadata extracted');
            for(var i in meta)
                meta[i].type && (subObj[i] = meta[i]);
            
            compiled = Core.Compile.Compiler.compile(subObj);

            return res.end('<html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer" />' +
                '<script>module = {};</script>' +
                '<link rel="stylesheet" type="text/css" href="qstyle.css">' +
                '<script src="bundle.js"></script>' +
                '<script>console.log("INIT");QObject = Base.QObject; Q = '+compiled+';</script></head><body><script>var c=new Q.main();document.body.appendChild(c.el);</script></body></html>');
        }catch(e){
            if(debug)throw e;
            return res.end(e.message);
        }
    }catch(e){
        if(debug)throw e;
        return res.end('Поебень ('+path+')');
    }



});

var port = 8001;
server.listen(port, 'localhost', function(err) {
    console.log('listen on ' + port);
});