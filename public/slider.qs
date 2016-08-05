def UIComponent main
 div
  Slider s1
    from: 10
    to: 20
    //step: 1
 div
  b: _
 input: {{s1.value}}


 div
   Slider s2
     from: 1
     to: 93
     step: 1
 div
   b: _
 input: {{s2.value}}


 div
   Slider s3
     from: 6
     to: 13
     step: 0.5
 div
   b: _
 input: {{s3.value}}