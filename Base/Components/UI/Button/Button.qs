use HTML

button.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect: {{value}}
  value {String}
  disabled {Boolean}: {{disabled}}
  disable: () -> disabled = true
  enable: () -> disabled = false
  .click: (e)->
     @fire('click', e)
  .mousedown: (e)->
     @fire('mousedown', e)