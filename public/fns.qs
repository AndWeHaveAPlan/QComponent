def Page main
  Number n1:2
  public Number n2:3
  input n3: 4
    type: number
    .click: ()->
      n1 = n2
      n2 = n3
      n3 = n1
      n3.value = n1
      n3.type = 'number'+n1+n3.type+n3.value