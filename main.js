/**
 * Created by zibx on 15.07.16.
 */
var http = require('http'), url  = require('url'), fs = require('fs'),
    Core = require('./Core'),
    debug = process.env.debug || true,
    querystring = require('querystring');;

var server = http.createServer(function(req, res){
    var reqUrl = url.parse(req.url,true);
    try {
        try {
            var path = reqUrl.pathname.substring(1);
            console.log(path);
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
        var obj = p.add({
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

            if(!reqUrl.query.highlight) {
                compiled = Core.Compile.Compiler.compile(subObj);

                return res.end('<html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer" />' +
                    '<script>module = {};</script>' +
                    '<link rel="stylesheet" type="text/css" href="qstyle.css">' +
                    '<script src="bundle.js"></script>' +
                    '<script>console.log("INIT");QObject = Base.QObject; Q = ' + compiled + ';</script></head><body><script>var c=new Q.main();document.body.appendChild(c.el);</script></body></html>');
            }else {

                source = source.replace(/>/g, "&gt;");

                for (var i=0;i< obj.tokens.length;i++) {
                    var cToken = obj.tokens[i];
                    for(var j=0;j<cToken.items.length;j++){
                        var cItem=cToken.items[j];

                        switch(cItem.type){
                            case 'comment':
                                source = source.replace(cItem.data, '<span class="comment">$&</span>');
                                break;
                        }
                    }
                }

                for (var key in meta)
                    if (meta.hasOwnProperty(key)) {
                        var cType = meta[key];
                        if (cType.type) {
                        } else {
                            source = source.replace(new RegExp(' '+key+'', 'g'), '<span class="cls">$&</span>');
                        }

                        for (var p in cType.public)
                            if (cType.public.hasOwnProperty(p)) {
                                var cPub = cType.public[p];
                                source = source.replace(new RegExp(' '+p+'.', 'g'), '<span class="property">$&</span>');
                            }
                        for (var pr in cType.private)
                            if (cType.private.hasOwnProperty(pr)) {
                                var cPriv = cType.private[pr];

                                source = source.replace(new RegExp(''+pr+'', 'g'), '<span class="property">$&</span>');
                            }
                    }

                source = source.replace(/\n/g, "<br/>");
                source = source.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                source = source.replace(/ (?![^<]*>)/g, "&nbsp");
                source = source.replace(/(def|define|public)/g, '<span class="keyword">$&</span>');

                return res.end('<html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer" />' +
                    '<script>module = {};</script>' +
                    '<link rel="stylesheet" type="text/css" href="qstyle.css">' +
                    '<link rel="stylesheet" type="text/css" href="highlight.css">' +
                    '</head><body><span class="highlight">' + source + '</span></body></html>');
            }

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