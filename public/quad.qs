def UIComponent main
 div
  input a: 8
    type: number
  span: x
  sup: 2
  span: +
  input b: 11
    type: number
  span: x +
  input c: 3
    type: number
  span: = 0

 div
   span: D = b
   sup: 2
   span: - 4ac =
   span D: {{b.value*b.value-4*a.value*c.value}}

 div
   span: x1 = (-b + \u221aD)/2a = (-{{b.value}} + {{Math.sqrt(D.value)}}) / (2*{{a.value}}) = {{(-b.value + Math.sqrt(D.value)) / (2*a.value)}}
 div
   span: x2 = (-b - \u221aD)/2a = (-{{b.value}} - {{Math.sqrt(D.value)}}) / (2*{{a.value}}) = {{(-b.value - Math.sqrt(D.value)) / (2*a.value)}}