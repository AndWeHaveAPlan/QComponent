def Page main
  div
      TestInput i1: 123

      TestInput i2: 234

      TestInput i3: 345

      TestInput: 456
      TestInput: 567

  Label: {{i1}},{{i2}},{{i3}}
  br
  TestInput: {{ActiveElement}}

  Keyboard