def Page main
 div
  input a: 8
    type: number
    .click: (e)->
      console.log(e, a,b,c);
  span: x
  sup: 2
  span: +
  input b: 11
    type: number
  span: x +
  input c: 3
    type: number
  span: = 0

 public Number d0:11
 div
   span: D = b
   sup: 2
   span: - 4ac =
   span D: {{b.value*b.value-4*a.value*c.value}}
   span D: {{b*b-4*a*c}}
     .click: ()->
       var x = D.raw;
       x.background
       get(self.get('D'), 'background')


 div
   span: x1 = (-b + \u221aD)/2a = (-{{b.value}} + {{Math.sqrt(D.value)}}) / (2*{{a.value}}) = {{(-b.value + Math.sqrt(D.value)) / (2*a.value)}}
 div
   span: x2 = (-b - \u221aD)/2a = (-{{b.value}} - {{Math.sqrt(D.value)}}) / (2*{{a.value}}) = {{(-b.value - Math.sqrt(D.value)) / (2*a.value)}}