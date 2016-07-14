/**
 * Created by zibx on 7/14/16.
 */
module.exports = {
    removeFirstWord: function (item, word) {
        var subItem = item.items[0], pos;
        subItem.data = subItem.data.substr(pos = subItem.data.indexOf(word)+word.length);
        subItem.col += pos;
        subItem.pureData = subItem.data.substr(subItem.pureData.indexOf(word)+word.length);

        if(subItem.data.length === 0)
            item.items.shift();
    },
    
    /**
     * Split items by symbol
     */ 
    split: function (items, symbol, count, trim) {
        var parts = [], part = [], sliced = false,
            i, _i = items.length, tmp, tmpItem, item, alreadyCount = 1,
            symbol = symbol || ':',
            emptyCount = count === void 0;

        for (i = 0, _i; i < _i; i++) {
            item = items[i];
            if (item.type === 'text' && (emptyCount || alreadyCount < count)) {
                if (( tmp = item.pureData.indexOf(symbol)) > -1) {
                    tmpItem = Object.create(item);
                    tmpItem.pureData = item.pureData.substr(0, tmp); 
                    part.push( tmpItem );
                    parts.push(part);
                    if (!sliced) {
                        items = items.slice();
                        sliced = true;
                    }
                    tmpItem = Object.create(item);
                    tmpItem.pureData = item.pureData.substr(tmp+1);
                    items[i] = tmpItem;
                    part = [];
                    i--;
                    alreadyCount++;
                } else {
                    part.push(item);
                }
            } else
                part.push(item);
        }
        parts.push(part);
        if (parts.length < count)
            for (i = parts.length; i < count; i++)
                parts.push([])
        if(trim){
            for(i = parts.length; i;){
                part = parts[--i];
                if(part.length){
                    part = part[part.length-1];
                    if(part.type === 'text')
                        part.pureData = part.pureData.replace(/\s*$/,'');
                    
                    part = parts[i][0]
                    if(part[0] === 0)
                        part[1] = part[1].replace(/^\s*/,'');
                }
            }
        }
        return parts;
    }
};