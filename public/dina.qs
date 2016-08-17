def Page main
    div
        HBox
            width: 150px
            div
                background: #1100ac
                height: 50px
                width: 50px
                transform-origin: right bottom
                rotation: {{s1.value}}
            div
                background: #1133ac
                height: 50px
                width: 50px
                transform-origin: center bottom
                rotation: {{s1.value}}
            div
                background: #1166ac
                height: 50px
                width: 50px
                transform-origin: left bottom
                rotation: {{s1.value}}


        HBox
            width: 150px
            div
                background: #aa4400
                height: 50px
                width: 50px
                transform-origin: right center
                rotation: {{s1.value}}
            div
                background: #aa5500
                height: 50px
                width: 50px
                transform-origin: center center
                rotation: {{s1.value}}
            div
                background: #aa6600
                height: 50px
                width: 50px
                transform-origin: left center
                rotation: {{s1.value}}

        HBox
            width: 150px
            div
                background: #550033
                height: 50px
                width: 50px
                transform-origin: right top
                rotation: {{s1.value}}
            div
                background: #553333
                height: 50px
                width: 50px
                transform-origin: center top
                rotation: {{s1.value}}
            div
                background: #556633
                height: 50px
                width: 50px
                transform-origin: left top
                rotation: {{s1.value}}


        Slider s1: 180
          width 500px
          from: 0
          to: 720
          step: 1

    br
    div
        background: #aaaacc
        height: 100px
        width: 100px
        border-radius: 50px
        /*transform: [
            {type:'rotation', angle: 30},
            {type:'scale', x:0.5,y:0.5},
            {type:'translation', x:50,y:50}
        ]*/
        rotation: {{degNum}}
        transition: all 0.2s

        div
            background: #aaccaa
            height: 10px
            width: 10px
            position: relative
            top: 5px
            left: 45px
    br
    public Number degNum: 0
    input: ротат
        type: button
        width: 100px
        .click: ()->
            self.degNum += 50;

    span: degNum = {{degNum}}