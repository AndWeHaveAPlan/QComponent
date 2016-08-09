def Page main
    background: rgba({{s1.value|0}},{{s2.value}},{{s3.value}},1)
    VBox
        Slider s1: 50
            from: 0
            to: 255

        input: {{s1.value}}

        Slider s2: 100
            from: 0
            to: 255
            step: 1

        input: {{s2.value}}

        Slider s3:200
            from: 0
            to: 255
            step: 5

        input: {{s3.value}}