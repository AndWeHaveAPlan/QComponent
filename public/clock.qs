def Page main
    div
        float: right
        position: relative
        background: #aaaacc
        height: 100px
        width: 100px
        border-radius: 50px
        rotation: {{rotatHour}}
        transition: all 0.2s

        div squar
            background: #ffccaa
            height: 15px
            width: 5px
            position: absolute
            top: {{sqCenter}}px
            left: 47.5px
        div
            position: absolute
            background: 'rgba(0,0,0,0.3)'
            height: 90px
            width: 90px
            border-radius: 45px
            margin: 5px
            rotation: {{rotatMinute}}
            transition: all 0.2s
            div squar2
                position: absolute
                background: #ff77cc
                height: 15px
                width: 2px
                top: {{sqCenter}}px
                left: 44px
            div
                background: 'rgba(0,0,0,0.2)'
                position: absolute
                height: 80px
                width: 80px
                border-radius: 40px
                margin: 5px
                rotation: {{rotatSecond}}
                transition: all 0.2s
                div squar3
                    background: #000000
                    height: 15px
                    width: 1px
                    position: absolute
                    top: {{sqCenter}}px
                    left: 39.5px
    br
    public Number rotatHour: 0
    public Number rotatMinute: 0
    public Number rotatSecond: 0
    public Number minutes: 0
    public Number hours: 0
    public Number seconds: 0

    input: tick
        margin: 5px
        type: button
        width: 100px
        .click: function(){

            t0.enabled = !t0.enabled

            self.rotatHour = 0
            self.rotatMinute = 0
            self.rotatSecond = 0

        }

    Timer t0
        enabled: false
        interval: 1000
        .tick: function(){
            var d = new Date();
            self.seconds = d.getSeconds();
            self.minutes = d.getMinutes();
            self.hours = d.getHours();
            if (self.hours > 12)
                self.hours -= 12
            self.rotatHour = 360/12*self.hours
            self.rotatMinute = 360/60*self.minutes - self.rotatHour
            self.rotatSecond = 360/60*self.seconds - self.rotatMinute - self.rotatHour
    }

    span: часы {{hours}}, минуты {{minutes}}, секунды {{seconds}}

    br
    input: ротат
        margin: 5px
        type: button
        width: 100px
        .click: function(){
            self.rotatHour += 50;
            if (self.rotatHour >= 360)
                self.rotatHour -= 360;
        }
    span: отклонение = {{rotatHour}} градусов

    br
    span: волшебный батон, добавь мне градусов вот стока:
    input degPlus
        margin: 5px
        type: number
        width: 50px
        background: #aaaaaa
    input: го
        type: button
        width: 100px
        .click: function(){
            self.rotatHour += degPlus-0;
            if (self.rotatHour >= 360)
                self.rotatHour -= 360;
        }

    br
    public Number sqCenter: 1
    span: двигать стрелки:
    input: в центр
        margin: 5px
        type: button
        width: 100px
        .click: function(){
            if (self.sqCenter < 50)
                self.sqCenter += 5
        }
    input: наружу
        type: button
        width: 100px
        .click: function(){
            if (self.sqCenter > 0)
                self.sqCenter -= 5
        }