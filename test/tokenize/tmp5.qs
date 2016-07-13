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
