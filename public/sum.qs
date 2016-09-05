def LogicalComponent Summator
    public Number a: 0
    public Number b: 0
    public Number c: {{a+b}}


def Page main
  Summator s1
    a: {{i1}}
    b: {{i2}}

  input i1
      type: number

  input i2
      type: number

  span: Result: {{s1.c}}