def UIComponent Tabs
  public items [Tab]: {{children}}
    .add: (item, index) ->
      ActiveTabIndex = index;

    .remove: (item, index) ->
      if(ActiveTabIndex == index)
        ActiveTabIndex = 0;

  public Tab ActiveTab
    get: () ->
      items[ActiveTabIndex]

  public Number ActiveTabIndex: 0
    set: (value, oldValue)->
      items[oldValue].active = false;
      items[value].active = true;

  visual
    foreach items.Tab
      render TabHeaderTemplate

    foreach items.Tab
      if {{active}}
        render


def UIComponent Tab
  public Boolean active: false

  visual
    render


Input n1: 0
  type: number

Tabs
  ActiveTabIndex: {{<>n1}}
  TabHeaderTemplate
    div{{active?'.active':''}}: {{name}}

  Tab: T1
    div
  Tab: T2
    a
  Tab: T3
    b


var Render = function(cfg, parent){
  this.children = parent.children;
}



def UIComponent M1
  div: mi
  render: {{children}}
  div: m2
  render: {{children}}

M1
  a: Link
    href: ya.ru

var M1 = function(cfg){
   UIComponent.apply(this, arguments);

   cfg.children //(a: Link)
   var _children = new MagicCollection();
   _children.push(new Div({value: 'mi', parent: this}));
   _children.push(new Render({value: cfg.items, parent: this}));
   _children.push(new Div({value: 'm2', parent: this}));
   _children.push(new Render({value: cfg.items, parent: this}));
};

M1.prototype = Object.create(UIComponent.prototype);

var m = new M1({});
m.addChild(new a({value: 'Link', href: 'ya.ru'}));