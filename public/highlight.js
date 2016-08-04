var lastText, items = [], oldBg, oldC;
var inverse = function(list, back){
    var item = list[0];
    if(item){
        if(!back)
            var style = window.getComputedStyle(item, null),
                bg = oldBg = '#fff',
                c = oldC = style.color, i;

        for( i = list.length;i;){
            style = list[--i].style;
            if(back){
                style.background = oldBg;
                style.color = oldC;
            }else{
                style.background = c;
                style.color = bg;
            }
        }
    }
};
window.addEventListener('mousemove', function(e){var t = e.target; if(t!== document.body){
    var tag = t.tagName,
        text = t.innerText;
    if(text !== lastText){
        if(items.length)
            inverse(items, true);
        items = [];
        console.log(t.className)
        if(t.className !== 'highlight'){
            items = [].filter.call(document.querySelectorAll(tag), function(el){ return el.innerText === text });
            inverse(items);
        }
    }
    lastText = text;
}})