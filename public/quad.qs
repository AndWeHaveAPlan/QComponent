def Page main

 public Number dd0: {{b*b}}
 Number dd1: {{4*a*c}}


 span: {{dd0}} : {{dd1}} :: {{D}}

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
   /*
        // pipes of D
        mutatingPipe = new Base.Pipes.MutatingPipe(
        ['b', 'b.value', 'a', 'a.value', 'c', 'c.value'],
        {
            component: D.id,
            property: 'value'
        }
        );
        mutatingPipe.addMutator(function(b, bvalue, a, avalue, c, cvalue) {
            return ( bvalue * bvalue - 4 * avalue * cvalue) ;
        });
        eventManager.registerPipe(mutatingPipe);
        // events of D
           */
   //span D: {{b.value*b.value-4*a.value*c.value}}
   span D: {{b*b-4*a*c}}



 div
   span: x1 = (-b + \u221aD)/2a = (-{{b}} + {{Math.sqrt(D)}}) / (2 * {{a}}) = {{(-b + Math.sqrt(D)) / (2*a)}}
 div
   span: x2 = (-b - \u221aD)/2a = (-{{b}} - {{Math.sqrt(D)}}) / (2*{{a}}) = {{(-b - Math.sqrt(D)) / (2*a)}}

