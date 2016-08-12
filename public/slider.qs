def Page main
    background: rgba({{s1.value|0}},{{s2.value}},{{s3.value}},1)
    VBox
        Slider s1: 50
            from: 0
            to: 255
            fillColor: rgb({{s1.value|0}}, 0, 0)

        span: Red: {{s1.value}}

        Slider s2: 100
            from: 0
            to: 255
            step: 1
            fillColor: rgb(0, {{s2.value}}, 0)

        span: Green: {{s2.value}}

        Slider s3:200
            from: 0
            to: 255
            step: 5
            fillColor: rgb(0, 0, {{s3.value}})

        span: Blue: {{s3.value}}