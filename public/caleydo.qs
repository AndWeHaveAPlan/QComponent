def Page main
    div

        //rotation: {{s1.value/2}}
        HBox
            width: 630px
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/2*255)|0}}, {{((Math.sin(s1.value/s2.value/0.7+37)+1)/2*255)|0}})
                div
                    background: #1100ac
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 1
                            //border: 3px solid red
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #1133ac
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #1166ac
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1}}
                    HBox
                        width: 210px
                        div
                            background: #1133ac
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #1166ac
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #1166ac
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #1133ac
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}

            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/3*255)|0}}, {{((Math.sin(s1.value/s2.value/0.3+37)+1)/2*255)|0}})
                div
                    background: #1133ac
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 2
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #1155ac
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #1166ac
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #1155ac
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #1166ac
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #1166ac
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #1155ac
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}

            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/1.5*255)|0}}, {{((Math.sin(s1.value/s2.value/0.5+37)+1)/2*255)|0}})
                div
                    background: #1166ac
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 3
                            background: #1166dd
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #1155ac
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #1155ac
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #1166dd
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #66aacc
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #1155ac
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #1166dd
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}

        HBox
            width: 630px
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value+6)+1)/1.5*255)|0}}, {{((Math.sin(s1.value/s2.value/0.5+37)+1)/2*255)|0}})
                div
                    background: #aa4400
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 4
                            background: #aa44ff
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #aa5566
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #aa66aa
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #aa5566
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #aa66aa
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #aa44ff
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #aa66aa
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #aa44ff
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #aa5566
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/2*255)|0}}, {{((Math.sin(s1.value/s2.value/0.7+37)+1)/2*255)|0}})
                div
                    background: #aa5500
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 5
                            background: #bb44ff
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #bb5566
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #bb66aa
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #bb5566
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #bb66aa
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #bb44ff
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #bb66aa
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #bb44ff
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #bb5566
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/3*255)|0}}, {{((Math.sin(s1.value/s2.value/0.3+37)+1)/2*255)|0}})
                div
                    background: #aa6600
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 6
                            background: #7744ff
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #775566
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #7766aa
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #775566
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #7766aa
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #7744ff
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #7766aa
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #7744ff
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #775566
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}

        HBox
            width: 630px
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/1.5*255)|0}}, {{((Math.sin(s1.value/s2.value/0.5+37)+1)/2*255)|0}})
                div
                    background: #550033
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 7
                            background: #550000
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #553311
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #553377
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #553377
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #550000
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #553311
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #553311
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #553377
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #550000
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value+6)+1)/1.5*255)|0}}, {{((Math.sin(s1.value/s2.value/0.5+37)+1)/2*255)|0}})
                div
                    background: #553333
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 8
                            background: #880000
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #883311
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #883377
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #883377
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #880000
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #883311
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #883311
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #883377
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #880000
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}
            div
                background: rgb({{col1}}, {{((Math.sin(s1.value/s2.value)+1)/2*255)|0}}, {{((Math.sin(s1.value/s2.value/0.7+37)+1)/2*255)|0}})
                div
                    background: #556633
                    height: 210px
                    width: 210px
                    transform-origin: center center
                    rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div: 9
                            background: #880044
                            height: 70px
                            width: 70px
                            transform-origin: right bottom
                            rotation: {{s1.value}}
                        div
                            background: #883355
                            height: 70px
                            width: 70px
                            transform-origin: center bottom
                            rotation: {{s1.value}}
                        div
                            background: #8833bb
                            height: 70px
                            width: 70px
                            transform-origin: left bottom
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #8833bb
                            height: 70px
                            width: 70px
                            transform-origin: right center
                            rotation: {{s1.value}}
                        div
                            background: #880044
                            height: 70px
                            width: 70px
                            transform-origin: center center
                            rotation: {{s1.value}}
                        div
                            background: #883355
                            height: 70px
                            width: 70px
                            transform-origin: left center
                            rotation: {{s1.value}}
                    HBox
                        width: 210px
                        div
                            background: #883355
                            height: 70px
                            width: 70px
                            transform-origin: right top
                            rotation: {{s1.value}}
                        div
                            background: #8833bb
                            height: 70px
                            width: 70px
                            transform-origin: center top
                            rotation: {{s1.value}}
                        div
                            background: #880044
                            height: 70px
                            width: 70px
                            transform-origin: left top
                            rotation: {{s1.value}}


    Slider s1: 200
        from: 0
        to: 510
        step: 1
    Slider s2: 20
        from: 0
        to: 40
        step: 1


    public Number col1: {{Math.ceil(s1.value/2)}}

    span: {{s2.value}}
