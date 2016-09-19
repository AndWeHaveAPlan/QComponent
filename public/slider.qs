def Page main
    opacity: {{a}}
    background: rgba({{s1|0}},{{s2.value}},{{s3}})
    VBox
        //skew: {{[s2.value*0.003,-s2.value*0.003]}}
        Slider s1: 50
            from: 0
            to: 255
            fillColor: rgb({{s1.value|0}}, 0, 0)

        span: Red: {{s1}}

        Slider s2: 100
            from: -255
            to: 255
            step: 1
            fillColor: rgb(0, {{s2}}, 0)

        span: Green: {{s2}}

        Slider s3:200
            from: 0
            to: 255
            step: 5
            fillColor: rgb(0, 0, {{s3}})

        span: Blue: {{s3}}

        Slider a: 100
            from: 0
            to: 100

        input: 8
          type: number
          .click: ()->
            //this.set('value', this.get('value')+1)
            this.value = this.value+1;
            //this.value+=1;