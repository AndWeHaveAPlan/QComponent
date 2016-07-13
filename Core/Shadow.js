/**
 * Created by zibx on 08.07.16.
 */
module.exports = {
    QObject: require('./Shadow/QObject'),
    AbstractComponent: require('./Shadow/AbstractComponent'),
    UIComponent: require('./Shadow/UIComponent'),
    HTMLComponent: require('./Shadow/HTMLComponent'),
    String: {},
    Number: {},
    Function: {
        rawChildren: true
    }
};


('a,b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'input,label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,textarea,th,thead,tr,u,ul,header').split(',').forEach(function (name) {
    module.exports[name] = {
        argumentParser: function (bonus, item) {


            console.log(item)


            if(item.items[0].info === '{') {
                !('props' in item) && (item.props = {});
                item.props.cls = item.items.shift();
            }

            //if(name === 'div')debugger;

            var tokens = item.items[0].data.split(':');

            return {name: tokens[0].trim(), value: tokens[1]};
        }
    };;
});