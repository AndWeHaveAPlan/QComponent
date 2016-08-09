UIComponent Button
  public {String} value
  button.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect: {{value}}
    public {Boolean} disabled: {{disabled}}
    disable: () -> disabled = true
    enable: () -> disabled = false
    .click: (e)->
       @fire('click', e)
    .mousedown: (e)->
       @fire('mousedown', e)