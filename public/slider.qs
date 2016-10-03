def Page main
    opacity: {{opacity}}
    background: rgba({{s1|0}},{{s2.value}},{{s3}},1)
    VBox ljadw
        //skew: {{[s2.value*0.003,-s2.value*0.003]}}
        Slider s1: 50
            from: 11//фуфя /* dawd */ aa
            to: 255
            fillColor: rgb({{s1.value|0}}, 0, 0)

        Label: Red: {{s1}}

        Slider s2: 100
            from: -255
            to: 255
            step: 1
            fillColor: rgb(0, {{s2}}, 0)

        Label: Green: {{s2}}

        Slider s3:200
            from: 0
            to: 255
            step: 5
            fillColor: rgb(0, 0, {{s3}})

        Label: Blue: {{s3}}

        Slider opacity: 1
            from: 0
            to: 1

        Label: Page opacity: {{opacity}}

        input: 8
          type: number
          .click: ()->
            //this.set('value', this.get('value')+1)
            this.value = this.value+1;
            //this.value+=1;